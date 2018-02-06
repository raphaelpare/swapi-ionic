import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { QuizSession } from './quiz';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html',
  providers: [QuizSession]
})
export class HomePage {

  constructor(public navCtrl: NavController, public quizSession: QuizSession) {

  }

  chooseAnswer(item){

    // console.log(item);

    // var choiceId = item.attributes['choice-id'].value;
    // var points = item.attributes['points'].value;

    // console.log(choiceId);
    // console.log(points);

    var nextQuestion = this.quizSession.answerQuestion({choiceId:0,points:1});
    console.log(nextQuestion);
  }

  showQuestion(){

  }

}
