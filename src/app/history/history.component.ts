import { Component, NgZone, OnInit} from '@angular/core';
import { BoughtTrip } from '../boughtTrip.model';
import { BoughtTripsService } from '../services/bought-trips.service';
import { FilterHistoryService } from '../services/filter-history.service';
import { TripDataService } from '../services/trip-data.service';
import {AngularFireDatabase} from '@angular/fire/compat/database';
import { AngularFireAuth } from '@angular/fire/compat/auth';
@Component({
  selector: 'app-history',
  templateUrl: './history.component.html',
  styleUrls: ['./history.component.css']
})
export class HistoryComponent implements OnInit{
    userID:any = null;
    boughtTours:BoughtTrip[]|any=[]
    statusMessage:Array<string> = []
    filteredTours:Array<boolean> = [false,false,false]
    denomination:string = 'zl'
    constructor(private boughtTrips:BoughtTripsService,
      private filterHistoryService:FilterHistoryService,
      private tripDataService:TripDataService,
      private db:AngularFireDatabase,
      private afAuth:AngularFireAuth){
        this.afAuth.authState.subscribe(user => {
          console.log("i am working!")
          console.log(user)
          if (user) {
            this.userID = user.uid;
            this.db.list('users/'+user.uid+'/info/boughtTours').valueChanges().subscribe(boughtTours => {
              if(!boughtTours) this.boughtTours = []
              else this.boughtTours = boughtTours; 
              //console.log(this.boughtTours)
            },error=>{
              console.log("i am from bought trips!")
            })
          }else {
            this.boughtTours = []
            this.userID = null;
          }})
      
        this.denomination = this.tripDataService.denomination;
      this.filterHistoryService.filterData.subscribe((filterData:Array<boolean>)=>{
        this.filteredTours = filterData
        //console.log(this.filteredTours)
      })
     
    }


    getMonthName(date:Date):string {
      const month = date.getMonth();
      switch (month) {
        case 0:
          return 'January';
        case 1:
          return 'February';
        case 2:
          return 'March';
        case 3:
          return 'April';
        case 4:
          return 'May';
        case 5:
          return 'June';
        case 6:
          return 'July';
        case 7:
          return 'August';
        case 8:
          return 'September';
        case 9:
          return 'October';
        case 10:
          return 'November';
        case 11:
          return 'December';
        default:
          throw new Error('Invalid month');
      }
    }

    ngOnInit(){
      // this.boughtTours = this.boughtTrips.boughtTours
      this.statusMessage = this.boughtTrips.statusMessage
      //console.log("zakupione:",this.boughtTours)
      //console.log(this.statusMessage)  
    }
    
}





    



    






