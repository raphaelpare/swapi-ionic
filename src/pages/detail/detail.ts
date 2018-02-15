import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ModalController } from 'ionic-angular';

/**
 * Generated class for the DetailPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-detail',
  templateUrl: 'detail.html',
})
export class DetailPage {

  items = null;
  title = "detail";

  constructor(public navCtrl: NavController, public navParams: NavParams, public modalCtrl: ModalController) {
    this.items = this.navParams.get('items');
    this.title = this.navParams.get('title');
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad DetailPage');
  }

  itemSelected(item) {
    this.navCtrl.push('FichePage', { infos: item, type: this.title });
  }

}