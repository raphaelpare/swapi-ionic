import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Rx';
import 'rxjs/add/operator/mergeMap';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/reduce';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/expand';
import 'rxjs/add/observable/empty';

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

  public getSwapiDataPage(category, pageId) {

    return this.http.get("https://swapi.co/api/"+category+"/?page=" + pageId);
    //.map((res:Response) => res.json());

    //return JSON.stringify(query);
  }

  public getSwapiDataPageFull(category, pageId){

    /*var data = this.getSwapiDataPage(category, pageId)
            .subscribe(data => {
              
              //console.log(data)
              var fullData = fullData + data['results'];
              if(data['next'] != null ) {
                pageId++;
                console.log(data['results'].concat(this.getSwapiDataPageFull(category, pageId)));
                return data['results'].concat(this.getSwapiDataPageFull(category, pageId));
              } else {
                return data['results'];
              }
            },
              err => console.error(err),
              () => console.log('done')
            );

    return data;*/
          
    return Observable.of(this.getSwapiDataPage(category, pageId))
      .expand(obj => {

        console.log("OJBECT");
        console.log(obj);

        if(pageId == 1 || obj['next'] != null) {
          return Observable.of(this.getSwapiDataPage(category, pageId++));
        } else {
          return Observable.empty();
        }
      })
//      .map(obj => obj.flatMap(array => array)) 
      .map(obj => obj) 
      .reduce((acc, x) => acc.concat(x['results']), [])
      .subscribe((val) => { console.log("coucou"); console.log(val); });
  }











  public getAllPages(element): Observable<Result[]> {
    return Observable.create(observer => {
          this.getPage("https://swapi.co/api/" + element)
            .expand((data, i) => {
                return data.next ? this.getPage(data.next) : Observable.empty();
            })
            .reduce((acc, data) => {
                return acc.concat(data.results);
              }, [])
            .catch(error => observer.error(error))
            .subscribe((people) => {
                  observer.next(people);
                  observer.complete();
            });
    });
}

private getPage(url: string): Observable<{next: string, results: Result[]}> {
  return this.http.get(url, { })
            .map(response => {
                    let body = response;
                    return {
                      next: body['next'],
                      results: body['results'] as Result[]
                    };
                }
            );
}

}

/**export class Person {
  name: string;
}**/
