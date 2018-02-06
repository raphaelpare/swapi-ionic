import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

// The static URL to SWAPI
const swapiUrl: string = "https://swapi.co/api/";

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

    return this.http.get("https://swapi.co/api/"+category+"/"+id);
    //.map((res:Response) => res.json());

    //return JSON.stringify(query);
  }

}
