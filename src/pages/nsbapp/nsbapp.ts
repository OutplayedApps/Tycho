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

  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              public apiService: ApiService,
              public nsbService: NSBService ) {
  }

  ionViewWillEnter() {
    (<any>window).This = this;
    //this.apiService.presentLoadingCustom();
    this.options = this.nsbService.options;
    console.log(this.options);
    
    console.log('ionViewDidLoad NsbappPage');
  }

}
