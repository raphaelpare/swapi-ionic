import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { QuizSession } from '../quiz/quiz-core';
import { LoadingController } from 'ionic-angular';
import { Loading } from 'ionic-angular';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html',
  providers: [QuizSession]
})
export class HomePage {

  private loader: Loading;

  constructor(public navCtrl: NavController, public quizSession: QuizSession, public loadingCtrl: LoadingController) {

  }

  chooseAnswer(side){

    this.loader = this.loadingCtrl.create({
      content: "Bien. Nous allons à présent tester vos connaissances..."
    });
    this.loader.present();

    // Démarrage du quiz lors du choix du côté de la force
    this.quizSession.start(this, side);
  }

  /**
   * Callback appelé lorsque la première question a été construite
   * @param question 
   */
  public notifyAboutBuiltQuestion(question){

    this.loader.dismiss();

    console.log("Yeaaah")

    // Affichage du quiz et de la première question
    this.navCtrl.push('QuizPage', { question:question, session:this.quizSession });
  }

}
