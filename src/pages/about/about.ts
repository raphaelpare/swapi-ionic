import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { SwapiProvider } from '../../providers/swapi/swapi';
import { Observable } from 'rxjs/Rx';
import { LoadingController } from 'ionic-angular';

@Component({
  selector: 'page-about',
  templateUrl: 'about.html'
})
export class AboutPage {
  public results$: Observable<Object[]>

  constructor(public navCtrl: NavController, 
    private swapiProvider: SwapiProvider,
    public loadingCtrl: LoadingController) {

  }

  loadWiki(element, title) {

    let loader = this.loadingCtrl.create({
      content: "Récupération des données intergalactiques..."
    });
    loader.present();

    this.results$ = this.swapiProvider.getAllPages(element);
    this.results$.subscribe(e => {
      loader.dismiss();

      this.navCtrl.push('DetailPage', { items:e, title: title });
    })

  }

}
