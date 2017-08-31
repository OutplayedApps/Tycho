import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { ApiService } from '../../app/services/ApiService';
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
  providers: [ApiService]
})
export class NsbappPage {
  data: any;
  options: {
    mode: Number;
    setNum: Number;
    packetNum: Number;
  }
  MODES: any = {
    READER: 1,
    SETLIST: 2,
    PACKETLIST: 3
  };

  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              public apiService: ApiService ) {
  }

  ionViewDidLoad() {
    (<any>window).This = this;
    this.apiService.presentLoadingCustom();
    this.apiService.getNSBQuestions().subscribe(data => {
      (<any>window).loading.dismiss();
      console.log(data);
      this.data = data;
      });
    console.log('ionViewDidLoad NsbappPage');
  }

}
