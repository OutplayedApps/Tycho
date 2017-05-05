import { Component } from '@angular/core';

import { NavController, NavParams, LoadingController } from 'ionic-angular';


@Component({
  selector: 'page-item-details',
  templateUrl: 'item-details.html'
})
export class ItemDetailsPage {
  Class: any;
  selectedItem: any;

  loading: any;f

  constructor(public navCtrl: NavController, public navParams: NavParams, public loadingCtrl: LoadingController) {
    // If we navigated to this page, we will have an item available as a nav param
    this.selectedItem = navParams.get('item');
    console.log(this.selectedItem);
  }
  ionViewDidLoad() {
    //this.presentLoadingCustom();
    var url = '//cdn.mozilla.net/pdfjs/tracemonkey.pdf';
    url = 'assets/files/YGKschoolsofthought.pdf'
    console.log(this.selectedItem);
    console.log(this.selectedItem.url);
    //url = this.selectedItem.url;
  

  }
  }
/*
 presentLoadingCustom() {
  let loading = this.loadingCtrl.create({
    spinner: 'hide',
    content: `
      <div class="loading-custom-spinner-container">
        <div class="loading-custom-spinner-box"></div>
        <div class="loading-content">Loading file...</div>
      </div>`
  });

  loading.onDidDismiss(() => {
    console.log('Dismissed loading');
  });

  loading.present();
    (<any>window).loading = loading;
}


*/