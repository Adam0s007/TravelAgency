import { EventEmitter, Injectable } from '@angular/core';
import { Filter } from '../filter.model';


@Injectable({
  providedIn: 'root'
})
export class FilterService {

  filterData = new EventEmitter<Filter>();
  resetFilterInput = new EventEmitter<Filter>();
  constructor() {}
}
