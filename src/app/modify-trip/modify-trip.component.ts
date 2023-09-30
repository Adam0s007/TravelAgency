import { Component, OnInit, } from '@angular/core';
import { AbstractControl, FormControl, FormGroup,  Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Filter } from '../filter.model';
import { FilterService } from '../services/filter.service';
import { TripDataService } from '../services/trip-data.service';
import { Wycieczki } from '../wycieczki.model';
import {AngularFireDatabase} from '@angular/fire/compat/database';
@Component({
  selector: 'app-modify-trip',
  templateUrl: './modify-trip.component.html',
  styleUrls: ['./modify-trip.component.css']
})
export class ModifyTripComponent implements OnInit{
  
  modify:FormGroup = new FormGroup({});
  id:string='';
  trip:Wycieczki = new Wycieczki();
  oldName:string='';
  constructor(private tripsDataService:TripDataService,
    private filterService:FilterService,
    private router:Router,
    private route: ActivatedRoute,private db:AngularFireDatabase){

    }

  ngOnInit(){
    this.modify= new FormGroup({
      'identif': new FormControl('',[Validators.required,this.dataRetrieving.bind(this)]),
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

 



  dataRetrieving(control:AbstractControl):{[s:string]: boolean}|null{
    if(control.value in this.tripsDataService.fromNameToId){
      this.id = this.tripsDataService.fromNameToId[control.value]
      this.trip = this.tripsDataService.getTrips()[this.id]
      console.log("hello")
      this.oldName = this.trip.name 
      this.modify.patchValue({
        name:this.trip.name,
        destination:this.trip.destination,
        description:this.trip.description,
        startDate:this.trip.startDate,
        endDate: this.trip.endDate,
        unitPrice:this.trip.unitPrice,
        maxPeople: this.trip.maxPeople,
        picture:this.trip.picture,
        slider:this.trip.forSlider.join(',')
      })
      return null;
    }
  
 
    return {'forbiddenModify':true}
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
   let startingDate  = this.modify.value.startDate
   let endingDate =  control.value
   if(this.IntDate(startingDate) > this.IntDate(endingDate)){
    return {'forbiddenDate':true};
   }
   return null;
  }
  
  differentNames(control:AbstractControl):{[s:string]: boolean}|null{
    let flag = true;
    this.tripsDataService.getTrips().forEach((trip:Wycieczki)=>{
     
      if(trip !== null && control.value !== null && (trip.name.toUpperCase() === control.value.toUpperCase()) && (this.trip.name !== control.value )){
        flag = false;
      }
    })
    if(!flag){return {'firbiddenName':true};}
    
    return null;
  }
  
  
  
  
  onSubmit(){
    //console.log(this.addTrips)
    
    this.trip.name = this.modify.value.name;
    this.trip.destination = this.modify.value.destination;
    this.trip.description = this.modify.value.description;
    this.trip.startDate = this.modify.value.startDate;
    this.trip.endDate = this.modify.value.endDate;
    this.trip.unitPrice = this.modify.value.unitPrice;
    this.trip.maxPeople = this.modify.value.maxPeople;
    this.trip.picture = this.modify.value.picture;
    //ze sliderem bedzie inaczej bo to jest array lista,
    this.trip.forSlider = this.modify.value.slider.split(',')
  
    const oldId = this.tripsDataService.fromNameToId[this.oldName]
    console.log(oldId)
    this.tripsDataService.tripsData[oldId] = this.trip;
    delete this.tripsDataService.fromNameToId[this.oldName]
    this.tripsDataService.fromNameToId[this.trip.name] = oldId
    

    this.db.object('fromNameToId').set(this.tripsDataService.fromNameToId);
    this.db.object('trips').set(this.tripsDataService.tripsData);
  this.filterService.filterData.emit(new Filter())//reset display filtra
  this.filterService.resetFilterInput.emit(new Filter()) // reset inputow z filtra
  this.modify.reset();
  this.router.navigate(['/tours'])
   }
  
  }
  
  