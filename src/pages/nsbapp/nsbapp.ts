import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { ApiService } from '../../app/services/ApiService';
import { TextToSpeech } from '@ionic-native/text-to-speech';
import {NSBService} from '../../app/services/NSBService';
import {Observable} from 'rxjs/Rx';
declare var window: any;

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
  buzzBtnText: String; // Text shown on "buzz" button in game mode.
  static readonly PROGRESS_READ_TOSSUP_Q = 0;
  static readonly PROGRESS_READ_TOSSUP_Q_AND_A = 1;
  static readonly PROGRESS_READ_BONUS_Q = 2;
  static readonly PROGRESS_READ_BONUS_Q_AND_A = 3;

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
    this.buzzBtnText = "BUZZ";
  }

  ionViewWillEnter() {
    (<any>window).This = this;
    //this.apiService.presentLoadingCustom();
    this.nsbService.options = this.navParams.get('options');
    //this.nsbService.data = this.navParams.get('data');
    this.options = this.nsbService.options;
    this.data = null; // todo fix
    
    this.nsbService.getSetAndFilter(this.navParams.get('fileName')).subscribe((data) => {
      this.questions = data;
      this.currentQuestionNumber = -1;

      this.progress = -1;
      this.nextQuestion();
    });
    
  }

  ionViewWillLeave() {
    this.nsbService.stopSpeaking();
    // Clears timers.
    this.resetAllTimers();
  }

  nextQuestion() {
    /* This method is used to change the progress by 1. 
     * Doesn't necessarily go to the next question per se; but next stage.
     */

    // In game mode, all timers should be reset on "next question"
    if (this.options.mode == "GAME") {
      this.resetAllTimers();
      this.buzzBtnText = "BUZZ";
    }

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
    /* Progress:
     * 0 - Read tossup Q
     * 1 - Show entire tossup Q + tossup A
     * 2 - Read bonus Q
     * 3 - Show entire bonus A + bonus Q
     */
    var textToSpeak : String = "";
    switch (this.progress) {
      case NsbappPage.PROGRESS_READ_TOSSUP_Q:
        this.currentQuestionDisplayed.question = "<b>TOSSUP: </b>" + this.currentQuestion.tossupQ;
        this.currentQuestionDisplayed.answer = "";
        textToSpeak = this.currentQuestionDisplayed.question;
        if (this.options.mode == "GAME" && this.options.audio == "TRUE") {
          this.currentQuestionDisplayed.question = "<b>TOSSUP: </b>" + "<br>Reading tossup...";
        }
        break;
      case NsbappPage.PROGRESS_READ_TOSSUP_Q_AND_A:
        this.currentQuestionDisplayed.question = "<b>TOSSUP: </b>" + this.currentQuestion.tossupQ;
        this.currentQuestionDisplayed.answer = "<b>ANSWER: </b>" + this.currentQuestion.tossupA;
        textToSpeak = this.currentQuestionDisplayed.answer;
        break;
      case NsbappPage.PROGRESS_READ_BONUS_Q:
        this.currentQuestionDisplayed.question = "<b>BONUS: </b>" + this.currentQuestion.bonusQ;
        this.currentQuestionDisplayed.answer = "";
        textToSpeak = this.currentQuestionDisplayed.question;
        if (this.options.mode == "GAME" && this.options.audio == "TRUE") {
          this.currentQuestionDisplayed.question = "<b>BONUS: </b>" + "<br>Reading bonus...";
        }
        break;
      case NsbappPage.PROGRESS_READ_BONUS_Q_AND_A:
        this.currentQuestionDisplayed.question = "<b>BONUS: </b>" + this.currentQuestion.bonusQ;
        this.currentQuestionDisplayed.answer = "<b>ANSWER: </b>" + this.currentQuestion.bonusA;
        textToSpeak = this.currentQuestionDisplayed.answer;
        break;
    }
    if (this.nsbService.options.audio == "TRUE") {
      this.nsbService.speakText(textToSpeak);
    }
    else {
      //alert(this.nsbService.options.audio);
    }
  }

  shouldShowBuzzButton() {
    return (this.options && (this.options.mode == "GAME") && (this.progress == NsbappPage.PROGRESS_READ_TOSSUP_Q || this.progress == NsbappPage.PROGRESS_READ_BONUS_Q));
  }

  getNextQuestionButtonText() {
    switch (this.progress) {
      case NsbappPage.PROGRESS_READ_TOSSUP_Q_AND_A:
        return "Next Bonus";
      case NsbappPage.PROGRESS_READ_TOSSUP_Q:
      case NsbappPage.PROGRESS_READ_BONUS_Q:
        return "Show Answer";
      case NsbappPage.PROGRESS_READ_BONUS_Q_AND_A:
        return "Next Tossup";
      default: // never called
        return "Next Question";
    }
  }

  buzz() {
    this.nsbService.stopSpeaking();

    var timer;
    if (this.progress == NsbappPage.PROGRESS_READ_TOSSUP_Q) {
      timer = this.clickTimer(this.timers.tossup);
    }
    else if (this.progress == NsbappPage.PROGRESS_READ_BONUS_Q) {
      timer = this.clickTimer(this.timers.bonus);
    }
    else {
      return;
    }
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
          if (this.options.mode == "READER") {
            timer.text = (timeRemaining - 1); //counts 4, 3, 2, 1, 0, time up.
          }
          else if (this.options.mode == "GAME") {
            this.buzzBtnText = String(timer.duration - t); // counts 5, 4, 3, 2, 1, time up.
          }
        }
    });
    return timer;
  }

  timeUp(timer, showDialog = true) {
    if (timer.subscription) timer.subscription.unsubscribe();
    timer.text = timer.origText;
    timer.subscription = null;
    timer.object = null;
    if (showDialog === true && this.options.mode == 'GAME') {
      // Don't show time up dialog in the game. todo: show some text instead.
      this.nextQuestion();
    }
    else if (showDialog === true) {
      this.nsbService.timeUp();
    }
  }

  resetAllTimers() {
    for (let i in this.timers) {
      this.timeUp(this.timers[i], false);
    }
  }

}
