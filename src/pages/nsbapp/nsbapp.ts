import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { ApiService } from '../../app/services/ApiService';
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
  providers: [ApiService, NSBService]
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
        "tossup": {"object": null, "subscription": null, "duration": 5, "text": "Timer (5 s)"},
        "bonus": {"object": null, "subscription": null, "duration": 20, "text": "Timer (20 s)"}
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
  }

  clickTimer(timer) {
    if (!timer.object) {
      timer.object = Observable.timer(0, 1000);
      timer.subscription = timer.object.subscribe(t=> {
          let timeRemaining = timer.duration - t;
          if (timeRemaining < 1) {
            timer.subscription.unsubscribe();
            timer.text = timer.origText;
            this.timeUp();
          }
          else {
            timer.text = timeRemaining;
          }
          
          
      });
    }
  }

  timeUp() {
    return this.nsbService.timeUp();
  }

}
