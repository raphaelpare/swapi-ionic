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
        break;
      case 'Vaisseaux':
        this.ficheVaisseau();
        break;        
      case 'Véhicules':
        this.ficheVehicule();
        break;        
      case 'Planètes':
        this.fichePlanete();
        break;        
      case 'Espèces':
        this.ficheEspece();
        break;        
      default:
        this.fiche = [{"prop":"Pas d'information","value":""}];
        break;
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

  ficheVaisseau() {
    this.fiche = [{
      "prop": "Nom",
      "value": this.infos.name
    },
    {
      "prop": "Modèle",
      "value": this.infos.model
    },
    {
      "prop": "Prix",
      "value": this.infos.cost_in_credits
    },
    {
      "prop": "Passagers",
      "value": this.infos.passengers
    },
    {
      "prop": "Capacité cargo",
      "value": this.infos.cargo_capacity
    },
    {
      "prop": "Taille",
      "value": this.infos.length
    }
    ]
  }

  fichePlanete() {
    this.fiche = [{
      "prop": "Nom",
      "value": this.infos.name
    },
    {
      "prop": "Diamètre",
      "value": this.infos.diameter
    },
    {
      "prop": "Gravité",
      "value": this.infos.gravity
    },
    {
      "prop": "Habitants",
      "value": this.infos.population
    },
    {
      "prop": "Climat",
      "value": this.infos.climate
    },
    {
      "prop": "Terrain",
      "value": this.infos.terrain
    },
    ]
  }

  ficheVehicule() {
    this.fiche = [{
      "prop": "Nom",
      "value": this.infos.name
    },
    {
      "prop": "Modèle",
      "value": this.infos.model
    },
    {
      "prop": "Prix",
      "value": this.infos.cost_in_credits
    },
    {
      "prop": "Passagers",
      "value": this.infos.passengers
    },
    {
      "prop": "Capacité cargo",
      "value": this.infos.cargo_capacity
    },
    {
      "prop": "Taille",
      "value": this.infos.length
    }
    ]
  }

  ficheEspece() {
    this.fiche = [{
      "prop": "Nom",
      "value": this.infos.name
    },
    {
      "prop": "Classification",
      "value": this.infos.classification
    },
    {
      "prop": "Langue",
      "value": this.infos.language
    }
    ]
  }



  ionViewDidLoad() {
    console.log('ionViewDidLoad FichePage');
  }

}
