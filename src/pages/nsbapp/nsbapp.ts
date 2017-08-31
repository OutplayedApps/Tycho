import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { ApiService } from '../../app/services/ApiService';
import {NSBService} from '../../app/services/NSBService';
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
  questions: [];
  currentQuestionNumber: number;
  currentQuestion: any;

  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              public apiService: ApiService,
              public nsbService: NSBService ) {
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
    this.currentQuestionNumber++;
    console.log(this.questions, this.currentQuestionNumber);
    this.currentQuestion = this.questions[this.currentQuestionNumber];
  }

}
