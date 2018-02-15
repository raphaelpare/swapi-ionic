import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { FichePage } from './fiche';

@NgModule({
  declarations: [
    FichePage,
  ],
  imports: [
    IonicPageModule.forChild(FichePage),
  ],
})
export class FichePageModule {}
