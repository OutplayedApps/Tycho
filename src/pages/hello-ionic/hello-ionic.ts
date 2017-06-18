import { Component } from '@angular/core';

import {ListPage} from '../list/list';
import {PacketListPage} from "../packet-list/packet-list";
import {AboutPage} from "../about-page/about-page";

@Component({
  selector: 'page-hello-ionic',
  templateUrl: 'hello-ionic.html'
})
export class HelloIonicPage {
  listPage = ListPage;
  packetListPage = PacketListPage;
  aboutPage = AboutPage;

  constructor() {
    console.log("test");
  }
}
