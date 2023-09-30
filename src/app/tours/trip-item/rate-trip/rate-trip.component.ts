import { Component, Input, OnInit } from '@angular/core';
import { TripDataService } from 'src/app/services/trip-data.service';
import {AngularFireDatabase} from '@angular/fire/compat/database';
import {AuthService} from '../../../services/auth.service';
@Component({
  selector: 'rating',
  templateUrl: './rate-trip.component.html',
  styleUrls: ['./rate-trip.component.css']
})
export class RateTripComponent implements OnInit{
  @Input() ratingId = 0;
  constructor(public tripsDataService:TripDataService,private db:AngularFireDatabase,public AuthService:AuthService){
    
  }
  nrOfHearts = 5;
  heartsIds:Array<number> = new Array<number>(this.nrOfHearts);
  rate = 0;
  
  onRating(index:number){
    if(this.AuthService.myUser !== null && this.AuthService.checkPermission(this.tripsDataService.getTrips()[this.ratingId])){
      this.rate = index+1;
      this.tripsDataService.rateList[this.tripsDataService.getTrips()[this.ratingId].name] = this.rate; 
      this.db.object('users/'+this.AuthService.myUser.uid+'/info/rateList').set(this.tripsDataService.rateList)
    }
    else{
      this.rate = 0;
    }
  }
  ngOnInit(){
    if(!(this.tripsDataService.getTrips()[this.ratingId].name in this.tripsDataService.rateList)){
      this.tripsDataService.rateList[this.tripsDataService.getTrips()[this.ratingId].name] = 0;
      this.db.object('users/'+this.AuthService.myUser.uid+'/info/rateList').set(this.tripsDataService.rateList)
    }else{
      this.rate = this.tripsDataService.rateList[this.tripsDataService.getTrips()[this.ratingId].name];
    }
  }

}
