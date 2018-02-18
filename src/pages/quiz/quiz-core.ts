import { SwapiProvider } from './../../providers/swapi/swapi';
/*********************************************************************************************
 * 
 * Ce fichier contient la configuration du quiz et les classes permettant de manipuler le quiz
 * 
 ********************************************************************************************/

import { Injectable } from "@angular/core";
import { HttpClientModule } from "@angular/common/http";
import "rxjs/add/operator/map";
import { Observable } from 'rxjs/Observable';

/**
 * Configuration du quiz (constantes)
 */

// Tous les états possibles du quiz
enum QuizStates {
    stopped,
    running,
    over
};

@Injectable()
export class QuizConfig {

    // Le nombre maximum de questions dans un quiz
    public static maxQuestions: number = 10;

    // Le nombre maximum de réponses possibles dans une question
    public static maxAnswers: number = 3;

    // Définition des différents sujets concernant Star Wars
    public static questionTopics = 
    [
        // - QueryRange : /<<<range>>> l'intervalle par lequel on va interroger SWAPI (i.e.: https://swapi.co/api/people/<<<1>>>)
        // - Topic      : /<<<topic_url>>>/ le type de données que l'on va interroger (i.e.: https://swapi.co/api/<<<people>>>/1)
        // - Questions  : Toutes les questions possibles sur le sujet
        //     - tag : tag spécial pour identifier le type de question
        //     - text : le texte de la question (contenant encore les arguments '%s' à remplacer)
        //     - args : les arguments '%s' correspondant au texte de la question
        //     - answers : la réponse à la question (valeur de l'attribut fournie par l'API)
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
        },
        {
            queryRange:[0,100],
            topic:"vehicles",
            questions:
            [
                {
                    tag: "quantity",
                    text:"Combien de passagers peuvent tenir à bord du véhicule %s ?",
                    args:["name"],
                    answers:["crew"]
                },
                {
                    tag: "quantity",
                    text:"De combien de personnes est composé l'équipage du véhicule %s ?",
                    args:["name"],
                    answers:["crew"]
                },
                {
                    tag: "text",
                    text:"À quelle classe de véhicule appartient le %s ?",
                    args:["name"],
                    answers:["vehicle_class"]
                }
            ]
        },
        {
            queryRange:[1,7],
            topic:"films",
            questions:
            [
                {
                    tag: "yearDate",
                    text:'En quelle année est sortie l\'épisode numéro %s - "%s" ?',
                    args:["episode_id","title"],
                    answers:["release_date"]
                },
                {
                    tag: "text",
                    text:'Qui a réalisé l\'épisode numéro %s - "%s" ?',
                    args:["episode_id","title"],
                    answers:["director"]
                }
            ]
        }
    ]

    // Toutes les couleurs possibles formattées
    public static colors = {"dark":"Foncés","red":"Rouge","blue":"Bleu","green":"Vert","yellow":"Jaune","orange":"Orange", "black":"Noir", "brown":"Marron", "blond":"Blond", "grey":"Gris", "gray":"Gris", "blonde":"Blond","white":"Blanc","auburn":"Roux","unknown":"Personne ne l'a jamais su...","gold":"Dorés" }

    // Tous les climats formattés
    public static climates = {"murky":"Sombre","temperate":"Tempéré","subartic":"Subarctique","arid":"Aride","unknown":"Inconnu","frozen":"Gelé","hot":"Chaud","moist":"Humide","tropical":"Tropical","artificial temperate":"Artificiel tempéré","rocky":"Montagneux","windy":"Venteux","frigid":"Froid","artic":"Arctique","superheated":"Ébullition","humid":"Humide"}

    // Tous les placeholders de chargement lorsqu'une réponse est correcte
    public static successPlaceholders = [
        "Intéressant, jeune padawan...",
        "Enregistrement de la réponse dans la mémoire interne...",
        "Vous développez un potentiel croissant dans la force...",
        "Merci pour votre contribution à l'encyclopédie intergalactique...",
        "Le sénat a eu écho de votre acuité sensorielle...",
        "Impressionnant... Voyons-voir..."
    ];

    // Tous les placeholders de chargement lorsqu'une réponse est incorrecte
    public static failurePlaceholders = [
        "Peut-être trouverez-vous la voix vers la force cette fois-ci...",
        "Mon processeur indique un déclin dans vos capacités d'analyse...",
        "Que monsieur m'excuse, mais auriez-vous perdu la tête..?",
        "Je ressens une perturbation dans la Force...",
        "Laisse-toi guider seulement par ton intuition...",
        "Vos chances de survie à ce test sont de 1... sur 725 !"
    ];

    public static resultsJedi = {
        "0":"Magnifique performance. Vous n'avez plus qu'à retourner faire votre première année à l'Académie des Jedis !",
        "1":"Vous n'avez que très peu d'affinité avec la force.",
        "2":"R2-D2, c'est toi ?",
        "3":"Un score très mitigé. Nous vous conseillons vivement de retourner consulter la banque de données...",
        "4":"En dessous de la moyenne. Vous échouez à l'épreuve d'entrée de très peu !",
        "5":"Pas mal, mais encore loin d'un fin connaisseur de la SAGA !",
        "6":"Vous êtes sur la bonne voie ! Attention cependant à ne pas vous emballer...",
        "7":"Un score honorable. Le rang de chevalier Jedi vous conviendrait parfaitement !",
        "8":"Vous avez quelque chose de spécial en vous. Une certaine affinité avec la Force !",
        "9":"Le sénat vous accorderait volontier le rang de maître Jedi !",
        "10":"Vous êtes l'élu, c'est certain ! Vous êtes né pour rétablir l'équilibre dans la Force !"
    }

    public static resultsSith = {
        "0":"Vous êtes la plus pathétique des créatures de cet univers !",
        "1":"Vous n'avez aucune chance de maîtriser le côté obscur à ce rythme là.",
        "2":"Vous êtes encore de loin de pouvoir être formé par un seigneur Sith...",
        "3":"Un score très mitigé. Nous vous conseillons vivement de retourner consulter la banque de données...",
        "4":"En dessous de la moyenne. Malheureusement pour vous, même un acolyte Sith ne se contente pas d'un score aussi faible !",
        "5":"Un score encore trop neutre pour voir pleinement la surface du côté obscur...",
        "6":"Vous êtes sur la bonne voie ! Attention cependant à ne pas décevoir l'empereur...",
        "7":"Un score honorable. Le rang de maraudeur Sith vous conviendrait à merveille !",
        "8":"Vous avez quelque chose de spécial en vous. Une certaine affinité avec le côté obscur de la Force !",
        "9":"Digne d'un seigneur Sith, vos connaissances et votre puissance dépasse toutes les espérances de vos adversaires !",
        "10":"L'empereur a trouvé son nouvel apprenti... Même Dark Vador vous redoute !"
    }
}


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

    static QUIZ_STOPPED = QuizStates.stopped;
    static QUIZ_RUNNING = QuizStates.running;
    static QUIZ_OVER = QuizStates.over;

    /**
     * Déclaration des variables
     */

    // Le côté choisi de la force
    private side;

    // Le nombre de points récoltés lors de ce quiz
    public points;

    // La position actuelle à l'intérieur du quiz. Permet notamment de conserver un historique si l'on souhaite
    // naviguer parmi les questions suivantes/précédentes.
    public currentQuestionIndex;

    // Le dernier topic questionné
    // Cette variable est utilisée avant d'éviter de répéter plusieurs fois la même question
    public lastTopic = -1;

    // L'état atuel de cette session de quiz (pas démarré, en cours, terminé)
    public state = QuizStates.stopped;

    // Le tableau contenant toutes les questions du quiz. Il démarre vide.
    public questions = [];

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
        this.reset();
    }

    /**
     * Remise à zéro du quiz
     */
    public reset(){
        this.points = 0;
        this.currentQuestionIndex = 0;
        this.questions = [];
    }

    /**
     * Démarrage du quiz
     */
    public start(context, side){

        // On défini le contexte afin de lui notifier plus tard qu'une nouvelle question a été générée
        this.context = context;

        //On enregistre le côté choisi par le joueur
        this.side = side;

        // On rafraîchit l'état du quiz
        this.state = QuizStates.running;

        // Génération d'une nouvelle question
        this.generateNewQuestion(null);
    }

    /**
     * Déclenché lorsque le joueur choisie une réponse
     * @param {*} answer = la réponse
     */
    public answerQuestion(context, answer){

        // On défini le contexte afin de lui notifier plus tard qu'une nouvelle question a été générée
        this.context = context;

        // Obtention d'une nouvelle question
        this.generateNewQuestion(null);

        return this;
    }

    /**
     * Génère une nouvelle question
     * @param topic = l'un des sujet à interroger
     */
    public generateNewQuestion(topic){

        // On indique l'index du sujet à interroger
        // 0 : personnages
        // 1 : vaisseaux
        // 2 : planètes
        // 3 : véhicules
        // 4 : films
        var questionTopicIndex = topic; 
        if(topic === null){ // s'il n'est pas défini comme paramètre de la méthode
            if(this.lastTopic != -1){
                while(questionTopicIndex == this.lastTopic){
                    // On génère un nombre aléatoire pour obtenir un index de sujet à interroger
                    questionTopicIndex = Math.floor((Math.random() * QuizConfig.questionTopics.length) + 0);
                }
            } else {
                // On génère un nombre aléatoire pour obtenir un index de sujet à interroger
                questionTopicIndex = Math.floor((Math.random() * QuizConfig.questionTopics.length) + 0);
            }
        }

        // On sauvegarde le topic interrogé en tant que "dernier topic interrogé"
        this.lastTopic = topic;

        // Pour le callback de la promise, on garde une référence de cette instance de quiz
        var ref = this;

        // Instanciation d'une nouvelle question
        this.questions[this.currentQuestionIndex] = new QuizQuestion(this, questionTopicIndex);

        // Appel vers SWAPI
        this.swapiProvider.getAllPages(QuizConfig.questionTopics[questionTopicIndex].topic).subscribe(
            value => { 
                ref.buildQuestionFromResource(value)
             },
            error => { console.log(error) },
            () => { console.log('Appel vers SWAPI terminé.') }
        );
    }

    /**
     * Construit une nouvelle question à partir des ressources récupérées sur SWAPI
     * @param resource = la liste des entrées récupérées sur SWAPI
     */
    public buildQuestionFromResource(resources){

        console.log(resources)

        // On garde notre question dans une variable raccourcie
        var quizQuestion = this.questions[this.currentQuestionIndex];
        
        // Obtention de toutes les questions potentielles sur le sujet
        var possibleQuestions = QuizConfig.questionTopics[quizQuestion.topic].questions;
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
     * @param indexedResponses
     * @param indexedAnswers
     */
    public selectRandomResource(resources, topicIndex, indexedResponses, indexedAnswers){
        
        // On génère un nombre aléatoire parmi l'intervalle du sujet
        var min = QuizConfig.questionTopics[topicIndex].queryRange[0];
        var max = QuizConfig.questionTopics[topicIndex].queryRange[1];
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
        for(let i = 0; i < QuizConfig.maxAnswers - 1; i++){

            // On une nouvelle fausse réponse
            let result = this.generateFalseResponse(question, selectedQuestion, resources, indexedResponses, indexedAnswers);
            indexedAnswers = result.indexedAnswers;
            let falseAnswer = result.answer;

            // On formatte les réponses pour les cas spécifiques
            this.formatChoice(question, selectedQuestion, falseAnswer, false);
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

        if(indexedAnswers.includes(answers[0] || answers[0] === "" || answers[0] === "unknown" || answers[0] === "n/a")){

            // On ajoute la réponse au tableau de vérification des doublons (quoiqu'il arrive, on ne le fait qu'une seule fois)
            indexedAnswers.push(answers[0]);

            // S'il y a doublon, on fait sauter le dernier choix de la question et on en cherche un autre
            return this.generateFalseResponse(question, selectedQuestion, resources, indexedResponses, indexedAnswers);
        }

        // On ajoute la réponse au tableau de vérification des doublons (quoiqu'il arrive, on ne le fait qu'une seule fois)
        indexedAnswers.push(answers[0]);

        return {indexedAnswers:indexedAnswers, answer:answers[0]};
    }

    /**
     * En fonction du tag de la question, on formatte la réponse
     * @param question 
     * @param answer 
     * @param randomChoices 
     */
    private formatChoice(question, selectedQuestion, answer, rightAnswer){

        console.log("ADDED : " + answer);

        switch(selectedQuestion.tag){

            case "text":

                // On convertie la première lettre en majuscule
                let capitalizedAnswer = answer.charAt(0).toUpperCase() + answer.slice(1);
                this.addElementAsChoice(question, selectedQuestion, {answer:answer, fullAnswer:capitalizedAnswer})
                break;

            case "yearDate":

                // On convertie la date en gardant seulement l'année
                let year = new Date(answer).getFullYear();
                this.addElementAsChoice(question, selectedQuestion, {answer:answer, fullAnswer:year})
                break;
                
            case "color":

                // Il peut y avoir plusieurs couleurs (séparés dans SWAPI par une virgule)
                let hairColors = answer.split(',');
                let fullAnswerHairColor = "";
                hairColors.forEach((element, i, array) => {
                    let color = QuizConfig.colors[element.trim()];
                    if(color === undefined){
                        color = "Aucune"
                    }
                    fullAnswerHairColor = fullAnswerHairColor.concat(color);
                    if (i !== array.length - 1){ 
                        fullAnswerHairColor = fullAnswerHairColor.concat(", ");
                    }
                });

                this.addElementAsChoice(question, selectedQuestion, {answer:answer, fullAnswer:fullAnswerHairColor})
                break;

            case "planetClimate":

                // Il peut y avoir plusieurs climats pour une même planète (séparés dans SWAPI par une virgule)
                let climatesForPlanet = answer.split(',');
                let fullAnswerClimate = "";
                climatesForPlanet.forEach((element, i, array) => {
                    fullAnswerClimate = fullAnswerClimate.concat(QuizConfig.climates[element.trim()]);
                    if (i !== array.length - 1){ 
                        fullAnswerClimate = fullAnswerClimate.concat(", ");
                    }
                });

                this.addElementAsChoice(question, selectedQuestion, {answer:answer, fullAnswer:fullAnswerClimate})
                break;

            case "planet":

                // Appel vers SWAPI pour obtenir la planète
                var urlElements = answer.split('/');
                var planetId = urlElements[urlElements.length-2];

                // if(!rightAnswer){
                //     planetId = Math.floor((Math.random() * 
                //     QuizConfig.questionTopics[question.topic].queryRange[1]) + 
                //     QuizConfig.questionTopics[question.topic].queryRange[0]);
                // }
                
                var ref = this;

                console.log("recherche de la planète...")

                this.swapiProvider.getSwapiData("planets", planetId).subscribe(
                    value => { 
                            console.log("yay")
                            ref.addElementAsChoice(question, selectedQuestion, {name:answer,fullObject:value})
                        },
                    error => { 
                        if(error.status === 404){
                            // Si la planète n'a pas été trouvée, on requestionne l'API en rappelant cette fonction
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
     * S'il ne reste plus d'élements à générer, on notifie au contexte que la question est prête.
     * @param question
     * @param element 
     */
    private addElementAsChoice(question, selectedQuestion, element){

        switch(selectedQuestion.tag){
            case "planet":
                let antiUndefined = element.fullObject.name;
                if(antiUndefined === "" || antiUndefined === "unknown" || antiUndefined === "n/a"){
                    antiUndefined = "C'est un mystère..."
                }
                question.choices.push({answer:element.name, fullAnswer:antiUndefined});
                break;
            default:
                question.choices.push(element);
                break;
        }

        question.choices = this.shuffle(question.choices);
        
        if(question.choices.length >= QuizConfig.maxAnswers){
            this.context.notifyAboutBuiltQuestion(question);
        }
    }

    /**
     * Mélange au hasard les entrées du tableau passé en paramètre
     * @param array 
     */
    private shuffle(array) {
        let counter = array.length;
    
        // Tant qu'il y a des éléments dans le tableau
        while (counter > 0) {
            // On choisie un index random
            let index = Math.floor(Math.random() * counter);
    
            counter--;
    
            // On swap le dernier élément avec
            let temp = array[counter];
            array[counter] = array[index];
            array[index] = temp;
        }
    
        return array;
    }

    /**
     * Retourne le score formatté obtenu par le joueur
     */
    public getFinalScore(){

        console.log("Loggin side : " + this.side)

        let finalScore = "Résultat final : "+ this.points +" sur "+ QuizConfig.maxQuestions;
        let textScore = "";
        switch(this.side){
            case "light":
                textScore = textScore.concat(QuizConfig.resultsJedi[this.points]);
                break;
            case "dark":
                textScore = textScore.concat(QuizConfig.resultsSith[this.points]);
                break;
            default:
                break;
        }
        
        return {score:finalScore,textScore:textScore};
    }
}

/**
 * Une question du quiz
 * -
 * Contient toutes les informations relatives à une question du quiz
 */
@Injectable()
export class QuizQuestion {

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