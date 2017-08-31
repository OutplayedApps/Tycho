import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import {NsbappPage} from "../nsbapp/nsbapp";
import { ApiService } from '../../app/services/ApiService';
import { NSBService } from '../../app/services/NSBService';

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
  providers: [ApiService, NSBService]
})
export class NsbmenuPage {
  NsbappPage = NsbappPage;
  data: any;
  options: any;
  optionValues: any;
  setInfo: any;
  setChosen: any;

  constructor(public navCtrl: NavController, public navParams: NavParams,
              public apiService: ApiService, public nsbService: NSBService) {
  }

  ngOnInit() { //runs only on init.
    (<any>window).This = this;
    this.options = this.nsbService.options;
    this.optionValues = this.nsbService.optionValues;
    this.nsbService.loadData();

    console.log('ionViewDidLoad NsbappPage');

    console.log('ngoninit nsbmenupage');
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad NsbmenuPage');
  }

  trackByFn(index, item) {
    return index;
  }

  updateSetNum() {
    this.options.setNum = this.setChosen.index;
  }

}
