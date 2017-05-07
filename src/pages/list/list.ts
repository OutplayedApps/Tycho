import { Component } from '@angular/core';

import { NavController, NavParams } from 'ionic-angular';

import { ItemDetailsPage } from '../item-details/item-details';

@Component({
  selector: 'page-list',
  templateUrl: 'list.html'
})
export class ListPage {
  icons: string[];
  items: Array<{title: string, note: string, icon: string, url: string}>;

  constructor(public navCtrl: NavController, public navParams: NavParams) {
    this.icons = ['flask', 'wifi', 'beer', 'football', 'basketball', 'paper-plane',
      'american-football', 'boat', 'bluetooth', 'build'];

    this.items = [];
    for (let i in [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]) {
      this.items.push({
        title: 'Item ' + i,
        note: 'This is item #' + i,
        icon: this.icons[Math.floor(Math.random() * this.icons.length)],
        url: "//www.quizbowlpackets.com/1837/Round " + ((Number(i) < 10) ? "0" + i : i) + ".pdf"
      });
    }
    //getUrl("https://sheets.googleapis.com/v4/spreadsheets/1eXYberMxmy8c9vV4N1_pM1WyE5AVcNgiK9YKkApIw0U/values/Aggregate%20individual%20stats!B9:B20?key=AIzaSyBG2JJkYhiFHwhvQn_vGMcZihbwIBxvS_o&majorDimension=COLUMNS").subscribe(data => {

  }

  itemTapped(event, item) {
    this.navCtrl.push(ItemDetailsPage, {
      item: item
    });
  }
}
