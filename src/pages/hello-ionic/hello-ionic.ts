import { Component } from '@angular/core';

import {ListPage} from '../list/list';
import {PacketListPage} from "../packet-list/packet-list";
import {AboutPage} from "../about-page/about-page";
import {NsbappPage} from "../nsbapp/nsbapp";

@Component({
  selector: 'page-hello-ionic',
  templateUrl: 'hello-ionic.html'
})
export class HelloIonicPage {
  listPage = ListPage;
  packetListPage = PacketListPage;
  aboutPage = AboutPage;
  NsbappPage = NsbappPage;

  constructor() {
    console.log("test");
  }
}
