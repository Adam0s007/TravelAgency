import { AfterViewInit, Component, Input,  OnInit} from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { Opinion } from 'src/app/opinion.model';
import { OpinionsService } from 'src/app/services/opinions.service';
import { TripDataService } from 'src/app/services/trip-data.service';
import {AuthService} from '../../services/auth.service';
@Component({
  selector: 'app-posts',
  templateUrl: './posts.component.html',
  styleUrls: ['./posts.component.css']
})
export class PostsComponent implements OnInit{
@Input() elementId:any;

posts:Array<Opinion> = [];
constructor(public tripsDataService:TripDataService,private opinionsService: OpinionsService,public AuthService:AuthService){}
optionalTripName:string = "";

addPost:FormGroup = new FormGroup({});
errors:Array<string> = [];

  ngOnInit(){
    this.addPost= new FormGroup({
      "nick": new FormControl(''),
      //"tripName": new FormControl(''),
      "text": new FormControl('')
    });
    this.posts = this.opinionsService.opinions[this.elementId]
    this.optionalTripName=this.tripsDataService.getTrips()[this.elementId].name
    
  }

  
  onSubmit(){
    //console.log(this.addTrips)
    this.errors = []
    const nowaWycieczka = new Opinion();
    const nick = this.addPost.value.nick;
    //const tripName = this.addPost.value.tripName;
    const tripName = this.tripsDataService.getTrips()[this.elementId].name;
    const text = this.addPost.value.text;
    console.log(nick)
    console.log(this.tripsDataService.fromNameToId[tripName])
    console.log(text)
    if(!nick  || nick.length <= 2)this.errors.push('Nick powinien zawierać co najmniej 3 litery')
    //if(!tripName || this.tripsDataService.fromNameToId[tripName] === undefined)this.errors.push('Taka wycieczka nie istnieje')   
    if(!text || text.length <= 50)this.errors.push('Pole z opiniami jest za krótkie! Powinno zawierać więcej niż 50 znaków')
    if(!text || text.length >= 500)this.errors.push('Pole z opiniami jest za długie! Powinno zawierać mniej niż 500 znaków')
      
    

    if(this.errors.length === 0){
      const opinion = new Opinion(nick,tripName,text)
      
      let id = this.tripsDataService.fromNameToId[tripName]
      
      this.opinionsService.addOpinion(id,opinion) //jesli stworzylismy opinie pod innym postem, to nie zmienia sie nasze pole, dlatego id nie zawsze rowne this.elementId
      this.posts = this.opinionsService.opinions[this.elementId] //nie zawsze sie zmieni!
      this.addPost.reset();
    }
  
   }


   checkPermission(){
    return this.AuthService.checkPermission(this.tripsDataService.getTrips()[this.elementId])
   }


}
