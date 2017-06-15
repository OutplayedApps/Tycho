import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { PacketDetails } from '../packet-details/packet-details';
import { ApiService } from '../../app/services/ApiService';
import { File } from '@ionic-native/file';

/**
 * Generated class for the PacketList page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
@IonicPage()
@Component({
  selector: 'page-packet-list',
  templateUrl: 'packet-list.html',
  providers: [ApiService]
})
export class PacketListPage {
  type: Number;
  path: String;
  listTitle: String;
  currentSet: String;
  currentLevel: String;
  items: any;
  TYPES: any = {
    DIFFICULTYLIST: 1,
    SETLIST: 2,
    PACKETLIST: 3
  };


  constructor(public navCtrl: NavController, public navParams: NavParams, public apiService: ApiService,
              private file: File) {
    this.type = navParams.get('type');

    if (!this.type) this.type = this.TYPES.DIFFICULTYLIST;
    //console.log(this.type);
    this.path = navParams.get('path');
    this.currentLevel = navParams.get('currentLevel');
    this.currentSet = decodeURIComponent(navParams.get('currentSet'));
    if (this.currentLevel == "undefined" || this.currentLevel == "null") this.currentLevel = null;
    if (this.currentSet == "undefined" || this.currentSet == "null") this.currentSet = null;
    if (this.currentLevel) {this.type = this.TYPES.SETLIST;}
    if (this.currentSet) {this.type = this.TYPES.PACKETLIST;}
  }

  ionViewDidLoad() {
    var items, listTitle;
    (<any>window).file = this.file;
    (<any>window).This = this;
    this.file.checkDir(this.file.dataDirectory, '')
      .then((files) => console.log('Directory exists'))
      .catch((err) => console.log('Directory doesnt exist'));
    this.apiService.presentLoadingCustom();
    switch (this.type) {
      case this.TYPES.DIFFICULTYLIST:
        items = [
          {"title": "Middle School", "icon": "md-book", "description": "Middle school packet archive.\n\nExample: CMST",
           "currentLevel": "ms"},
          {"title": "High School", "icon": "md-laptop", "description":"High school packet archive.\n\nExample: LIST, FKT, PACE NSC",
            "currentLevel": "hs"},
          {"title": "Collegiate ", "icon": "md-school", "description":"Collegiate and open packets.\n\nExample: MUT, ACF Fall, ACF Nationals, Chicago Open",
          "currentLevel": "collegiate"}
        ];
        listTitle = "Choose a packet difficulty";
        (<any>window).loading.dismiss();
        break;
      case this.TYPES.SETLIST:

        this.file.listDir(this.file.applicationDirectory,"www/assets/packets/"+this.currentLevel+"/").then((data) => {
          console.log(data);
          items = [];
          for (let i = 0; i < data.length; i++) {
            var newItem = {};
            newItem["currentLevel"] = this.currentLevel;
            newItem["currentSet"] = data[i].name;
            newItem["name"] = data[i].name;
            items.push(newItem);
          }
          console.log(items);
          this.items = items;
          (<any>window).loading.dismiss();
        }).catch((err) => {
          console.error(err);
        });
        break;
      case this.TYPES.PACKETLIST:
        this.file.listDir(this.file.applicationDirectory,"www/assets/packets/"+this.currentLevel+"/"+this.currentSet+"/").then((data) => {
          console.log(data);
          items = [];
          for (let i = 0; i < data.length; i++) {
            var newItem = {};
            newItem["currentLevel"] = this.currentLevel;
            newItem["currentSet"] = this.currentSet;
            newItem["currentPacket"] = data[i].name;
            newItem["name"] = data[i].name;
            items.push(newItem);
          }
          console.log(items);
          this.items = items;
          (<any>window).loading.dismiss();
        }).catch((err) => {
          console.error(err);
        });
        break;
    }
    this.items = items;
    this.listTitle = listTitle;
  }

  itemTapped(event, item) {
    var queryParams = {
      item: item,
      currentLevel: item.currentLevel || null,
      currentSet: item.currentSet || null,
      currentPacket: item.currentPacket || null
    };
    if (item.currentPacket) {
      this.navCtrl.push(PacketDetails, queryParams);
      // opens the study guide itself.
    }
    else {
      this.navCtrl.push(PacketListPage, queryParams);
    }
  }
  public colorHash = this.apiService.colorHash;


}
