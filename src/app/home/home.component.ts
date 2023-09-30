import { AfterViewInit, Component, ElementRef, HostListener, ViewChild } from '@angular/core';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements AfterViewInit{
  @ViewChild('map',{static:true}) mapElement: ElementRef|any;

  ngAfterViewInit() {
    this.mapElement.nativeElement.addEventListener('scroll',this.eventHandler.bind(this), {passive: true});
  //console.log(this.mapElement)
  }
  eventHandler(event: Event) {
    // event handler code goes here
  }
  

}






