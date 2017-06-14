import { Component } from '@angular/core';

import {ListPage} from '../list/list';
import {PacketListPage} from "../packet-list/packet-list";

@Component({
  selector: 'page-hello-ionic',
  templateUrl: 'hello-ionic.html'
})
export class HelloIonicPage {
  listPage = ListPage;
  packetListPage = PacketListPage;

  constructor() {
    console.log("test");
  }
}
