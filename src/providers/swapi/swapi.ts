import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

// The static URL to SWAPI
private const swapiUrl: string = "https://swapi.co/api/";

@Injectable()
export class SwapiProvider {

  constructor(public http: HttpClient) {
    console.log('Hello SwapiProvider Provider');
  }

  /**
   * Returns data from SWAPI
   * @param category (ie: character, starships...)
   * @param id (ie: 1, 24, 101...)
   */
  public getSwapiData(category, id){
    var testQuery = this.http.get ("https://swapi.co/api/"+category+"/"+id);
  }

}