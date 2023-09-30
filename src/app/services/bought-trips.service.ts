import { Injectable, NgZone } from '@angular/core';
import { BoughtTrip } from '../boughtTrip.model';
import { Wycieczki } from '../wycieczki.model';
import {AngularFireDatabase} from '@angular/fire/compat/database';
import { AngularFireAuth } from '@angular/fire/compat/auth';
@Injectable({
  providedIn: 'root'
})
export class BoughtTripsService {
  userID:any = null;
  boughtTours:BoughtTrip[]|any=[]
  statusMessage:Array<string> = ['przed','w trakcie','zakończona']
  constructor(private ngZone:NgZone,private db:AngularFireDatabase,
    private afAuth:AngularFireAuth ) { 
    this.afAuth.authState.subscribe(user => {
      // console.log("i am working!")
      // console.log(user)
      if (user) {
        this.userID = user.uid;
        this.db.list('users/'+user.uid+'/info/boughtTours').valueChanges().subscribe(boughtTours => {
          if(!boughtTours) this.boughtTours = []
          else this.boughtTours = boughtTours; 
          //console.log(this.boughtTours)
        },error=>{
          // console.log("i am from bought trips!")
        })
      }else {
        this.boughtTours = []
        this.userID = null;
      }})

      this.ngZone.runOutsideAngular(() => {
        setInterval(() => {
          this.ngZone.run(() => { 
           if(this.userID !== null){
            this.assignTours();
           }
            
          });
        }, 2000);
      });
    
  }
  assignTours() {
    
      this.boughtTours.forEach((tour:BoughtTrip) => {
        if(
          (this.compData(new Date(tour.trip.startDate),new Date()) === 1 && 
          this.compData(new Date(),new Date(tour.trip.endDate))===1)
          || (
            this.compData(new Date(tour.trip.startDate),new Date()) === 0 && 
          this.compData(new Date(),new Date(tour.trip.endDate))===1
          )|| (
            this.compData(new Date(tour.trip.startDate),new Date()) === 1 && 
          this.compData(new Date(),new Date(tour.trip.endDate))===0
          )
          ){
          tour.status = 1; //w trakcie
          this.db.object('users/'+this.userID+'/info/boughtTours').set(this.boughtTours)
        }
        else if(this.compData(new Date(tour.trip.endDate),new Date())=== 1){
          tour.status = 2; // zakończona
          this.db.object('users/'+this.userID+'/info/boughtTours').set(this.boughtTours)
        }
        else{
          tour.status = 0; //przed
          this.db.object('users/'+this.userID+'/info/boughtTours').set(this.boughtTours)
        }
  
      });
  
  }
  addToBought(trip:Wycieczki,counter:number){
    if(this.userID !== null){
      const data:string = String(new Date().getDate()) + "-" + this.getMonthName(new Date()) + "-" +  String(new Date().getFullYear()) 
      const newTour = new BoughtTrip(trip,counter,data)
      this.boughtTours.push(newTour)
      // console.log(newTour);
      this.db.list('users/'+this.userID+'/info/boughtTours').push(newTour);
    }
    
  }

  theNearestTour():string{ 
    let number = Infinity;
    let name = "";
    this.boughtTours.forEach((tour:BoughtTrip)=>{
      if(tour.status === 0){
        let currentDate = new Date()
        let tourDate = new Date(tour.trip.startDate)  
        if(Math.abs(currentDate.getTime() - tourDate.getTime()) < number){
          number =Math.abs(currentDate.getTime() - tourDate.getTime());
          name = tour.trip.name;
        }
      }
      

    })
    return number !== Infinity ? `Najbliższa wycieczka: ${name}` : "brak zakupionych wycieczek" 
  }

  compData(date1:Date,date2:Date):number{
    if(date1.getFullYear() < date2.getFullYear())return 1
    if(date1.getFullYear() > date2.getFullYear()) return -1

    if(date1.getMonth() < date2.getMonth())return 1
    if(date1.getMonth() > date2.getMonth()) return -1

    if(date1.getDate() < date2.getDate())return 1
    if(date1.getDate() > date2.getDate()) return -1

    return 0
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


}
