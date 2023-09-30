import { Injectable, NgZone } from '@angular/core';
import * as auth from 'firebase/auth';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { HttpClient,HttpErrorResponse } from '@angular/common/http';
import { catchError, tap } from 'rxjs/operators';
import { BehaviorSubject, Observable, Subject, throwError } from 'rxjs';
import { User } from '../user.model';
import { Router } from '@angular/router';
import { TripDataService } from './trip-data.service';
import {AngularFireDatabase} from '@angular/fire/compat/database';
import { BoughtTripsService } from './bought-trips.service';
import { BoughtTrip } from '../boughtTrip.model';
import { Wycieczki } from '../wycieczki.model';
@Injectable({
  providedIn: 'root',
})
export class AuthService {


userLoggedIn:boolean = false;
readonly authState$: Observable<any> =this.afAuth.authState;
persistenceSetting: string = 'local';
persistences:any =  {'local':'local','session':'session','none':'none'}
myUser:any = null;
myUserDbObject:any = null;
myUserRole = {
  admin: false,
  manager: false,
banned: false,
client: false,
guest: true //domyslne oznaczenie osoby!

};


constructor(private boughtTrips:BoughtTripsService,private router:Router,private afAuth:AngularFireAuth,private tripDataService:TripDataService,private db:AngularFireDatabase){
  this.userLoggedIn = false;
  this.afAuth.onAuthStateChanged((user)=>{
    if(user){
      this.myUser = user;
      this.userLoggedIn = true;
      this.db.object('users/'+user.uid).valueChanges().subscribe((userDb:any)=>{
       console.log(userDb)
        this.myUserDbObject = userDb;
        this.myUserRole = userDb.roles; 
      },error=>{
        //console.log("erro has occureeeed!")
      });
      // console.log(user)
    } else{
      this.userLoggedIn = false;
      // console.log(user)
      this.myUserDbObject = null;
      this.myUserRole = {
        admin: false,
      banned: false,
      client: false,
      guest: true,
      manager: false
      };
    }
  })
  this.db.object('persistenceSettings').valueChanges().subscribe((pers:string|any)=>{
    console.log(pers)
     this.persistenceSetting = pers;
   },error=>{
     //console.log("erro has occureeeed!")
   });
   // console.log(user)
  

  this.afAuth.authState.subscribe(auth=>{
    if(auth){
      // console.log("zalogowano");
      // console.log(auth)
    }else{
      // console.log("wylogowano");
      // console.log(auth)
    }
  })
}

signUp(user:any):Promise<any>{
  return this.afAuth.createUserWithEmailAndPassword(user.email,user.password)
  .then((newUser)=>{
    let userData = new User(newUser.user);
    // console.log(userData)
    this.db.object('users/' + userData.uid).set({
      email: userData.email,
      //roles: userData.roles,
      roles: {
        guest: false,
        banned: false,
        admin: false,
      client: true,
      manager: false
      },
      info: userData.info
    });

    // console.log(userData);
  })
  .catch(error=>{
    // console.log('Auth Service: signup error',error);
    if(error.code) return {isValid:false,message:error.message}
    return error;
  })

}


logIn(email:string,password:string):Promise<any>{
  //console.log('here')
  return this.afAuth.setPersistence(this.persistenceSetting).then(() => {
    return this.afAuth
      .signInWithEmailAndPassword(email, password)
      .then((ev) => {
        this.router.navigate(['']);
      })
      .catch((error) => {
        if(error.code) return {isValid:false,message:error.message}
        return error;
      });
  });
}

changePersistence(setting:string){
  if(this.myUser && this.myUserRole.admin){
    this.persistenceSetting = this.persistences[setting];
    console.log("zmiana:",this.persistenceSetting)
    this.db.object('persistenceSettings').set(this.persistenceSetting)
  }
  
  else console.log("Sorry, you don't have permission")
}

checkIfBought(myTrip:Wycieczki){
  let flag = false;
  this.boughtTrips.boughtTours.forEach((boughtTour:BoughtTrip)=>{
      if(boughtTour.trip.name ==myTrip.name)flag = true
  })
  return flag;
}

checkPermission(myTrip:Wycieczki){
  if(this.myUserRole.client){
    return this.checkIfBought(myTrip)
  }
  return false;
}




}
