import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'iteratingObject'
})
export class IteratingObjectPipe implements PipeTransform {

  transform(object: any): any {
    return Object.keys(object);
  }

}
