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
  listTitle: string;
  params: {catName: string, subcatName: string};

  constructor(public navCtrl: NavController, public navParams: NavParams, public apiService: ApiService) {
    this.type = navParams.get('type');
    console.log(this.type);
    if (!this.type) this.type = "cat";
    this.params = {catName: navParams.get('catName'),
      subcatName: navParams.get('subcatName')
    };
  };

  ionViewDidLoad()
   {
    this.apiService.presentLoadingCustom();
     var queryUrl = "";
     console.log("TYPE IS "+this.type);
     switch (this.type) {
       case "cat":
         queryUrl = "http://outplayedapps.com/tycho-api/?query=cats";
         this.listTitle = "Main Subjects";
         break;
       case "subcat":
         queryUrl = "http://outplayedapps.com/tycho-api/?query=subcats";
         this.listTitle = this.params.catName;
         break;
       case "guide":
         queryUrl = "http://outplayedapps.com/tycho-api/?query=guides";
         this.listTitle = this.params.catName + " - " + this.params.subcatName;
         break;
       default:
         this.listTitle="Error";
     }
    this.apiService.getFile(queryUrl).subscribe(data => {
      (<any>window).loading.dismiss();
      (<any>window).data = data;
      var data2 : any[] = JSON.parse(data);
      for (let i = 0; i < data2.length; i++) {
        let item = data2[i];
        item.title = this.apiService.coalesce(item.catName, item.subcatName, item.guideName);
      };
      this.items = data2;
      console.log(data2);
    });


  }

  itemTapped(event, item) {
    var queryParams = {
      item: item,
      type: 'cat',
      catName: '',
      subcatName: '',
      guideName: ''
    };
    if (item.catName) {
      queryParams.type = 'subcat';
      queryParams.catName = item.catName;
    }
    else if (item.subcatName) {
      queryParams.type = 'guide';
      queryParams.catName = this.params.catName;
      queryParams.subcatName = item.subcatName;
    }
    if (item.guideId) {
      this.navCtrl.push(ItemDetailsPage, queryParams);
      // opens the study guide itself.
    }
    else {
      this.navCtrl.push(ListPage, queryParams);
    }
  }
}
