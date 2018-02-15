import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

/**
 * Generated class for the FichePage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-fiche',
  templateUrl: 'fiche.html',
})
export class FichePage {

  infos = null;
  formattedInfos = null;
  type = null;
  fiche = null;

  constructor(public navCtrl: NavController, public navParams: NavParams) {
    this.infos = this.navParams.get('infos');
    this.type = this.navParams.get('type');
    this.formattedInfos = JSON.stringify(this.infos);

    this.loadFiche();
  }

  loadFiche() {
    switch (this.type) {
      case 'Personnages':
        this.fichePersonnage();
      default:
    }
  }

  fichePersonnage() {
    this.fiche = [{
      "prop": "Nom",
      "value": this.infos.name
    },
    {
      "prop": "Sexe",
      "value": this.infos.gender
    },
    {
      "prop": "Date naissance",
      "value": this.infos.birth_year
    },
    {
      "prop": "Taille",
      "value": this.infos.height
    }
    ];
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad FichePage');
  }

}
