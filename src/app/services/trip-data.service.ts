import { EventEmitter, Injectable, NgZone } from '@angular/core';
import { PostService } from './post.service';
import { Wycieczki } from '../wycieczki.model';
import { ExtremePricesService } from './extreme-prices.service';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import {AngularFireDatabase} from '@angular/fire/compat/database';
import {AuthService} from '../services/auth.service';
@Injectable({
  providedIn: 'root'
})
export class TripDataService { // zawiera dane wycieczek
  data:any;
  tripsData:Wycieczki[]|any = [];
  maxVacancyList:Array<number>|any = []; //w liscie tej znajduje sie informacja o AKTUALNYM STANIE po zakupie danych wycieczek!
  vacancyList:Array<number>|any=[];
  rateList:any={};
  statusList:Array<number>|any=[];
  fromNameToId:any = {};
  denomination:string='$';
  allUsers:any = {};
  changingReservations = new EventEmitter<number>();
  
  removingAllOccurences = new EventEmitter<Wycieczki>(); //przycisk usun wycieczke musi zwolnic miejsce w koszyku
  removingFromMenuPanel = new EventEmitter<Wycieczki>();//przy klinieciu na panelu glownym na opcje z minusem
  
  addToBucket = new EventEmitter<Wycieczki>(); // bedzie dodawał daną wycieczkę do koszyka
  removingFromBucket = new EventEmitter<Wycieczki>(); // bedzie biegł do new-item by tam zwolnic rezerwacje

  decreaseMaxVacancy = new EventEmitter<Wycieczki>();

  counter:any = 0
  limitMinPrice = this.getMinAvailablePriceNumber();
  limitMaxPrice=this.getMaxAvailablePriceNumber();
  userID:any = null;
  constructor(private service:PostService,
    private extremePrices: ExtremePricesService,
    private ngZone:NgZone,
    private db: AngularFireDatabase,
    private afAuth:AngularFireAuth) { //nastepuje pobranie danych z serwisu PostService
    
      this.afAuth.authState.subscribe(user => {
        //console.log("i am working!")
        //console.log(user)
        if (user) {
          this.userID = user.uid;
          this.db.object('users/'+this.userID+'/info/rateList').valueChanges().subscribe(rateList=>{
            if(!rateList) this.rateList = {}
            else this.rateList = rateList; 
            console.log(this.rateList)
          },error=>{
            // console.log("some error has occured")
          })
        
          this.db.object('users').valueChanges().subscribe(users=>{
            this.allUsers = users;
            console.log(this.allUsers)
          },error=>{
            //console.log("you don't have permission to access users")
          })
          

        } else {
          this.userID = null;
          this.rateList = {};
          this.allUsers = {};
        }
      });

          this.db.object('tripsCounter').valueChanges().subscribe(tripsCounter=>{
            this.counter = tripsCounter;
            // console.log(this.counter);
          },error=>{
            // console.log("some error has occured")
          })
        this.db.list('maxVacancyList').valueChanges().subscribe(maxVacancyList=>{
          if(!maxVacancyList) this.maxVacancyList = []
          else this.maxVacancyList = maxVacancyList; 
        //  console.log(this.maxVacancyList)
      },error=>{
        // console.log("some error has occured")
      })
      this.db.list('statusList').valueChanges().subscribe(statusList=>{
        if(!statusList) this.statusList = []
        else this.statusList = statusList; 
        // console.log(this.statusList)
      },error=>{
        // console.log("some error has occured")
      })
      this.db.list('vacancyList').valueChanges().subscribe(vacancyList=>{
        if(!vacancyList) this.vacancyList = []
        else this.vacancyList = vacancyList; 
        // console.log(this.vacancyList)
      },error=>{
        // console.log("some error has occured")
      })
      
      this.db.object('fromNameToId').valueChanges().subscribe(fromNameToId=>{
        if(!fromNameToId)this.fromNameToId = {}
        else this.fromNameToId = fromNameToId; 
        // console.log(this.fromNameToId)
      },error=>{
        // console.log("some error has occured")
      })
      
          this.db.object('trips').valueChanges().subscribe(trip=>{
            if(trip === null){
              this.tripsData = new Array(this.counter);
            }else{
              this.tripsData = trip;
              this.transformValues(trip);
            }
            
            // console.log("stad:",this.tripsData)
      
            this.extremePrices.viewChanger(this.tripsData,this.vacancyList);
            this.limitMinPrice = this.getMinAvailablePriceNumber();
            this.limitMaxPrice=this.getMaxAvailablePriceNumber();
            
        },error=>{
          //console.log("some error has occured")
        })
    //cykliczne wywolanie 
    this.ngZone.runOutsideAngular(() => {
      setInterval(() => {
        this.ngZone.run(() => {
          this.updateStatus()
        });
      }, 1500);
    });
  }



  clearTripsData(){
    this.counter = 0;
    this.maxVacancyList = []
    this.statusList = []
    this.vacancyList = []
    this.rateList = []
    this.fromNameToId = {}
    this.tripsData = new Array(this.counter);
  }
  

  getTrips(){
    return this.tripsData;
  }
  getVacancyList(){
    return this.vacancyList
  }
  getMaxVacancyList(){
    return this.maxVacancyList;
  }
  
  removeItem(itemId:number){
    //this.fromNameToId[this.tripsData[itemId].name] = null;
    //this.tripsData[itemId] = null;
    // this.vacancyList[itemId] = -1;
    // this.rateList[itemId] = -1
    // this.statusList[itemId] = -1;
    // this.maxVacancyList[itemId] = -1;
    
    const name = this.tripsData[itemId].name
    
    this.db.list('vacancyList').set(`${itemId}`,-1);
    this.db.list('maxVacancyList').set(`${itemId}`,-1);
    //this.db.list('rateList').set(`${itemId}`,-1);
    this.db.list('statusList').set(`${itemId}`,-1);
    this.db.list('trips').remove(`${itemId}`);
    this.db.object(`fromNameToId/${name}`).remove();
    // console.log(this.getVacancyList())
    // console.log(this.tripsData[itemId])
    //sprawdzanie koszyka:
    //this.extremePrices.viewChanger(this.tripsData,this.vacancyList);
    //this.limitMinPrice = this.getMinAvailablePriceNumber();
    //this.limitMaxPrice=this.getMaxAvailablePriceNumber();
  }
  addItem(item:Wycieczki){
    // console.log(this.tripsData);
    // console.log(item)
    this.tripsData.push(item);
    // console.log(this.fromNameToId);
    // console.log(this.tripsData);
    this.vacancyList.push(item.maxPeople)
    this.maxVacancyList.push(item.maxPeople)
    this.statusList.push(-1)
    //this.rateList.push(0);
    //console.log(this.fromNameToId)
    this.fromNameToId[item.name] = this.counter;
    
    this.counter+=1 
    this.db.list('vacancyList').push(item.maxPeople);
    this.db.list('maxVacancyList').push(item.maxPeople);
    this.db.list('statusList').push(-1);
    //this.db.list('rateList').push(0);

    this.db.object('tripsCounter').query.ref.transaction(currentValue => {
      return (currentValue || 0) + 1;
    });
    this.db.object('fromNameToId').set(this.fromNameToId);
    this.db.object('trips').set(this.tripsData);
    console.log(this.tripsData)
    console.log(this.tripsData[this.fromNameToId[item.name]])
    console.log(this.tripsData[this.fromNameToId[item.name]].name)
    this.extremePrices.viewChanger(this.tripsData,this.vacancyList);
    this.limitMinPrice = this.getMinAvailablePriceNumber();
    this.limitMaxPrice=this.getMaxAvailablePriceNumber();

  }
 
  getMaxAvailablePriceNumber(){
    return this.extremePrices.getMaxAvailablePrice().number;
  }
  getMinAvailablePriceNumber(){
    return this.extremePrices.getMinAvailablePrice().number;
  }

  updateStatus(){
    this.tripsData.forEach((trip:Wycieczki)=>{
      if(trip.name in this.fromNameToId){
          let id = this.fromNameToId[trip.name]
          if(
          (this.compData(new Date(trip.startDate),new Date()) === 1 && 
          this.compData(new Date(),new Date(trip.endDate))===1)
          || (
            this.compData(new Date(trip.startDate),new Date()) === 0 && 
          this.compData(new Date(),new Date(trip.endDate))===1
          )|| (
            this.compData(new Date(trip.startDate),new Date()) === 1 && 
          this.compData(new Date(),new Date(trip.endDate))===0
          )
          ){
            this.statusList[id] = 1 //wycieczka jest realizowana
            this.db.list('statusList').set(`${id}`,this.statusList[id])
            // console.log("ja sie wywoluje")
          }
          else if(this.compData(new Date(),new Date(trip.startDate)) === 1){
            this.statusList[id] = 0 //wycieczka jest przed realizacją
            this.db.list('statusList').set(`${id}`,this.statusList[id])
            // console.log("ja sie wywoluje")
          }
          else{
            this.statusList[id] = 2 //wycieczka jest juz zakończona
            this.db.list('statusList').set(`${id}`,this.statusList[id])
            // console.log("ja sie wywoluje")
          }


      }
      
    }) 
    // console.log(this.statusList)
  }
         // date1 < date2
  compData(date1:Date,date2:Date):number{
    if(date1.getFullYear() < date2.getFullYear())return 1
    if(date1.getFullYear() > date2.getFullYear()) return -1

    if(date1.getMonth() < date2.getMonth())return 1
    if(date1.getMonth() > date2.getMonth()) return -1

    if(date1.getDate() < date2.getDate())return 1
    if(date1.getDate() > date2.getDate()) return -1

    return 0
  }

  transformValues(tripsData:any):boolean{
    // console.log(tripsData)
    if(Array.isArray(tripsData)){
      // console.log("pisze stad")  
      // console.log(this.counter)
      const newTripsData = new Array(this.counter);
      // console.log(newTripsData);
      
        for(let key in tripsData){
          newTripsData[parseInt(key)] = tripsData[key];
         
        }
        this.tripsData = newTripsData;
      return true;
    }
    const newTripsData = new Array(this.counter);
  
    for(let key in tripsData){
      newTripsData[parseInt(key)] = tripsData[key];
      
    }
    this.tripsData = newTripsData;
    
    return true;
  }


  removeTripFromAllBaskets(tripName:string){
    console.log(this.allUsers) 
    for(let keyUser in this.allUsers){
      console.log(this.allUsers[keyUser].info.myTrips)
        if(this.allUsers[keyUser].info.myTrips){
          for(let keyName in this.allUsers[keyUser].info.myTrips){
            if(this.allUsers[keyUser].info.myTrips[keyName].name == tripName){
              delete this.allUsers[keyUser].info.myTrips[keyName]
              if(tripName in this.allUsers[keyUser].info.myTripsCounter) delete this.allUsers[keyUser].info.myTripsCounter[tripName]
            }
          }

          
          
        }
     }
     this.db.object('users').set(this.allUsers);
  }

  
}
