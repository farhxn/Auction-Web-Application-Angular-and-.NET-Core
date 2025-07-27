import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'firstKey'
})
export class FirstKeyPipe implements PipeTransform {

  transform(value: any): string | null {
    const key = Object.keys(value);
    if(key && key.length>0){
      return key[0]
    }
    return null;
  }

}
