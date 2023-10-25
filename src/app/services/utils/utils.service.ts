import { Injectable } from '@angular/core';
import { cloneDeep } from 'lodash';

@Injectable({
  providedIn: 'root'
})
export class UtilsService {

  constructor() { }

  public propertyAccess(dataObj: any, path: string[]): any {

    if (!path || !path.length || path.length < 1) {
      return '';
    }

    let value;

    if (path.length === 1) {
      value = dataObj[path[0]];
    }
    else {

      value = cloneDeep(dataObj);

      for (let k = 0, pathLen = path.length; k < pathLen; k++) {
        value = value[path[k]];
      }
    }


    return value;
  }

}
