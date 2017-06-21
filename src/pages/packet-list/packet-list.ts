import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { ApiService } from '../../app/services/ApiService';
import { FileOpener } from '@ionic-native/file-opener';
import { InAppBrowser } from '@ionic-native/in-app-browser';
declare var cordova: any;
declare var window: any;

/**
 * Generated class for the PacketList page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
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
              private fileOpener: FileOpener, private iab: InAppBrowser) {
    this.type = navParams.get('type');

    if (!this.type) this.type = this.TYPES.DIFFICULTYLIST;
    this.path = navParams.get('path');
    this.currentLevel = navParams.get('currentLevel');
    this.currentSet = navParams.get('currentSet');
    if (this.currentLevel == "undefined" || this.currentLevel == "null") this.currentLevel = null;
    if (this.currentSet == "undefined" || this.currentSet == "null") this.currentSet = null;
    if (this.currentLevel) {this.type = this.TYPES.SETLIST;}
    if (this.currentSet) {this.type = this.TYPES.PACKETLIST;}
    this.item = navParams.get('item');
  }

  ionViewDidLoad() {
    var items, listTitle;
    var difficulties = [{
      id: "ms",
      title: "Middle School",
      icon: "md-book",
      description: "Middle school packet archive.\n\nExample: CMST",
    },
      {
        id: "hs",
        title: "High School"
      },
      {
        id: "collegiate",
        title: "Collegiate"
      }
    ];

    function formatLevel(lvl) {
      for (let i = 0; i < difficulties.length; i++) {
        if (difficulties[i].id == lvl) return difficulties[i].title;
      }
      return "";
    }

    (<any>window).This = this;
    this.apiService.presentLoadingCustom();
    switch (this.type) {
      case this.TYPES.DIFFICULTYLIST:
        this.apiService.getFileStructure().subscribe(data => {
          data = data.children;
          data = data.filter(function (item) {
            return ~["ms", "hs", "collegiate"].indexOf(item.name);
          });
          for (let i = 0; i < data.length; i++) {
            let item = data[i];
            if (item.name == difficulties[0].id) {
              item.title = difficulties[0].title;
              item.icon = "md-book";
              item.description = "Middle school packet archive.\n\nExample: CMST";
              item.currentLevel = "ms";
            }
            else if (item.name == difficulties[1].id) {
              item.title = difficulties[1].title;
              item.icon = "md-laptop";
              item.description = "High school packet archive.\n\nExample: LIST, FKT, PACE NSC";
              item.currentLevel = "hs";
            }
            else if (item.name == difficulties[2].id) {
              item.title = difficulties[2].title;
              item.icon = "md-school";
              item.description = "Collegiate and open packets.\n\nExample: MUT, ACF Fall, ACF Nationals, Chicago Open";
              item.currentLevel = "collegiate";
            }
            else {
              item.title = "Not found";
              item.currentLevel = "null";
            }
          }
          this.items = data;
          this.itemsAll = data;
          this.listTitle = "Choose a packet difficulty";
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
        items = items.sort((a,b) => {
          return b.name.localeCompare(a.name); //sorts z to a
        });
        listTitle = formatLevel(this.currentLevel);
        (<any>window).loading.dismiss();
        break;
      case this.TYPES.PACKETLIST:
        var data = this.item.children;
        for (let i = 0; i < data.length; i++) {
          var item = data[i];
          item["currentLevel"] = this.currentLevel;
          item["currentSet"] = this.currentSet;
          item["currentPacket"] = item.name;
        }
        items = data;
        items = items.sort((a, b) => {
          return a.name.localeCompare(b.name); //sorts a to z
        });
        listTitle = formatLevel(this.currentLevel) + " - " + this.currentSet;
        (<any>window).loading.dismiss();
        break;
    }
    if (items) {
      this.items = items;
      this.itemsAll = items;
      this.listTitle = listTitle;
    }
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
    var iab = this.iab;
    if (item.currentPacket) {
      //this.navCtrl.push(PacketDetails, queryParams);
      var url = 'www/assets/packets/'+item.currentLevel+'/'+item.currentSet+'/'+item.currentPacket;

      //queryParams.url = url;
      window.resolveLocalFileSystemURL(cordova.file.applicationDirectory + url, function(fileEntry) {

        window.resolveLocalFileSystemURL(cordova.file.externalDataDirectory, function(dirEntry: any) {

          fileEntry.copyTo(dirEntry, url.split('/').pop(), function(newFileEntry) {
            var option:string = "_blank";
            if (~navigator.userAgent.indexOf('Android')) {option = "_system";}
            iab.create(newFileEntry.nativeURL, option, 'location=yes');
          });
        });
      });
      //this.iab.create(url, '_system', 'location=yes');
      //this.fileOpener.open(, 'application/pdf');
      // opens the study guide itself.
    }
    else {
      this.navCtrl.push(PacketListPage, queryParams);
    }
  }
  public colorHash = this.apiService.colorHash;


}
