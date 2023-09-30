import { Component } from '@angular/core';
import { BoughtTripsService } from 'src/app/services/bought-trips.service';
import { FilterHistoryService } from 'src/app/services/filter-history.service';

@Component({
  selector: 'app-filter-history',
  templateUrl: './filter-history.component.html',
  styleUrls: ['./filter-history.component.css']
})
export class FilterHistoryComponent {
  flagsStatus:Array<boolean> =[false,false,false]
  //init:boolean = true
  statusMessage:Array<string> = []
  constructor(private filterHistoryService: FilterHistoryService,private boughtTrips:BoughtTripsService){
    this.statusMessage = this.boughtTrips.statusMessage
    this.filterHistoryService.resetFilterInput.subscribe((filter:Array<boolean>)=>{
      this.flagsStatus = [false,false,false];
      // console.log(this.statusMessage)
      // console.log(this.flagsStatus)
    }) 
  }

  toggleThisStatus(i:number){
    if(!this.flagsStatus[i]){
      this.flagsStatus[i] = true
      this.sendFilter()
    }else{
      this.flagsStatus[i] = false
      this.sendFilter()
    }
  }

  sendFilter(){
    
    this.filterHistoryService.filterData.emit(this.flagsStatus)
  }
  
}
