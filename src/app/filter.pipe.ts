import { Pipe, PipeTransform } from '@angular/core';
import { ExtremePricesService } from './services/extreme-prices.service';
import { TripDataService } from './services/trip-data.service';
import { Wycieczki } from './wycieczki.model';

@Pipe({
  name: 'filter',
  pure:false
})
//filter:filteredName:filteredDestination:filteredStartDate:filteredEndDate:filteredMinPrice:filteredMaxPrice:filteredRate
export class FilterPipe implements PipeTransform {
  constructor(private tripsDataService:TripDataService,private extremePrices: ExtremePricesService){}
  newVacancyList:Array<number> = [];
  transform(value: any, 
    filteredName:string,
    filteredDestination:string,
    filteredStartDate:string,
    filteredEndDate:string,
    filteredMinPrice:number|null,
    filteredMaxPrice:number|null,
    filteredRate:number|null,
    checkingVacancies:boolean,
    locations:string[],
    stars:number[],
    flagsStatus:Array<boolean>): any {
    if(value.length === 0){
      return value;
    }
    let index = 0; 
    const resultArray = [];
    for(const item of value){
      if(item === undefined)continue
      let elemId = this.tripsDataService.fromNameToId[item.name]
      let rateServ = this.tripsDataService.rateList[elemId]
      let status = this.tripsDataService.statusList[elemId]
      let vacancy = this.tripsDataService.getVacancyList()[elemId]
      let properFlag = 0;
      if((checkingVacancies && vacancy !== 0)|| (!checkingVacancies)) properFlag+=1;
      //console.log(properFlag)
      if((filteredName !== '' && item.name.toUpperCase().includes(filteredName.toUpperCase())) || filteredName === '') properFlag+=1;
      //console.log(properFlag)
      if(((filteredDestination !== '' && item.destination.toUpperCase().includes(filteredDestination.toUpperCase())) || filteredDestination === '')
      ) properFlag+=1;
      //console.log(properFlag)
      if((this.IntDate(filteredEndDate)===-1 || this.IntDate(filteredStartDate)===-1) || (
        this.IntDate(filteredEndDate) >= this.IntDate(item.endDate) && this.IntDate(filteredStartDate) <= this.IntDate(item.startDate)
      ))properFlag+=1;
      //console.log(properFlag)
      if((filteredMinPrice===null || filteredMaxPrice===null) || (
        filteredMaxPrice >= item.unitPrice && item.unitPrice >= filteredMinPrice
      ))properFlag+=1;
      //console.log(properFlag)
      if((filteredRate === null || (filteredRate !== null && filteredRate === rateServ)) || stars.length === 0)properFlag+=1
      //console.log(properFlag)
      if(status !== -1 && flagsStatus.every(status => !status) || flagsStatus[status] === true )properFlag+=1
      if(properFlag === 7){
        
        if(locations.length !== 0 && !locations.includes(item.destination)) continue
        if(stars.length !== 0 && !stars.includes(rateServ))continue
        
        resultArray.push(item)
      }
      

    }

    this.extremePrices.viewChanger(resultArray,this.tripsDataService.getVacancyList(),this.tripsDataService.fromNameToId)    
    return resultArray;
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

  makeVacancyList(array:any[]){
    array.forEach((trip:Wycieczki,ind)=>{
      let id = this.tripsDataService.fromNameToId[trip.name]
      this.newVacancyList.push(this.tripsDataService.getVacancyList()[id])
    })
  }





}
