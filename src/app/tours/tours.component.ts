import {  Component} from '@angular/core';
import { Filter } from '../filter.model';
import { FilterService } from '../services/filter.service';
import { TripDataService } from '../services/trip-data.service';


@Component({
  selector: 'app-tours',
  templateUrl: './tours.component.html',
  styleUrls: ['./tours.component.css']
})
export class ToursComponent{
  title = 'wycieczki';
  filteredData:Filter = new Filter();

  constructor(private tripsDataService:TripDataService,
    private filterService:FilterService){
    this.filterService.filterData.subscribe((filteredTrips)=>{
      this.filteredData = filteredTrips;
    })
  }
  getAllTrips(){
    return this.tripsDataService.getTrips();
  }
  
  getId(name:string){
    return this.tripsDataService.fromNameToId[name];
  }
  getVacList(id:number){
    return this.tripsDataService.getVacancyList()[id];
  }
  getStatus(id:number){
    return this.tripsDataService.statusList[id];
  }
  
  
  

}
