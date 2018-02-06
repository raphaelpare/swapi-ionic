import { SwapiProvider } from './../../providers/swapi/swapi';
/**************************************************
 * 
 * All of the quiz logic can be found in this file
 * 
 **************************************************/

import { Injectable } from "@angular/core";
import { HttpClientModule } from "@angular/common/http";
import "rxjs/add/operator/map";
//import {Observable} from 'rxjs/Rx';

/**
 * Quiz Constants
 */

// The maximum amount of questions inside of a quiz
const maxQuestions: number = 10;

// Defining the different topics to question the user with
var questionTopics = 
[
    // Label = text added inside of original the description
    // QueryRange = /<range> from which we will query SWAPI
    // Topic = the /<topic_url>/ used to query SWAPI
    {
        label:"ce personnage",
        queryRange:[0,100],
        topic:"people"
    },
    {
        label:"ce vaisseau",
        queryRange:[0,100],
        topic:"starships"
    },
    {
        label:"cette planète",
        queryRange:[0,100],
        topic:"planets"
    }
]

// All of the possible quiz states
enum QuizStates {
    stopped,
    running,
    over
};

/**
 * A quiz session
 * -
 * Holds all of the information from the first to the last question the quiz
 */
@Injectable()
export class QuizSession {

    /**
     * Variable declaration
     */

    // Amount of points earned during this quiz
    private points;

    // Current position inside of the quiz
    private currentQuestionIndex;

    // Current state of the quiz
    private state = QuizStates.stopped;

    constructor(private http: HttpClientModule, private swapiProvider: SwapiProvider) {
        this.initQuiz();
    }

    /**
     * Resets the quiz
     */
    private initQuiz(){
        this.points = 0;
        this.currentQuestionIndex = 0;
    }

    /**
     * Triggered once the user clicks on an answer
     * @param {*} answer = the clicked button DOM element
     * @returns a new question, or null if the quiz is over
     */
    public answerQuestion(answer){

        // Retrieving points from the answer
        this.points = this.points + answer.points;

        // Preparing next question
        this.currentQuestionIndex++;
        if(this.currentQuestionIndex < maxQuestions){
            // Getting a new question
            var newQuestion = this.generateNewQuestion();
            return newQuestion;
        }

        this.state = QuizStates.over;
        return null;
    }

    /**
     * Generates a whole new random question
     */
    public generateNewQuestion(){

        // Refresh the state of the quiz
        this.state = QuizStates.running;

        // Generating a random number to know the topic of the question
        var questionTopic = Math.floor((Math.random() * questionTopics.length) + 0);

        // Generating a random number to query SWAPI with
        var min = questionTopics[questionTopic].queryRange[0];
        var max = questionTopics[questionTopic].queryRange[1];
        var apiIndex = Math.floor((Math.random() * max) + min);

        // Call to SWAPI
        var data = this.swapiProvider.getSwapiData(questionTopics[questionTopic].topic, apiIndex)
            .subscribe(data => {console.log(data)},
              err => console.error(err),
              () => console.log('done')
            );

        console.log("result from query =" + data);
        return null;
    }
}