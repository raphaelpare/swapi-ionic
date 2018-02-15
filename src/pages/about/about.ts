import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { SwapiProvider } from '../../providers/swapi/swapi';
import { Observable } from 'rxjs/Rx';

@Component({
  selector: 'page-about',
  templateUrl: 'about.html'
})
export class AboutPage {
  public results$: Observable<Object[]>

  constructor(public navCtrl: NavController, private swapiProvider: SwapiProvider) {

  }

  loadWiki(element) {
    console.log("Consult Wiki for :");
    console.log(element);

    //var data = this.swapiProvider.getSwapiDataPageFull(element,1);
    /*  .flatMap((result) => {
        return result;
    });*/
    //console.log("dataaaas");
    //console.log(data);

    this.results$ = this.swapiProvider.getAllPages(element);
    /*  .flatMap((result) => {
        return result;
    });*/

    
    console.log("dataaaas2");
    console.log(this.results$);
  }

}
