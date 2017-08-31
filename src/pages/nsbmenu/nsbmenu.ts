import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import {NsbappPage} from "../nsbapp/nsbapp";

/**
 * Generated class for the NsbmenuPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
@IonicPage()
@Component({
  selector: 'page-nsbmenu',
  templateUrl: 'nsbmenu.html',
})
export class NsbmenuPage {
  NsbappPage = NsbappPage;

  constructor(public navCtrl: NavController, public navParams: NavParams) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad NsbmenuPage');
  }

}
