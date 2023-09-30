import {  Component, NgZone, OnDestroy, OnInit} from '@angular/core';
import { MyBucketService } from './services/my-bucket.service';
import { TripDataService } from './services/trip-data.service';
import { faBell } from '@fortawesome/free-solid-svg-icons';
import { faUser } from '@fortawesome/free-solid-svg-icons';
import { BoughtTripsService } from './services/bought-trips.service';
import { AuthService } from './services/auth.service';
import { Subscription } from 'rxjs';
import {AngularFireAuth} from '@angular/fire/compat/auth';
import { Router } from '@angular/router';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit,OnDestroy{
  
  title = 'wycieczki';
  myBasketInfo:any;
  denomination:string = "";
  faBell = faBell;
  faUser = faUser;
  newNotifTrip:boolean = false;
  latestTripMess:string = "brak zakupionych wycieczek";
  showNotification:boolean=false;


  private userSub:Subscription = new Subscription;
  userID:any = null
  myUser:any = null
  constructor(private myBasket:MyBucketService,
    private tripDataService:TripDataService,
    private ngZone:NgZone,
    private boughtTrips:BoughtTripsService,
    public AuthService:AuthService,
    private router: Router,
    public afAuth:AngularFireAuth){
      this.denomination = this.tripDataService.denomination;

      this.afAuth.authState.subscribe(user => {
        if (user) {
          this.myUser = user;
          this.myBasketInfo = this.myBasket.myBasketInfo;
          this.myBasket.quantityTotalData.subscribe(data=>{
            this.myBasketInfo = data;
          })
        }else{
          this.myBasketInfo = {
            total:0,
            quantity:0  
          };
          this.latestTripMess = "brak zakupionych wycieczek";
          this.showNotification = false;
          this.myUser = null;
        }
      })
    
    this.ngZone.runOutsideAngular(() => {
      setInterval(() => {
        this.ngZone.run(() => {
            this.latestTripMess = this.boughtTrips.theNearestTour();
            if(this.latestTripMess !== "brak zakupionych wycieczek")this.newNotifTrip = true;
            else this.newNotifTrip = false;
        });
      }, 10000);
    });

  }

  
  onClickNotification(){
    this.showNotification = !this.showNotification
  }

  ngOnInit(): void {
  
  }

  ngOnDestroy(): void {
      this.userSub.unsubscribe();
  }

  logOut(){
    this.router.navigate(['/home']);
    this.afAuth.signOut().then(()=>{
      this.myBasketInfo = {
        total:0,
        quantity:0  
      };
      //this.tripDataService.clearTripsData();
    });
  }

  

}
