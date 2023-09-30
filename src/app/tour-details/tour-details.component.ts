import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ExtremePricesService } from '../services/extreme-prices.service';
import { MyBucketService } from '../services/my-bucket.service';
import { TripDataService } from '../services/trip-data.service';
import { Wycieczki } from '../wycieczki.model';
import {AngularFireDatabase} from '@angular/fire/compat/database';
import {AuthService} from '../services/auth.service';
import { BoughtTripsService } from '../services/bought-trips.service';
import { BoughtTrip } from '../boughtTrip.model';
@Component({
  selector: 'app-tour-details',
  templateUrl: './tour-details.component.html',
  styleUrls: ['./tour-details.component.css']
})
export class TourDetailsComponent implements OnInit{
  elementId = 0;
  tripElement: Wycieczki = new Wycieczki();
  public denomination:string=this.tripsDataService.denomination;//domyslnie
  vacanties:number =0;
  maxVacancy:number =0;
  slider:[] = [];
  SliderPosition = 0;
  statusList:Array<number> =[];
  
  constructor(private route: ActivatedRoute,public AuthService:AuthService,
    private router:Router,
    private tripsDataService:TripDataService,private extremePrices: ExtremePricesService,
    private myBucket:MyBucketService,
    private db:AngularFireDatabase,private boughtTrips:BoughtTripsService) {
    this.route.params.subscribe(params => {
      this.elementId = params['id']
      //console.log(this.elementId)
      
    })
    this.tripsDataService.removingFromBucket.subscribe((trip:Wycieczki)=>{
      
      if(trip.name === this.tripElement.name){//bez tego ifa emiter wysle info do wszystkich elementow!
        this.vacanties+=this.myBucket.myTripsCounter[this.tripElement.name];  
        this.tripsDataService.vacancyList[this.elementId] = this.vacanties;
        this.db.list('vacancyList').set(`${this.elementId}`,this.vacanties)
        this.extremePrices.viewChanger(this.tripsDataService.tripsData,this.tripsDataService.vacancyList);
      }
      
    })


    this.tripElement =this.tripsDataService.getTrips()[this.elementId]
    this.slider = this.tripElement.forSlider;

    //console.log(this.tripElement)
    this.tripsDataService.decreaseMaxVacancy.subscribe(//to jest listener powiazany z zakupami! 
      (trip:Wycieczki)=>{
        
      if(trip.name === this.tripElement.name){
        
        this.tripsDataService.maxVacancyList[this.elementId] = this.vacanties;
        this.db.list('maxVacancyList').set(`${this.elementId}`,this.vacanties);
        this.maxVacancy = this.tripsDataService.maxVacancyList[this.elementId];
        
        //console.log(this.vacanties,this.maxVacancy);
        this.vacanties = this.maxVacancy;
        this.tripsDataService.vacancyList[this.elementId] = this.maxVacancy;
        this.db.list('vacancyList').set(`${this.elementId}`,this.maxVacancy)
      }
    })


  }
  ngOnInit(){
    this.elementId = this.tripsDataService.fromNameToId[this.tripElement.name];
    this.vacanties= this.tripsDataService.vacancyList[this.elementId];
    this.maxVacancy = this.tripsDataService.maxVacancyList[this.elementId];
    this.statusList = this.tripsDataService.statusList;
  }

  onClickedButton(change:number){
    this.vacanties+=change;  
    this.tripsDataService.vacancyList[this.elementId] = this.vacanties;
    this.db.list('vacancyList').set(`${this.elementId}`,this.vacanties)
    //console.log("i am here")
    if(change<0){
      //this.tripsDataService.addToBucket.emit(this.tripsDataService.getTrips()[this.elementId])
      this.myBucket.addToBucket(this.tripsDataService.getTrips()[this.elementId])
      //console.log(this.vacanties,this.maxVacancy);
      //console.log("wykuje sie tu!")
    }
    else if(change >0){
      //this.tripsDataService.removingFromMenuPanel.emit(this.tripsDataService.getTrips()[this.elementId])
      this.myBucket.remove(this.tripsDataService.getTrips()[this.elementId])
      //console.log(this.vacanties,this.maxVacancy);
      //console.log("wykuje sie tu!")
    }
    this.extremePrices.viewChanger(this.tripsDataService.tripsData,this.tripsDataService.vacancyList);
  }


  returnToPosts(){
    this.router.navigate(['../'],{relativeTo:this.route})
  }
  makeRightMoveInSlider(){
    this.SliderPosition = (this.SliderPosition + 1)%this.slider.length
  }
  makeLeftMoveInSlider(){
    this.SliderPosition = (this.SliderPosition - 1)%this.slider.length
    if(this.SliderPosition < 0) this.SliderPosition = this.slider.length -1
  }

  

}
