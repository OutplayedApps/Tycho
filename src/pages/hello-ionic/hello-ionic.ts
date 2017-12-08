import { Component } from '@angular/core';
import { Platform, NavController } from 'ionic-angular';

import {ListPage} from '../list/list';
import {PacketListPage} from "../packet-list/packet-list";
import {AboutPage} from "../about-page/about-page";
import {NsbmenuPage} from "../nsbmenu/nsbmenu";

@Component({
  selector: 'page-hello-ionic',
  templateUrl: 'hello-ionic.html'
})
export class HelloIonicPage {
  listPage = ListPage;
  packetListPage = PacketListPage;
  aboutPage = AboutPage;
  NsbmenuPage = NsbmenuPage;
  ParamsNSB = { "gameType": "NSB"};
  ParamsQB = { "gameType": "QB"};

  constructor(public navCtrl: NavController) {
  }
  navigateNsbmenuPage(params) {
      this.navCtrl.push(NsbmenuPage, params);
  }
  
}
