import { Component, OnInit } from '@angular/core';
import { TripDataService } from '../../services/trip-data.service';
import {AngularFireDatabase} from '@angular/fire/compat/database';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { MyBucketService } from 'src/app/services/my-bucket.service';
@Component({
  selector: 'tours-reserved',
  templateUrl: './tours-reserved.component.html',
  styleUrls: ['./tours-reserved.component.css']
})
export class ToursReservedComponent implements OnInit{
  
  userID:any = null;
  constructor(private tripsDataService:TripDataService,private db:AngularFireDatabase,
    private afAuth:AngularFireAuth,public myBasket:MyBucketService){}
  public reservationCounter:number|any=0;
  ngOnInit(){
    
  }

}
