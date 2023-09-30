import { Injectable } from '@angular/core';
import { Wycieczki } from '../wycieczki.model';


@Injectable({
  providedIn: 'root'
})
export class ExtremePricesService { // zwraca obiekty aktualnie dostepnych najtanszych/najdrozszych cen dla i'tych wycieczek
  constructor(){}
  
  private maxAvailablePrice:{number:number,index:number}={number:0,index:-1};
  private minAvailablePrice:{number:number,index:number}={number:Infinity,index:-1};  
  
  viewChanger(tripsData:Wycieczki[],vacancyList:Array<number>,fromNameToId:any=null){
    this.maxAvailablePrice ={number:0,index:-1};
    this.minAvailablePrice ={number:Infinity,index:-1};
    if(fromNameToId === null){
      tripsData.forEach((trip,ind)=>{
        if(vacancyList[ind] !== 0){
          if(trip.unitPrice > this.maxAvailablePrice.number){
            this.maxAvailablePrice.number =trip.unitPrice;
            this.maxAvailablePrice.index = ind;
          }
          if(trip.unitPrice < this.minAvailablePrice.number){
            this.minAvailablePrice.number =trip.unitPrice;
            this.minAvailablePrice.index = ind;
          }
  
        }
      })
    }
    else{
      tripsData.forEach((trip,ind)=>{
        if(vacancyList[fromNameToId[trip.name]] !== 0){
          if(trip.unitPrice > this.maxAvailablePrice.number){
            this.maxAvailablePrice.number =trip.unitPrice;
            this.maxAvailablePrice.index = fromNameToId[trip.name];
          }
          if(trip.unitPrice < this.minAvailablePrice.number){
            this.minAvailablePrice.number =trip.unitPrice;
            this.minAvailablePrice.index = fromNameToId[trip.name];
          }
  
        }
      })
    }
    
  }
  //metody zwracajace objekty!
  getMaxAvailablePrice(){
    return this.maxAvailablePrice;
  } 
  getMinAvailablePrice(){
  return this.minAvailablePrice;
  }
}
