import { EventEmitter, Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class FilterHistoryService {
  filterData = new EventEmitter<Array<boolean>>();
  resetFilterInput = new EventEmitter<Array<boolean>>();
  constructor() { }
}
