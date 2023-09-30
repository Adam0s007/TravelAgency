import { EventEmitter, Injectable } from '@angular/core';
import { Observable, of, tap } from 'rxjs';
import { Opinion } from '../opinion.model';
import {AngularFireDatabase} from '@angular/fire/compat/database';
import { AngularFireAuth } from '@angular/fire/compat/auth';
@Injectable({
  providedIn: 'root'
})
export class OpinionsService {
  //opinie muszą być przypisane do danej wycieczki (najlepiej przez ID danej wycieczki), wiec najlepiej stworzyc obiekt, {elementID: [opinion1,opinion2,opinion3...]}
  //kazda opinia jest obiektem: {nick: "", tripName: "", text: ""} 
  opinions:any = {}
  
  constructor(private db:AngularFireDatabase,
    private afAuth:AngularFireAuth) { 

      this.afAuth.authState.subscribe(user => {
        //console.log("i am working!")
        //console.log(user)
        if (user) {
          this.db.object('opinions').valueChanges().subscribe(opinions=>{
      if(!opinions) this.opinions = {}
      else this.opinions = opinions;
    },error=>{
      //console.log("some error has occured")
    })  
        }else {
          this.opinions = {}
        }})


      
    
  
  }
  

  addOpinion(id:number,opinion:Opinion){
    if(this.opinions[id] === undefined){
      this.opinions[id] = [opinion]
      this.db.object('opinions').set(this.opinions)
    }
    else{
      this.opinions[id].push(opinion)
      this.db.object('opinions').set(this.opinions)
    } 
  }
}
