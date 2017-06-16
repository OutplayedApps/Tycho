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
  items: any[];
  itemsAll: any[];
  item: any;
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
    this.item = navParams.get('item');
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
        this.apiService.getFileStructure().subscribe(data => {
          data = data.children;
          console.log(data);
          data = data.filter(function (item) {
            return item.type == 'directory';
          });
          for (let i = 0; i < data.length; i++) {
            let item = data[i];
            console.log(item);
            if (item.name == "ms") {
              item.title = "Middle School";
              item.icon = "md-book";
              item.description = "Middle school packet archive.\n\nExample: CMST";
              item.currentLevel = "ms";
            }
            else if (item.name == "hs") {
              item.title = "High School";
              item.icon = "md-laptop";
              item.description = "High school packet archive.\n\nExample: LIST, FKT, PACE NSC";
              item.currentLevel = "hs";
            }
            else if (item.name == "collegiate") {
              item.title = "Collegiate";
              item.icon = "md-school";
              item.description = "Collegiate and open packets.\n\nExample: MUT, ACF Fall, ACF Nationals, Chicago Open";
              item.currentLevel = "collegiate";
            }
          }
          this.items = data;
          this.itemsAll = data;
          listTitle = "Choose a packet difficulty";
          (<any>window).loading.dismiss();
        });
        break;
      case this.TYPES.SETLIST:

        var data = this.item.children;
        for (let i = 0; i < data.length; i++) {
          data[i].currentLevel = this.currentLevel;
          data[i].currentSet = data[i].name;
        }
        items = data;
        (<any>window).loading.dismiss();
        break;
      case this.TYPES.PACKETLIST:
        var data = this.item.children;
        console.log(data);
        for (let i = 0; i < data.length; i++) {
          var item = data[i];
          item["currentLevel"] = this.currentLevel;
          item["currentSet"] = this.currentSet;
          item["currentPacket"] = item.name;
          item["name"] = item.name;
        }
        items = data;
        (<any>window).loading.dismiss();
    }
    this.items = items;
    this.itemsAll = items;
    console.log("ITEMS ARE",this.items);
    this.listTitle = listTitle;
  }

  getItems(ev: any) {
    // Reset items back to all of the items
    this.items = this.itemsAll;

    // set val to the value of the searchbar
    let val = ev.target.value;

    // if the value is an empty string don't filter the items
    if (val && val.trim() != '') {
      this.items = this.items.filter((item) => {
        return (item.name.toLowerCase().indexOf(val.toLowerCase()) > -1);
      })
    }
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
