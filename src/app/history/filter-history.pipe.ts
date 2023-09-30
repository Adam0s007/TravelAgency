import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'filterHistory', 
  pure:false
})
export class FilterHistoryPipe implements PipeTransform {

  transform(value: any, 
    filteredStatus:Array<boolean>): any {
    const resultArray =[]
      if(!value || value.length === 0){
        return value;
      }
      for(const item of value){
        if(item === undefined)continue
        if(filteredStatus.every((status=>!status)) || filteredStatus[item.status]===true){
          resultArray.push(item)
        }
      }
      return resultArray;
  }

}
