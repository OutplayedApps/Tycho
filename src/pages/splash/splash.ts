import { Component } from '@angular/core';
import { IonicPage, ViewController, NavController, NavParams } from 'ionic-angular';
import { SplashScreen } from '@ionic-native/splash-screen';
import { ApiService } from '../../app/services/ApiService';
import { Platform } from 'ionic-angular';

/**
 * Generated class for the SplashPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
@Component({
  selector: 'page-splash',
  templateUrl: 'splash.html',
})
export class SplashPage {

  constructor(public navCtrl: NavController, public navParams: NavParams,
    public viewCtrl: ViewController, public splashScreen: SplashScreen,
    private apiService: ApiService, private plt: Platform) {
      if ((<any>window).cordova) {
        this.plt.ready().then((readySource) => {
          this.apiService.openUpdateDialog();
        });
      }
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad SplashPage');
  }

  ionViewDidEnter() {
    
       this.splashScreen.hide();
    
       setTimeout(() => {
         this.viewCtrl.dismiss();
       }, 1500);
    
  }

}
