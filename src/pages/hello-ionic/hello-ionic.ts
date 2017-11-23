import { Component } from '@angular/core';
import { CodePush } from '@ionic-native/code-push';
import { Platform } from 'ionic-angular';

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

  constructor(public plt: Platform, private codePush: CodePush) {
    if (this.plt.is('cordova')) {
      // Don't run codepush in browser.
      this.plt.ready().then((readySource) => {
        this.codePush.sync().subscribe((syncStatus) => console.log(syncStatus));
      });
    }
  }
  
}
