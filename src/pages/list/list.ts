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
  params: {catName: string, subcatName: string, catId: string, subcatId: string};

  constructor(public navCtrl: NavController, public navParams: NavParams, public apiService: ApiService) {
    this.type = navParams.get('type');
    console.log(this.type);
    if (!this.type) this.type = "cat";
    this.params = {catName: navParams.get('catName'),
      subcatName: navParams.get('subcatName'),
      catId: navParams.get('catId'),
      subcatId: navParams.get('subcatId')
    };
  };
  public hashCode(str:any) { // java String#hashCode
  var hash = 0;
  for (var i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }
  return hash;
}

  public intToRGB(i){
  var c = (i & 0x00FFFFFF)
    .toString(16)
    .toUpperCase();

  return "00000".substring(0, 6 - c.length) + c;
}

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
         queryUrl += "&catId="+this.params.catId;
         this.listTitle = this.params.catName;
         break;
       case "guide":
         queryUrl = "http://outplayedapps.com/tycho-api/?query=guides";
         queryUrl += "&subcatId="+this.params.subcatId;
         this.listTitle = this.params.catName + " - " + this.params.subcatName;
         break;
       default:
         this.listTitle="Error";
     }
    this.apiService.getFile(queryUrl).subscribe(data => {
      (<any>window).loading.dismiss();
      (<any>window).data = data;
      var data2 : any[] = JSON.parse(data);
      data2 = data2.filter(function(e) {
        return (!e.catName || e.catName != "None");
      })
      for (let i = 0; i < data2.length; i++) {
        let item = data2[i];
        item.title = this.apiService.coalesce(item.catName, item.subcatName, item.guideName);
        if (item.guideName) {item.icon = "document";}
        else if (item.subcatName) {item.icon = "folder";}
        else {
          switch (item.title.toLowerCase()) {
            case "science":
              item.icon = "flask";
              break;
            case "literature":
              item.icon = "book";
              break;
            case "history":
              item.icon = "globe";
              break;
            default:
              item.icon = "folder";
          }
        }

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
      guideName: '',
      subcatId: '',
      catId: ''
    };
    if (item.catName) {
      queryParams.type = 'subcat';
      queryParams.catName = item.catName;
      queryParams.catId = item.catId;
    }
    else if (item.subcatName) {
      queryParams.type = 'guide';
      queryParams.catName = this.params.catName;
      queryParams.catId = this.params.catId;
      queryParams.subcatName = item.subcatName;
      queryParams.subcatId = item.subcatId;
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
