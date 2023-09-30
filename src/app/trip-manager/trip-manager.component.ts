import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-trip-manager',
  templateUrl: './trip-manager.component.html',
  styleUrls: ['./trip-manager.component.css']
})
export class TripManagerComponent {
  constructor(private router:Router){

  }
  onClickAdd(){
    this.router.navigate(['/trip-manager','add-tour'])
  }
  onClickModify(){
    this.router.navigate(['/trip-manager','modify-trip'])
  }
}
