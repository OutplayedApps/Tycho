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
  }

  ionViewDidLoad() {
    var items, listTitle;
    (<any>window).file = this.file;
    this.file.checkDir(this.file.dataDirectory, '')
      .then((files) => console.log('Directory exists'))
      .catch((err) => console.log('Directory doesnt exist'));
    switch (this.type) {
      case this.TYPES.DIFFICULTYLIST:
        items = [
          {"title": "Middle School", "icon": "md-book", "description": "Middle school packet archive.\n\nExample: CMST"},
          {"title": "High School", "icon": "md-laptop", "description":"High school packet archive.\n\nExample: LIST, FKT, PACE NSC"},
          {"title": "Collegiate ", "icon": "md-school", "description":"Collegiate and open packets.\n\nExample: MUT, ACF Fall, ACF Nationals, Chicago Open"}
        ];
        listTitle = "Choose a packet difficulty";
        break;
      case this.TYPES.SETLIST:

        break;
      case this.TYPES.PACKETLIST:

        break;
    }
    this.items = items;
    this.listTitle = listTitle;
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
    if (item.guideId) {
      this.navCtrl.push(PacketDetails, queryParams);
      // opens the study guide itself.
    }
    else {
      this.navCtrl.push(PacketListPage, queryParams);
    }
  }
  public colorHash = this.apiService.colorHash;


}
