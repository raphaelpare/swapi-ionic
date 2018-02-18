import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { QuizSession, QuizQuestion, QuizConfig } from './quiz-core';
import { LoadingController } from 'ionic-angular';
import { Loading } from 'ionic-angular';

/**
 * Generated class for the QuizPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-quiz',
  templateUrl: 'quiz.html',
})
export class QuizPage {

  private session: QuizSession;
  private currentQuestion: QuizQuestion;
  private loader: Loading;
  private maxQuestions: number;
  private score: string;
  private textScore: string;
  private chosenAnswer = "";

  constructor(public navCtrl: NavController, public navParams: NavParams, public loadingCtrl: LoadingController) {
    this.session = this.navParams.get('session');
    this.currentQuestion = this.navParams.get('question');
    this.maxQuestions = QuizConfig.maxQuestions;
  }

  ionViewDidLoad() {
    console.log('Nouveau quiz chargé.');
    this.session.reset();
  }

  /**
   * Choix d'une réponse
   * @param answer = la réponse choisie
   * @param question = la question (class:QuizQuestion)
   */
  chooseAnswer(answer, question){

    let points = 0;
    let loaderText = "";
    this.chosenAnswer = answer;

    if(answer === question.answer){ // bonne réponse
      let randomLoaderIndex = Math.floor((Math.random() * QuizConfig.successPlaceholders.length) + 0);
      loaderText = QuizConfig.successPlaceholders[randomLoaderIndex];
      if(this.session.state == QuizSession.QUIZ_RUNNING){
        this.session.points++;
      }
    } else { // mauvaise réponse
      let randomLoaderIndex = Math.floor((Math.random() * QuizConfig.failurePlaceholders.length) + 0);
      loaderText = QuizConfig.failurePlaceholders[randomLoaderIndex];
    }

    // Si on arrive à la fin du quiz
    if(this.session.currentQuestionIndex == QuizConfig.maxQuestions - 1){
      let finalScore = this.session.getFinalScore();
      this.score = finalScore.score;
      this.textScore = finalScore.textScore;
      this.session.state = QuizSession.QUIZ_OVER;
    }

    switch(this.session.state){
      case QuizSession.QUIZ_STOPPED:
        break;
      case QuizSession.QUIZ_RUNNING:

        this.loader = this.loadingCtrl.create({
          content: loaderText
        });
        this.loader.present();

        this.session.answerQuestion(this, {points:points});
        break;
      case QuizSession.QUIZ_OVER:
        break;
    }
  }

  /**
   * Callback appelé lorsqu'une nouvelle question a été construite
   * @param question 
   */
  public notifyAboutBuiltQuestion(question){
    console.log("Question built !")

    this.loader.dismiss();

    // On change la position du quiz sur la prochaine question
    this.session.currentQuestionIndex = this.session.questions.length;
    this.chosenAnswer = "";

    this.currentQuestion = question;
  }

}
