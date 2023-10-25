import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class HttpService {

  constructor(
    private _http:HttpClient
  ) { }

  public getData() {
    return this._http.get('http://localhost:3000/data1');
  }

  public getData2(endString: string) {
    return this._http.get(`http://localhost:3000/${endString}`);
  }

  public getSearchResults() {
    return this._http.get('http://localhost:3000/search');
  }

}
