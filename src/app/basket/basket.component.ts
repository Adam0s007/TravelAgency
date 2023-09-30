import { Component} from '@angular/core';
import { MyBucketService } from '../services/my-bucket.service';
import { TripDataService } from '../services/trip-data.service';
import { Wycieczki } from '../wycieczki.model';

@Component({
  selector: 'basket',
  templateUrl: './basket.component.html',
  styleUrls: ['./basket.component.css']
})
export class BasketComponent{
  yourTrips: Wycieczki[] = []; // bedzie zawierał obiekty Wycieczek
  denomination:string=this.tripsDataService.denomination;
  constructor(private tripsDataService:TripDataService,private myBucket: MyBucketService){
    
  }
  
  sumOfOrder(){
    return this.myBucket.sumOfOrder();
  }

  removeFromBasket(i:number){
    this.myBucket.removeFromBasket(i)
  }

  onClickedPurchase(){
    this.myBucket.removeAll();
  }
  buyOnlyThis(i:number){
    this.myBucket.removeThis(i)
  }

  getTrips(){
    
    return this.myBucket.myTrips;
  }

  getTripsCounter(){
    return this.myBucket.myTripsCounter;
  }

}
