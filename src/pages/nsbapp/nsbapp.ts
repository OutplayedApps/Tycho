import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { ApiService } from '../../app/services/ApiService';
import { TextToSpeech } from '@ionic-native/text-to-speech';
import {NSBService} from '../../app/services/NSBService';
import {Observable} from 'rxjs/Rx';
declare var window: any;

/**
 * Generated class for the NsbappPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
export interface CurrentQuestionDisplayed {
  question: String,
  answer: String
}
export interface CurrentQuestion {
  "tossupQ": String,
  "tossupA": String,
  "bonusQ": String,
  "bonusA": String,
  "category": number,
  "setNum": number,
  "packetNum": number,
  "catDiff": String
}
@Component({
  selector: 'page-nsbapp',
  templateUrl: 'nsbapp.html',
  providers: [TextToSpeech, ApiService, NSBService]
})
export class NsbappPage {
  data: any;
  options: any;
  currentQuestionNumber: number;
  currentQuestion: CurrentQuestion;
  questions: any[];
  timers: any;
  progress: number;
  currentQ: String;
  currentA: String;
  currentQuestionDisplayed: CurrentQuestionDisplayed;

  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              public apiService: ApiService,
              public nsbService: NSBService ) {
    this.timers = {
        "tossup": {"object": null, "subscription": null, "duration": 5, "text": "5"},
        "bonus": {"object": null, "subscription": null, "duration": 20, "text": "20"}
    }
    this.timers.tossup.origText = this.timers.tossup.text;
    this.timers.bonus.origText = this.timers.bonus.text;
    this.currentQuestionDisplayed = {"question": "", "answer": ""};
  }

  ionViewWillEnter() {
    (<any>window).This = this;
    //this.apiService.presentLoadingCustom();
    this.nsbService.options = this.navParams.get('options');
    this.nsbService.data = this.navParams.get('data');
    this.options = this.nsbService.options;
    this.data = this.nsbService.data;
    
    this.questions = this.nsbService.filterSetBasedOnOptions();
    this.currentQuestionNumber = -1;

    this.progress = -1;
    this.nextQuestion();
    console.log('ionViewDidLoad NsbappPage');
  }

  nextQuestion() {
    this.progress = (++this.progress % 4);
    if (this.progress == 0) {
      this.advanceQuestion(1);
    }
    else {
      this.displayCurrentQuestion();
    }
  }
  previousQuestion() {
    this.advanceQuestion(-1);
  }
  advanceQuestion(num) {
    // generic method for next / previous question.
    this.progress = 0; //reset progress.
    this.resetAllTimers(); //first resets all timers.
    if (this.currentQuestionNumber + num >= this.questions.length) {
      this.currentQuestionNumber = 0;
    }
    else if (this.currentQuestionNumber + num < 0) {
      this.currentQuestionNumber = this.questions.length - 1;
    }
    else {
      this.currentQuestionNumber += num;
    }
    
    this.currentQuestion = this.questions[this.currentQuestionNumber];
    
    this.displayCurrentQuestion();
    //this.setCurrentQuestionText();

  }

  displayCurrentQuestion() {
    var textToSpeak : String = "";
    switch (this.progress) {
      case 0:
        this.currentQuestionDisplayed.question = "<b>TOSSUP: </b>" + this.currentQuestion.tossupQ;
        this.currentQuestionDisplayed.answer = "";
        textToSpeak = this.currentQuestionDisplayed.question;
        break;
      case 1:
        //this.currentQuestionDisplayed.question = this.currentQuestion.tossupQ;
        this.currentQuestionDisplayed.answer = "<b>ANSWER: </b>" + this.currentQuestion.tossupA;
        textToSpeak = this.currentQuestionDisplayed.answer;
        break;
      case 2:
        this.currentQuestionDisplayed.question = "<b>BONUS: </b>" + this.currentQuestion.bonusQ;
        this.currentQuestionDisplayed.answer = "";
        textToSpeak = this.currentQuestionDisplayed.question;
        break;
      case 3:
        //this.currentQuestionDisplayed.question = this.currentQuestion.tossupQ;
        this.currentQuestionDisplayed.answer = "<b>ANSWER: </b>" + this.currentQuestion.tossupA;
        textToSpeak = this.currentQuestionDisplayed.answer;
        break;
    }
    if (this.nsbService.options.audio === true) {
      //this.speakCurrentQuestion();
      this.nsbService.speakText(textToSpeak);
    }
  }

  speakCurrentQuestion() {
    //this.nsbService.speakText(this.currentQuestion.tossupQ);
  }

  clickTimer(timer) {
    if (timer.object) {
      this.timeUp(timer, false);
      return;
    }
    timer.object = Observable.timer(0, 1000);
    timer.subscription = timer.object.subscribe(t=> {
        let timeRemaining = timer.duration - t;
        if (timeRemaining < 1) {
          this.timeUp(timer);
        }
        else {
          timer.text = (timeRemaining - 1); //counts 4, 3, 2, 1, ...
        }
    });
  }

  timeUp(timer, showDialog = true) {
    if (timer.subscription) timer.subscription.unsubscribe();
    timer.text = timer.origText;
    timer.subscription = null;
    timer.object = null;
    if (showDialog == true) {
      this.nsbService.timeUp();
    }
  }

  resetAllTimers() {
    for (let i in this.timers) {
      this.timeUp(this.timers[i], false);
    }
  }

}
