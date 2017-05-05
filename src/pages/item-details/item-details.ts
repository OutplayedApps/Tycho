import { Component } from '@angular/core';

import { NavController, NavParams, LoadingController } from 'ionic-angular';

import {PDFJS} from 'pdfjs-dist';

@Component({
  selector: 'page-item-details',
  templateUrl: 'item-details.html'
})
export class ItemDetailsPage {
  Class: any;
  selectedItem: any;

  loading: any;

  constructor(public navCtrl: NavController, public navParams: NavParams, public loadingCtrl: LoadingController) {
    // If we navigated to this page, we will have an item available as a nav param
    this.selectedItem = navParams.get('item');
    //loadPDF();
  }
  ionViewDidLoad() {
    //loadPDF();
    this.presentLoadingCustom();
    var url = '//cdn.mozilla.net/pdfjs/tracemonkey.pdf';
    var canvasContainer = document.getElementById("pdf-canvas");
    this.renderPDF(url, canvasContainer);
  }

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

  renderPDF(url, canvasContainer, options?) {
  var options = options || { scale: 1 };

  function renderPage(page) {
    //var viewport = page.getViewport(options.scale);
    console.log(canvasContainer.scrollWidth / page.getViewport(1.0).width);
    var viewport = page.getViewport(canvasContainer.scrollWidth / page.getViewport(1.0).width);
    var canvas = document.createElement('canvas');
    var ctx = canvas.getContext('2d');
    var renderContext = {
      canvasContext: ctx,
      viewport: viewport
    };

    canvas.height = viewport.height;
    canvas.width = viewport.width;
    canvasContainer.appendChild(canvas);

    page.render(renderContext);
  }

  function renderPages(pdfDoc) {
    var promiseList = [];
    for(var num = 1; num <= pdfDoc.numPages; num++) {
      var pn = pdfDoc.getPage(num);
      promiseList.push(pn.then(renderPage));
    }
    Promise.all(promiseList).then(function() {
      console.log("loaded");
      (<any>window).loading.dismiss();
    });
  }

  PDFJS.workerSrc = '//mozilla.github.io/pdf.js/build/pdf.worker.js';
  PDFJS.disableWorker = false;
  PDFJS.getDocument(url).then(renderPages);
}
}
