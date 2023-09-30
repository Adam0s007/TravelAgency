import { Component, Input } from '@angular/core';
import { ExtremePricesService } from 'src/app/services/extreme-prices.service';
import { MyBucketService } from 'src/app/services/my-bucket.service';
import { TripDataService } from 'src/app/services/trip-data.service';


@Component({
  selector: 'remove-item',
  templateUrl: './remove-item.component.html',
  styleUrls: ['./remove-item.component.css']
})
export class RemoveItemComponent {
  @Input() elemId:number = 0;
  constructor(private tripsDataService:TripDataService,
    private extremePrices: ExtremePricesService,
    private myBucket:MyBucketService){}
  removeItem(){
    //przed usunieciem musimy zwolnic ilosc dokonanych rezerwacji! trzeba calkowitą liczbę dokonanych rezerwacji pomniejszyć o liczbe
    // rezerwacji dokonanych tutaj
    this.tripsDataService.removingAllOccurences.emit(this.tripsDataService.getTrips()[this.elemId])//zwalnianie z koszyka
    this.tripsDataService.changingReservations
    .emit(-(this.tripsDataService.maxVacancyList[this.elemId] - this.tripsDataService.vacancyList[this.elemId]))
    //console.log(this.tripsDataService.getVacancyList())
    //console.log(this.elemId)
    //this.myBucket.removeAllOccurences(this.tripsDataService.getTrips()[this.elemId])
    this.tripsDataService.removeTripFromAllBaskets(this.tripsDataService.getTrips()[this.elemId].name);
    this.tripsDataService.removeItem(this.elemId);
    

  }
}
