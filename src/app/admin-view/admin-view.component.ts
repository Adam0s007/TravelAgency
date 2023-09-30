import { Component } from '@angular/core';
import { TripDataService } from '../services/trip-data.service';
import { AuthService } from '../services/auth.service';
import {AngularFireDatabase} from '@angular/fire/compat/database';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { Router } from '@angular/router';
@Component({
  selector: 'app-admin-view',
  templateUrl: './admin-view.component.html',
  styleUrls: ['./admin-view.component.css']
})
export class AdminViewComponent{
  users:any = {};
  
constructor(private router:Router,public tripDataService:TripDataService,public AuthService:AuthService,private db: AngularFireDatabase,public afAuth:AngularFireAuth){
  this.afAuth.authState.subscribe(user => {
    if (user) {
      this.db.object('users').valueChanges().subscribe((users)=>{
        this.users = users;
        console.log("userzy:",this.users)
      },error=>{
        //console.log("you don't have permission to access users")
      })
    }else{
        this.users = {};
    }

  })
  
}

onClickBanned(key:any){
      this.tripDataService.allUsers[key].roles.banned = !this.tripDataService.allUsers[key].roles.banned
      this.db.object('users').set(this.tripDataService.allUsers);    
}
 onClickChangingRoles(key:any, strn:string){
  
  switch(strn){
    case 'admin':
      if(this.tripDataService.allUsers[key].roles.admin) this.setOneTrue(key);
      else this.setFalseExceptThis(key,strn);
      break;
    case 'manager':
      if(this.tripDataService.allUsers[key].roles.manager) this.setOneTrue(key);
      else this.setFalseExceptThis(key,strn);
      break;
    case 'client':
      if(this.tripDataService.allUsers[key].roles.client) this.setOneTrue(key);
      else this.setFalseExceptThis(key,strn);
      break;
  }  
  this.db.object('users').set(this.tripDataService.allUsers); 
  if(strn == 'admin' && !this.tripDataService.allUsers[key].roles.admin && this.AuthService.myUser.email ==this.tripDataService.allUsers[key].email ) this.router.navigate(['/home']);
  
}


changePersistenceSetting(setting:string){
 console.log('gl')
  this.AuthService.changePersistence(setting);
  }


  setFalseExceptThis(key:any,strn:string){
      for(let role in this.tripDataService.allUsers[key].roles){
        if(role == strn) this.tripDataService.allUsers[key].roles[role] =  true;
        else this.tripDataService.allUsers[key].roles[role] =  false;
      }
  }
  setOneTrue(key:any){
    let myRole = 'client';
    for(let role in this.tripDataService.allUsers[key].roles){
      if(role == myRole) this.tripDataService.allUsers[key].roles[role] =  true; 
      else this.tripDataService.allUsers[key].roles[role] =  false;
    }
  }
  


}
