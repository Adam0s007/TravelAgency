import { EventEmitter, Injectable } from '@angular/core';
import { Wycieczki } from '../wycieczki.model';
import { BoughtTripsService } from './bought-trips.service';
import { TripDataService } from './trip-data.service';
import {AngularFireDatabase} from '@angular/fire/compat/database';
import { AngularFireAuth } from '@angular/fire/compat/auth';
@Injectable({
  providedIn: 'root'
})
export class MyBucketService {
  userID:any|null = null;
  myTrips:Wycieczki[]|any = [];
  myTripsCounter:any = {}
  myBasketInfo:any = {
    total:0,
    quantity:0  
   }

  quantityTotalData = new EventEmitter<any>();

  constructor(private tripsDataService:TripDataService,private boughtTrips:BoughtTripsService,private db:AngularFireDatabase,
    private afAuth:AngularFireAuth){


      this.afAuth.authState.subscribe(user => {
        //console.log("i am working!")
        //console.log(user)
        if (user) {
          this.userID = user.uid;
          this.db.list('users/'+user.uid+'/info/myTrips').valueChanges().subscribe((myTrips)=>{
            if(!myTrips) this.myTrips = []
            else this.myTrips = myTrips; 
            //console.log(this.myTrips)
          },error=>{
            //console.log("some error has occured")
          })
          this.db.object('users/'+user.uid+'/info/myTripsCounter').valueChanges().subscribe(myTripsCounter=>{
            if(!myTripsCounter)this.myTripsCounter = {}
            else this.myTripsCounter = myTripsCounter; 
            //console.log(this.myTripsCounter )
            
          },error=>{
            //console.log("some error has occured")
          })
      
          this.db.object('users/'+user.uid+'/info/myBasketInfo').valueChanges().subscribe(myBasketInfo=>{
            this.myBasketInfo = myBasketInfo; 
            //console.log(this.myBasketInfo)
            this.sumOfOrder()
          },error=>{
            //console.log("some error has occured")
          })
          
        }else {
          this.myTrips = []
          this.myTripsCounter = {}
          this.myBasketInfo = {
            total:0,
            quantity:0  
           }
           this.userID = null;
           this.sumOfOrder()
        }})




    
  }
  
  
  removeFromBasket(index:number){
    if(this.userID !== null){
      this.tripsDataService.removingFromBucket.emit(this.myTrips[index])
      this.tripsDataService.changingReservations.emit(-this.myTripsCounter[this.myTrips[index].name]);
      delete this.myTripsCounter[this.myTrips[index].name]
      
      this.db.object('users/'+this.userID+'/info/myTripsCounter').set(this.myTripsCounter);
      this.myTrips.splice(index,1);
      this.db.object(`users/`+this.userID+`/info/myTrips`).set(this.myTrips);
      this.sumOfOrder()
    }
    
  }
  findFirstOccurence(removingTrip:Wycieczki){
    let firstIndex = -1
    this.myTrips.forEach((trip:Wycieczki,index:number)=>{
      if(trip.name === removingTrip.name){
        firstIndex = index;
      }
    })
    return firstIndex
  }

  removeAllOccurences(removingTrip:Wycieczki){
    if(this.userID !== null){
      this.myTrips = this.myTrips.filter((trip:Wycieczki)=> trip.name !== removingTrip.name)
      this.db.object(`users/`+this.userID+`/info/myTrips`).set(this.myTrips);
      if(removingTrip.name in this.myTripsCounter){
        delete this.myTripsCounter[removingTrip.name]
        this.db.object('users/'+this.userID+'/info/myTripsCounter').set(this.myTripsCounter);
      }
      this.sumOfOrder()
    }
  }
  addToBucket(trip:Wycieczki){
    if(this.userID !== null){
      if(trip.name in this.myTripsCounter) {
        this.myTripsCounter[trip.name] +=1;
        this.db.object('users/'+this.userID+'/info/myTripsCounter').set(this.myTripsCounter);
      }
     else{
      this.myTrips.push(trip)
      this.db.list(`users/`+this.userID+`/info/myTrips`).push(trip);
      this.myTripsCounter[trip.name] = 1
      this.db.object('users/'+this.userID+'/info/myTripsCounter').set(this.myTripsCounter);
    }
      this.sumOfOrder()

    }
    
  }

  remove(trip:Wycieczki){
    if(this.userID !== null){
      let index = this.findFirstOccurence(trip)
      if(index !== -1){
       if(this.myTripsCounter[trip.name] == 1){
        delete this.myTripsCounter[trip.name]
        this.db.object('users/'+this.userID+'/info/myTripsCounter').set(this.myTripsCounter);
        this.myTrips.splice(index,1)
        this.db.object(`users/`+this.userID+`/info/myTrips`).set(this.myTrips);
       }
       else{
        this.myTripsCounter[trip.name]-=1
        this.db.object('users/'+this.userID+'/info/myTripsCounter').set(this.myTripsCounter);
       }
        
      }
      this.sumOfOrder()
    }
    
  }

  sumOfOrder(){
    let sum = 0;
    let quantity=0;
    this.myBasketInfo["total"] = 0;
    this.myBasketInfo["quantity"] = 0;
    if(this.userID !== null){
      this.myTrips.forEach((trip:Wycieczki)=> {
        sum += (trip.unitPrice*this.myTripsCounter[trip.name])
        quantity+=this.myTripsCounter[trip.name]
      })
      this.myBasketInfo["total"] = sum;
      this.myBasketInfo["quantity"] = quantity;
      this.db.object('users/'+this.userID+'/info/myBasketInfo').set(this.myBasketInfo)
      this.quantityTotalData.emit(this.myBasketInfo);
      
    }
    
  }

  removeAll(){//gdy wykupujemy wycieczke, to 
    //nasze wycieczki muszą wejsc do kontenera po nazwie!
    if(this.userID !== null){
      this.myTrips.forEach((trip:Wycieczki)=>{
        this.boughtTrips.addToBought(trip,this.myTripsCounter[trip.name]);
        this.tripsDataService.decreaseMaxVacancy.emit(trip)
      })
      
      this.tripsDataService.changingReservations.emit(-this.myBasketInfo.quantity);
      this.myTrips =[];
      this.db.object(`users/`+this.userID+`/info/myTrips`).set(this.myTrips);
      this.myTripsCounter = {}
      this.db.object('users/'+this.userID+'/info/myTripsCounter').set(this.myTripsCounter);
      this.sumOfOrder()
    }
    
  }
  removeThis(i:number){
    if(this.userID !== null){
      this.boughtTrips.addToBought(this.myTrips[i],this.myTripsCounter[this.myTrips[i].name]);
      this.tripsDataService.decreaseMaxVacancy.emit(this.myTrips[i])
      this.tripsDataService.changingReservations.emit(-this.myTripsCounter[this.myTrips[i].name]);
      delete this.myTripsCounter[this.myTrips[i].name]
      this.db.object('users/'+this.userID+'/info/myTripsCounter').set(this.myTripsCounter);
      this.myTrips.splice(i,1)
      this.db.object(`users/`+this.userID+`/info/myTrips`).set(this.myTrips);
      this.sumOfOrder()
    }
    
    
  }



}
