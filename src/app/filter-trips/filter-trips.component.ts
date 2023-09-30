import {  Component} from '@angular/core';
import { Filter } from '../filter.model';
import { ExtremePricesService } from '../services/extreme-prices.service';
import { FilterService } from '../services/filter.service';
import { TripDataService } from '../services/trip-data.service';
import { Wycieczki } from '../wycieczki.model';


@Component({
  selector: 'filter-trips',
  templateUrl: './filter-trips.component.html',
  styleUrls: ['./filter-trips.component.css']
})
export class FilterTripsComponent{
  filteredName = '';
  filteredDestination = '';
  filteredMinPrice:number|null = null;
  filteredMaxPrice:number|null = null;
  filteredStartDate:string = ''
  filteredEndDate:string = ''
  filteredRate:number|null= null;
  checkingVacancies = false;
  stars:Array<number> = []
  locations:Array<string> = []
  flags:Array<boolean>= []
  tripsData:any[] =[]
  flagsRating:Array<boolean> =[]
  flagsStatus:Array<boolean> =[false,false,false]
  statusMessage:Array<string> = ['przed','w trakcie','zakończona']
  init:boolean = true
  constructor(private filterService:FilterService,private tripsDataService:TripDataService,private extremePrices: ExtremePricesService){
   if(this.init){
    for(let i = 0; i<6; i++){this.flagsRating.push(false);}
    this.init = false;
   }
   this.filterService.resetFilterInput.subscribe((filter:Filter)=>{
    this.flagsRating = []
    this.filteredName = '';
    this.filteredDestination = '';
    this.filteredMinPrice  = null;
    this.filteredMaxPrice = null;
    this.filteredStartDate  = ''
    this.filteredEndDate  = ''
    this.filteredRate = null;
    this.checkingVacancies = false;
    this.stars= []
    this.locations = []
    this.flagsStatus = [false,false,false];
    for(let i = 0; i<6; i++){this.flagsRating.push(false);}
    this.resetData()
   })
    

  }

 sendFilter(){
  this.filterService.filterData.emit(new Filter(
    this.filteredName,
    this.filteredDestination,
    this.filteredMinPrice,
    this.filteredMaxPrice,
    this.filteredStartDate,
    this.filteredEndDate,
    this.filteredRate,
    this.checkingVacancies,
    this.stars,
    this.locations,
    this.flagsStatus
  ))
 }

 getLimitMinPrice(){
  return this.extremePrices.getMinAvailablePrice().number
}
getLimitMaxPrice(){
  return this.extremePrices.getMaxAvailablePrice().number
}


giveMinim(){
    this.filteredMinPrice = this.extremePrices.getMinAvailablePrice().number
}
giveMaxim(){
    this.filteredMaxPrice = this.extremePrices.getMaxAvailablePrice().number
}

toggleThisRating(i:number){
  if(!this.flagsRating[i]){
    this.stars.push(i)
    this.flagsRating[i] = !this.flagsRating[i]
    this.sendFilter()
  }else{
    let index = this.stars.indexOf(i)
    this.stars.splice(index,1);
    this.flagsRating[i] = !this.flagsRating[i]
    this.sendFilter()
  }
}
toggleThisStatus(i:number){
  console.log("hello")
  if(!this.flagsStatus[i]){
    this.flagsStatus[i] = true
    this.sendFilter()
  }else{
    this.flagsStatus[i] = false
    this.sendFilter()
  }
}


toggleThis(trip:Wycieczki,i:number){
  if(!this.flags[i]){
    this.locations.push(trip.destination)
    this.flags[i] = !this.flags[i]
    this.sendFilter()
  }else{
    let index = this.locations.indexOf(trip.destination)
    this.locations.splice(index,1);
    this.flags[i] = !this.flags[i]
    this.sendFilter()
  }
}

getData(){
  this.flags = []
  this.tripsData =[]
  const objectMap:any = {}
    this.tripsDataService.getTrips().forEach((trip:Wycieczki)=>{
      if(!(trip.destination in objectMap)){
        this.flags.push(false)
        objectMap[trip.destination] = trip;
      }   
})
  for(let trip of Object.values(objectMap)){
    this.tripsData.push(trip)
  }
}
resetData(){
  this.flags = []
  this.tripsData =[]
}


}
