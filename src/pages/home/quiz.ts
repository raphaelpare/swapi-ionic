import { SwapiProvider } from './../../providers/swapi/swapi';
/**************************************************
 * 
 * Toute la logique du quiz se trouve dans ce fichier
 * 
 **************************************************/

import { Injectable } from "@angular/core";
import { HttpClientModule } from "@angular/common/http";
import "rxjs/add/operator/map";
import { Observable } from 'rxjs/Observable';

/**
 * Constantes du quiz
 */

// Le nombre maximum de questions dans un quiz
const maxQuestions: number = 10;

// Le nombre maximum de réponses possibles dans une question
const maxAnswers: number = 3;

// Définition des différents sujets concernant Star Wars
var questionTopics = 
[
    // - QueryRange : /<<<range>>> l'intervalle par lequel on va interroger SWAPI (i.e.: https://swapi.co/api/people/<<<1>>>)
    // - Topic      : /<<<topic_url>>>/ le type de données que l'on va interroger (i.e.: https://swapi.co/api/<<<people>>>/1)
    // - Questions  : Toutes les questions possibles sur le sujet
    //     - tag : tag spécial pour identifier le type de question
    //     - text : le texte de la question (contenant encore les arguments '%s' à remplacer)
    //     - args : les arguments '%s' correspondant au texte de la question
    //     - answers : la réponse à la question (valeur de l'attribut fourni par l'API)
    {
        queryRange:[0,100],
        topic:"people",
        questions:
        [
             {
                 tag: "color",
                 text:"Devinez la couleur des cheveux de %s !",
                 args:["name"],
                 answers:["hair_color"]
             },
             {
                 tag: "color",
                 text:"Devinez la couleur des yeux de %s !",
                 args:["name"],
                 answers:["eye_color"]
            },
            // {
            //      tag: "text",
            //      text:"Dans quel(s) film(s) %s apparaît-il (ou elle) ?",
            //      args:["name"],
            //      answers:["films"]
            // },
            {
                tag: "planet",
                text:"De quelle planète %s est-il (ou elle) originaire ?",
                args:["name"],
                answers:["homeworld"]
            }
        ]
    },
    {
        queryRange:[0,100],
        topic:"starships",
        questions:
        [
            {
                tag: "quantity",
                text:"Quelle est la taille du vaisseau %s (en mètres) ?",
                args:["name"],
                answers:["length"]
            }
        ]
    },
    {
        queryRange:[0,100],
        topic:"planets",
        questions:
        [
            {
                tag: "planetClimate",
                text:"Quel est le climat de la planète %s ?",
                args:["name"],
                answers:["climate"]}
        ]
    }
]

// Toutes les couleurs possibles formattées
const colors = {"red":"Rouge","blue":"Bleu","green":"Vert","yellow":"Jaune","orange":"Orange", "black":"Noir", "brown":"Marron", "blond":"Blond", "grey":"Gris", "gray":"Gris" }


// Tous les climats formattés
const climates = {"murky":"Sombre","temperate":"Tempéré","subartic":"Subarctique","arid":"Aride","unknown":"Inconnu","frozen":"Gelé","hot":"Chaud","moist":"Humide","tropical":"Tropical","artificial temperate":"Artificiel tempéré","rocky":"Montagneux","windy":"Venteux","frigid":"Froid","artic":"Arctique"}


// Tous les états possibles du quiz
enum QuizStates {
    stopped,
    running,
    over
};

/**
 * Une session de quiz
 * -
 * Contient toutes les informations sur une session du quiz, de la première à la dernière question
 * en passant par les points récoltés ou encore la question actuellement posée.
 * 
 * Cette classe contient également toutes les méthodes permettant de générer de nouvelles questions.
 */
@Injectable()
export class QuizSession {

    /**
     * Déclaration des variables
     */

    // Le nombre de points récoltés lors de ce quiz
    private points;

    // La position actuelle à l'intérieur du quiz. Permet notamment de conserver un historique si l'on souhaite
    // naviguer parmi les questions suivantes/précédentes.
    private currentQuestionIndex;

    // L'état atuel de cette session de quiz (pas démarré, en cours, terminé)
    private state = QuizStates.stopped;

    // Le tableau contenant toutes les questions du quiz. Il démarre vide.
    private questions = [];

    // L'observable contenant les résultats de SWAPI
    public results$: Observable<Object[]>

    // Le contexte par lequel le quiz est appelé
    private context;

    /**
     * Constructeur
     * @param http 
     * @param swapiProvider 
     */
    constructor(private http: HttpClientModule, private swapiProvider: SwapiProvider) {
        this.initQuiz();
    }

    /**
     * Remise à zéro du quiz
     */
    private initQuiz(){
        this.points = 0;
        this.currentQuestionIndex = 0;
    }

    /**
     * Déclenché lorsque le joueur choisie une réponse
     * @param {*} answer = la réponse
     */
    public answerQuestion(context, answer){

        // On défini le contexte afin de lui notifier plus tard qu'une nouvelle question a été générée
        this.context = context;

        // On récupère les points de la réponse
        //this.points = this.points + answer.points;

        // Préparation de la prochaine question
        if(this.currentQuestionIndex < maxQuestions - 1){

            // On rafraîchit l'état du quiz
            this.state = QuizStates.running;

            // On change la position du quiz sur la prochaine question
            this.currentQuestionIndex = this.questions.length;

            // Obtention d'une nouvelle question
            this.generateNewQuestion(null);

        } else {
            // Si on est à court de questions, on change l'état du quiz à "terminé (over)"
            this.state = QuizStates.over;
        }

        return this;
    }

    /**
     * Génère une nouvelle question
     */
    public generateNewQuestion(topic){

        // On indique l'index du sujet à interroger
        // 0 : personnages
        // 1 : vaisseaux
        // 2 : planètes
        var questionTopicIndex = topic; 
        if(topic === null){ // s'il n'est pas défini comme paramètre de la méthode
            // On génère un nombre aléatoire pour obtenir un index de sujet à interroger
            questionTopicIndex = Math.floor((Math.random() * questionTopics.length) + 0);
        }

        // Pour le callback de la promise, on garde une référence de cette instance de quiz
        var ref = this;

        // Instanciation d'une nouvelle question
        this.questions[this.currentQuestionIndex] = new QuizQuestion(this, questionTopicIndex);

        // Appel vers SWAPI
        this.swapiProvider.getAllPages(questionTopics[questionTopicIndex].topic).subscribe(
            value => { ref.buildQuestionFromResource(value) },
            error => { console.log(error) },
            () => { console.log('Appel vers SWAPI terminé.') }
        );
    }

    /**
     * Construit une nouvelle question à partir des ressources récupérées sur SWAPI
     * @param resource
     * @param index 
     */
    public buildQuestionFromResource(resources){

        console.log(resources);

        // On garde notre question dans une variable raccourcie
        var quizQuestion = this.questions[this.currentQuestionIndex];
        
        // Obtention de toutes les questions potentielles sur le sujet
        var possibleQuestions = questionTopics[quizQuestion.topic].questions;
        // Sélection d'une question au hasard parmi celles-ci
        var selectedQuestion = possibleQuestions[Math.floor(Math.random()*possibleQuestions.length)];

        // Sélection d'une entrée aléatoire parmi celle récupérées sur SWAPI
        let result = this.selectRandomResource(resources, quizQuestion.topic, [], []);
        var selectedResource = result.selectedResource;
        var indexedResponses = result.indexedResponses;

        // Extraction des (ou de la) réponse(s) correcte(s) de l'entrée
        var extractedAnswers = this.extractResourceArgs(selectedQuestion.answers, selectedResource);
        let indexedAnswers = [extractedAnswers[0]];

        // Extraction des arguments de l'entrée. Cela a pour but de remplacer les '%s' de la question
        var extractedArguments = this.extractResourceArgs(selectedQuestion.args, selectedResource);
        // Remplacement des '%s' avec les arguments récupérés
        var builtText = this.parseQuestion(selectedQuestion.text, extractedArguments);

        // Construction de la question
        quizQuestion.fullText = builtText;
        quizQuestion.answer = extractedAnswers[0];
        this.generateRandomChoices(quizQuestion, selectedQuestion, resources, indexedResponses, indexedAnswers);
    }

    /**
     * Sélectionne une entrée aléatoire parmi la liste des entrées récupérés sur SWAPI et selon un intervalle donné
     * @param resources
     * @param topicIndex
     */
    public selectRandomResource(resources, topicIndex, indexedResponses, indexedAnswers){
        
        // On génère un nombre aléatoire parmi l'intervalle du sujet
        var min = questionTopics[topicIndex].queryRange[0];
        var max = questionTopics[topicIndex].queryRange[1];
        var randomIndex = Math.floor((Math.random() * max) + min);

        // On vérifie si on ne souhaite pas obtenir un résultat équivalent à ceux déjà indexés
        if(indexedResponses.includes(randomIndex)){
            return this.selectRandomResource(resources, topicIndex, indexedResponses, indexedAnswers);
        }

        // On retourne le résultat
        if(resources[randomIndex] != undefined){
            indexedResponses.push(randomIndex)
            return {selectedResource:resources[randomIndex], indexedResponses:indexedResponses};
        }

        // Tant qu'on en trouve pas, on continue de chercher (récursion)
        return this.selectRandomResource(resources, topicIndex, indexedResponses, indexedAnswers);
    }

    /**
     * Extrait les arguments afin de les remplacer dans le texte de la question
     * @param topicArgs
     * @param resource
     */
    public extractResourceArgs(topicArgs, resource){
        var extractedArgs = [];
        topicArgs.forEach(arg => {
            extractedArgs.push(resource[arg]);
        });
        return extractedArgs;
    }

    /**
     * Parse la question avec les arguments fournis (= '%s')
     * @param str
     * @param arguments
     */
    public parseQuestion(text, extractedArguments) {
        var i = 0;
        return text.replace(/%s/g, function() {
            return extractedArguments[i++];
        });
    }

    /**
     * Obtient {maxAnswers} de choix formattés pour la question
     * @param maxAnswers 
     * @param question 
     */
    public generateRandomChoices(question, selectedQuestion, resources, indexedResponses, indexedAnswers){

        // Parmi les choix, on ajoute la bonne réponse. L'entrée 0 correspond donc toujours à la bonne réponse.
        this.formatChoice(question, selectedQuestion, question.answer, true);

        // On génère ensuite de fausses réponses
        for(let i = 0; i < maxAnswers - 1; i++){

            // On une nouvelle fausse réponse
            this.generateFalseResponse(question, selectedQuestion, resources, indexedResponses, indexedAnswers);
        }
    }

    /**
     * Génère une fausse réponse aléatoire
     * @param question 
     * @param selectedQuestion 
     * @param resources 
     */
    public generateFalseResponse(question, selectedQuestion, resources, indexedResponses, indexedAnswers){

        // Sélection d'une ressource aléatoire
        let result = this.selectRandomResource(resources, question.topic, indexedResponses, indexedAnswers);
        var newResource = result.selectedResource;
        var indexedResponses = result.indexedResponses;

        // On vérifie qu'il ne s'agit pas d'un doublon
        var answers = this.extractResourceArgs(selectedQuestion.answers, newResource);
        if(indexedAnswers.includes(answers[0])){
            // S'il y a doublon, on fait sauter le dernier choix de la question et on en cherche un autre
            question.choices.splice(question.choices.length - 1, 1)
            this.generateFalseResponse(question, selectedQuestion, resources, indexedResponses, indexedAnswers);
        }

        // On ajoute la réponse au tableau de vérification des doublons
        indexedAnswers.push(answers[0]);

        // On formatte les réponses pour les cas spécifiques
        this.formatChoice(question, selectedQuestion, answers[0], false);
    }

    /**
     * En fonction du type de question, on formatte la réponse
     * @param question 
     * @param answer 
     * @param randomChoices 
     */
    private formatChoice(question, selectedQuestion, answer, rightAnswer){

        switch(selectedQuestion.tag){
            case "color":
                this.addElementAsChoice(question, selectedQuestion, {answer:answer, fullAnswer:colors[answer]})
                break;

            case "planetClimate":

                // Il peut y avoir plusieurs climats pour une même planète (séparés par une virgule)
                let climatesForPlanet = answer.split(',');
                let fullAnswer = "";
                climatesForPlanet.forEach((element, i, array) => {
                    console.log(element);
                    fullAnswer = fullAnswer.concat(climates[element.trim()]);
                    if (i !== array.length - 1){ 
                        fullAnswer = fullAnswer.concat(", ");
                    }
                });

                this.addElementAsChoice(question, selectedQuestion, {answer:answer, fullAnswer:fullAnswer})
                break;

            case "planet":
                // Appel vers SWAPI pour obtenir la planète
                var urlElements = answer.split('/');
                var planetId = urlElements[urlElements.length-2];

                if(!rightAnswer){
                    planetId = Math.floor((Math.random() * 
                    questionTopics[question.topic].queryRange[1]) + 
                    questionTopics[question.topic].queryRange[0]);
                }
                
                var ref = this;

                console.log("Nouvel appel avec l'index : " + planetId)

                this.swapiProvider.getSwapiData("planets", planetId).subscribe(
                    value => { 
                        console.log(value);
                        ref.addElementAsChoice(question, selectedQuestion, value)
                        },
                    error => { 
                        if(error.status === 404){
                            // Si la planète n'a pas été trouvée, on requestionne l'API
                            ref.formatChoice(question, selectedQuestion, answer, rightAnswer);
                        }
                    },
                    () => { console.log('Appel vers SWAPI terminé.') }
                );
                
                break;
            default:
                this.addElementAsChoice(question, selectedQuestion, {answer:answer, fullAnswer:answer})
                break;
        }
    }

    /**
     * Dernière étape : on ajoute un nouvel élément de réponse à la question.
     * S'il ne reste plus d'élements à générer, on notifie le contexte que la question est prête.
     * @param question
     * @param element 
     */
    private addElementAsChoice(question, selectedQuestion, element){

        switch(selectedQuestion.tag){
            case "planet":
                question.choices.push({answer:element.name, fullAnswer:element.name});
                break;
            default:
                question.choices.push(element);
                break;
        }
        
        if(question.choices.length >= maxAnswers){
            this.context.notifyAboutBuiltQuestion(question);
        }
    }

}

/**
 * Une question du quiz
 * -
 * Contient toutes les informations relatives à une question du quiz
 */
class QuizQuestion {

    /**
     * Déclaration des variables
     */

    // Le quiz contenant cette question
    public quiz;

    // Le texte complet de la question
    public fullText;

    // L'index du sujet de la question
    public topic;

    // La réponse à la question (attribut json de SWAPI)
    public answer;

    // Les choix possibles pour répondre à cette question
    // Contient les attributs :
    //      - answer : la réponse à la question (non formattée)
    //      - fullAnswer : la réponse à la question (formattée)
    public choices;

    /**
     * Constructeur
     * @param topic
     */
    constructor(_quiz, _topic) {
        this.quiz = _quiz;
        this.topic = _topic;
        this.choices = [];
    }

}