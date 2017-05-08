import { Component } from '@angular/core';

import { NavController, NavParams } from 'ionic-angular';

import { ItemDetailsPage } from '../item-details/item-details';
import { ApiService } from '../../app/services/ApiService';

@Component({
  selector: 'page-list',
  templateUrl: 'list.html',
  providers: [ApiService]
})
export class ListPage {
  icons: string[];
  items: any;
  type: string;

  constructor(public navCtrl: NavController, public navParams: NavParams, public apiService: ApiService) {
    this.type = navParams.get('type');
    console.log(this.type);
    if (!this.type) this.type = "cat";
  };

  ionViewDidLoad()
   {
    this.apiService.presentLoadingCustom();
     var queryUrl = "";
     switch (this.type) {
       case "cat":
         queryUrl = "http://outplayedapps.com/tycho-api/?query=cats";
             break;
       case "subcat":
         queryUrl = "http://outplayedapps.com/tycho-api/?query=subcats";
             break;
       default:

     }
    this.apiService.getFile(queryUrl).subscribe(data => {
      (<any>window).loading.dismiss();
      (<any>window).data = data;
      data = JSON.parse(data);
      this.items = data;
      console.log(data);
    });


  }

  catTapped(event, item) {
    this.navCtrl.push(ListPage, {
      item: item,
      type: 'subcat'
    });
  }
}
