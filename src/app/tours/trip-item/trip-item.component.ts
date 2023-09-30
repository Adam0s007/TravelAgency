import { Component,Input,  OnInit} from '@angular/core';
import { ExtremePricesService } from 'src/app/services/extreme-prices.service';
import { MyBucketService } from 'src/app/services/my-bucket.service';
import { TripDataService } from 'src/app/services/trip-data.service';
import { Wycieczki } from 'src/app/wycieczki.model';
import {AngularFireDatabase} from '@angular/fire/compat/database';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
@Component({
  selector: 'trip-item',
  templateUrl: './trip-item.component.html',
  styleUrls: ['./trip-item.component.css']
})
export class TripItemComponent implements OnInit{
  @Input() tripElement: Wycieczki = new Wycieczki();
  @Input() elementId:number = this.tripsDataService.fromNameToId[this.tripElement.name]; 
  constraint:number = 4;
  vacanties:number =0;
  maxVacancy:number =0;
  statusList:Array<number> =[];
  
  constructor(private tripsDataService:TripDataService,
    private extremePrices: ExtremePricesService,
    private myBucket:MyBucketService,
    private db:AngularFireDatabase,public AuthService:AuthService,private router:Router){
    this.tripsDataService.removingFromBucket.subscribe((trip:Wycieczki)=>{
      
      if(trip.name === this.tripElement.name){//bez tego ifa emiter wysle info do wszystkich elementow!
        this.vacanties+=this.myBucket.myTripsCounter[this.tripElement.name];
        this.tripsDataService.vacancyList[this.elementId] = this.vacanties;
        this.db.list('vacancyList').set(`${this.elementId}`,this.vacanties)
        this.extremePrices.viewChanger(this.tripsDataService.tripsData,this.tripsDataService.vacancyList);
      }
      
    })

    this.tripsDataService.decreaseMaxVacancy.subscribe(//to jest listener powiazany z zakupami! 
      (trip:Wycieczki)=>{
        
      if(trip.name === this.tripElement.name){
        
        this.tripsDataService.maxVacancyList[this.elementId] = this.vacanties;
        this.db.list('maxVacancyList').set(`${this.elementId}`,this.vacanties)
        this.maxVacancy = this.tripsDataService.maxVacancyList[this.elementId];
        //console.log(this.tripElement.name,": ",this.maxVacancy)
        //console.log("from trip-item i am here!")
        //console.log(this.vacanties,this.maxVacancy);
        //dodatkowo poniewaz zwalniamy to miejsce, musimy vacanties ustawic na 
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
  
  getMinActualPriceIndex(){
    return this.extremePrices.getMinAvailablePrice().index
  }
  getMaxActualPriceIndex(){
    return this.extremePrices.getMaxAvailablePrice().index
  }
  
  
  onPictureClick(){
    console.log(this.AuthService.myUser)
    if(this.AuthService.userLoggedIn) this.router.navigate(['/tours',this.elementId])
  }
  
  
}
