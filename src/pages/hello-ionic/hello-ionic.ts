import { Component } from '@angular/core';

import {ListPage} from '../list/list';

@Component({
  selector: 'page-hello-ionic',
  templateUrl: 'hello-ionic.html'
})
export class HelloIonicPage {
  listPage = ListPage;
  constructor() {
    console.log("test");
  }
}
