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
@IonicPage()
@Component({
  selector: 'page-nsbapp',
  templateUrl: 'nsbapp.html',
  providers: [TextToSpeech, ApiService, NSBService]
})
export class NsbappPage {
  data: any;
  options: any;
  currentQuestionNumber: number;
  currentQuestion: {
    "tossupQ": String,
    "tossupA": String,
    "bonusQ": String,
    "bonusA": String,
    "category": number,
    "setNum": number,
    "packetNum": number,
    "catDiff": String
  };
  questions: any[];
  timers: any;

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
  }

  ionViewWillEnter() {
    (<any>window).This = this;
    //this.apiService.presentLoadingCustom();
    this.options = this.navParams.get('options');
    this.data = this.navParams.get('data');

    this.nsbService.options = this.options;
    this.nsbService.data = this.data;
    console.log(this.data);
    
    this.questions = this.nsbService.filterSetBasedOnOptions();
    this.currentQuestionNumber = -1;

    this.nextQuestion();
    console.log('ionViewDidLoad NsbappPage');
  }

  nextQuestion() {
    this.advanceQuestion(1);
  }
  previousQuestion() {
    this.advanceQuestion(-1);
  }
  advanceQuestion(num) {
    // generic method for next / previous question.
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
    this.nsbService.speakText(this.currentQuestion.tossupQ);
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
