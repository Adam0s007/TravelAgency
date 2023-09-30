import { Component, EventEmitter, Input,Output } from '@angular/core';
import { MyBucketService } from 'src/app/services/my-bucket.service';
import { TripDataService } from 'src/app/services/trip-data.service';
import { Wycieczki } from 'src/app/wycieczki.model';

@Component({
  selector: 'reservation',
  templateUrl: './reservation.component.html',
  styleUrls: ['./reservation.component.css']
})
export class ReservationComponent{
@Input() vacanties:number =0;
@Input() maxVacancy:number =0;
@Input() tripName:string = '';

@Output()clickedButton = new EventEmitter<number>;
constructor(private tripsDataService:TripDataService,private myBasket:MyBucketService){
}



makeReservation(){
  this.clickedButton.emit(-1);
  this.tripsDataService.changingReservations.emit(1);
}
removeReservation(){
  this.clickedButton.emit(1)
  this.tripsDataService.changingReservations.emit(-1);
}

checkIfInBasket(){
  let flag = false;
  this.myBasket.myTrips.forEach((trip:Wycieczki)=>{
      if(trip.name === this.tripName) flag = true
  })

  return flag;
}

}
