import { Component } from '@angular/core';
import { Platform } from 'ionic-angular';

import {ListPage} from '../list/list';
import {PacketListPage} from "../packet-list/packet-list";
import {AboutPage} from "../about-page/about-page";
import {NsbmenuPage} from "../nsbmenu/nsbmenu";
import { ApiService } from '../../app/services/ApiService';
import { CodePush } from '@ionic-native/code-push';

@Component({
  selector: 'page-hello-ionic',
  templateUrl: 'hello-ionic.html'
})
export class HelloIonicPage {
  listPage = ListPage;
  packetListPage = PacketListPage;
  aboutPage = AboutPage;
  NsbmenuPage = NsbmenuPage;

  constructor(private plt: Platform, private apiService: ApiService,
    private codePush: CodePush) {
    this.plt.ready().then((readySource) => {
      // this.codePush.sync().subscribe((syncStatus) => console.log(syncStatus));
      // return this.apiService.syncQuestionsAndMetadata();
    });
  }
  
}
