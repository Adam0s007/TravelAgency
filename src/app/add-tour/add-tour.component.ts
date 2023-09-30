import { Component, OnInit, } from '@angular/core';
import { AbstractControl, FormControl, FormGroup,  Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Filter } from '../filter.model';
import { FilterService } from '../services/filter.service';
import { TripDataService } from '../services/trip-data.service';
import { Wycieczki } from '../wycieczki.model';

@Component({
  selector: 'add-tour',
  templateUrl: './add-tour.component.html',
  styleUrls: ['./add-tour.component.css']
})
export class AddTourComponent implements OnInit{
  
addTrips:FormGroup = new FormGroup({});

constructor(private tripsDataService:TripDataService,
  private filterService:FilterService,
  private router:Router,
  private route: ActivatedRoute){}
ngOnInit(){
  this.addTrips= new FormGroup({
    'name': new FormControl('', [
      Validators.required,
      Validators.minLength(3),
      this.differentNames.bind(this)
    ]),
    "destination": new FormControl('', [
      Validators.required,
      Validators.minLength(3)
    ]),
    "startDate": new FormControl('',[Validators.required, this.EarlierThanToday.bind(this)
       ]),
     "endDate": new FormControl('',[Validators.required,this.differentDates.bind(this)]),
    "unitPrice": new FormControl(0,[Validators.required,this.maxLength.bind(this)]),
    "maxPeople": new FormControl(5,Validators.required),
    "description": new FormControl('One of the best tours you must sign up for!', [
      Validators.required,
      Validators.minLength(3),
    ]),
    "picture": new FormControl('',Validators.required),
    "slider": new FormControl('',Validators.required)
  });
  
}
newDate(oldDate:string){
if(oldDate === undefined || oldDate === '' || oldDate === null)return ''
if(oldDate.includes('-')){
  let newArr = oldDate.split('-')
  let temp = newArr[0]
  newArr[0] = newArr[1]
  newArr[1] = temp
  if(newArr[0].length === 1) newArr[0] = '0'+newArr[0]
  return newArr.reverse().join('-')
}else{
  let newArr = oldDate.split('/')
  let temp = newArr[0]
  newArr[0] = newArr[1]
  newArr[1] = temp
  if(newArr[0].length === 1) newArr[0] = '0'+newArr[0]
  return newArr.reverse().join('-')
}
  
}
IntDate(oldDate:string){
  if(oldDate === '' || oldDate === undefined || oldDate === null)return -1;
  let newArr = oldDate.split('-')
  let num:string='';
  newArr.forEach(e=>{
    num+=e;
  })
  let numInt:number = 0;
  numInt = parseInt(num);
  return numInt
}

maxLength(control:AbstractControl):{[s:string]: boolean}|null{
  let num = String(control.value)
  if((num.length > 12)){
    return {'forbiddenNumber':true}
  }
  return null
}

EarlierThanToday(control:AbstractControl):{[s:string]: boolean}|null{
  let startingDate  = control.value;
  //console.log(control)
  let today = this.newDate(new Date().toLocaleDateString())
  
  if(this.IntDate(today) > this.IntDate(startingDate)){
    return {'forbiddenDate':true};
  }
  return null;
 }


differentDates(control:AbstractControl):{[s:string]: boolean}|null{
 let startingDate  = this.addTrips.value.startDate
 let endingDate =  control.value
 if(this.IntDate(startingDate) > this.IntDate(endingDate)){
  return {'forbiddenDate':true};
 }
 return null;
}

differentNames(control:AbstractControl):{[s:string]: boolean}|null{
  let flag = true;
  this.tripsDataService.getTrips().forEach((trip:Wycieczki)=>{
   
    if(trip !== null && control.value !== null && trip.name.toUpperCase() === control.value.toUpperCase()){
      flag = false;
    }
  })
  if(!flag){return {'firbiddenName':true};}
  
  return null;
}




onSubmit(){
  //console.log(this.addTrips)
  const nowaWycieczka = new Wycieczki();
  nowaWycieczka.name = this.addTrips.value.name;
  nowaWycieczka.destination = this.addTrips.value.destination;
  nowaWycieczka.description = this.addTrips.value.description;
  nowaWycieczka.startDate = this.addTrips.value.startDate;
  nowaWycieczka.endDate = this.addTrips.value.endDate;
  nowaWycieczka.unitPrice = this.addTrips.value.unitPrice;
  nowaWycieczka.maxPeople = this.addTrips.value.maxPeople;
  nowaWycieczka.picture = this.addTrips.value.picture;
  //ze sliderem bedzie inaczej bo to jest array lista,
  nowaWycieczka.forSlider = this.addTrips.value.slider.split(',')

this.filterService.filterData.emit(new Filter())//reset display filtra
this.filterService.resetFilterInput.emit(new Filter()) // reset inputow z filtra
this.tripsDataService.addItem(nowaWycieczka);
this.addTrips.reset();


this.router.navigate(['/tours'])
 }

}

