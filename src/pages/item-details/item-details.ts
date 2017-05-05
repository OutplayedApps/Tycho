import { Component } from '@angular/core';

import { NavController, NavParams } from 'ionic-angular';

import {PDFJS} from 'pdfjs-dist';

@Component({
  selector: 'page-item-details',
  templateUrl: 'item-details.html'
})
export class ItemDetailsPage {
  selectedItem: any;

  constructor(public navCtrl: NavController, public navParams: NavParams) {
    // If we navigated to this page, we will have an item available as a nav param
    this.selectedItem = navParams.get('item');
    //loadPDF();
  }
  ionViewDidLoad() {
    //loadPDF();
    var url = '//cdn.mozilla.net/pdfjs/tracemonkey.pdf';
    var canvasContainer = document.getElementById("pdf-canvas");
    renderPDF(url, canvasContainer);
  }
}

function loadPDF() {
  // If absolute URL from the remote server is provided, configure the CORS
// header on that server.
  var url = '//cdn.mozilla.net/pdfjs/tracemonkey.pdf';
  //url='http://cdn.mozilla.net/pdfjs/helloworld.pdf';
  //url = 'files/Test.pdf';

// The workerSrc property shall be specified.
  //var PDFJS:any; // Magic

  PDFJS.workerSrc = '//mozilla.github.io/pdf.js/build/pdf.worker.js';
  //PDFJS.workerSrc = 'pdf.worker.min.js';

  var pdfDoc = null,
    pageNum = 1,
    pageRendering = false,
    pageNumPending = null,
    scale = 0.8,
    canvas = <HTMLCanvasElement> document.getElementById('pdf-canvas'),
    ctx = canvas.getContext('2d');

  /**
   * Get page info from document, resize canvas accordingly, and render page.
   * @param num Page number.
   */
  function renderPage(num) {
    pageRendering = true;
    // Using promise to fetch the page
    pdfDoc.getPage(num).then(function(page) {
      var viewport = page.getViewport(scale);
      canvas.height = viewport.height;
      canvas.width = viewport.width;

      // Render PDF page into canvas context
      var renderContext = {
        canvasContext: ctx,
        viewport: viewport
      };
      var renderTask = page.render(renderContext);

      // Wait for rendering to finish
      renderTask.promise.then(function() {
        pageRendering = false;
        if (pageNumPending !== null) {
          // New page rendering is pending
          renderPage(pageNumPending);
          pageNumPending = null;
        }
      });
    });

    // Update page counters
    document.getElementById('page_num').textContent = String(pageNum);
  }

  /**
   * If another page rendering in progress, waits until the rendering is
   * finised. Otherwise, executes rendering immediately.
   */
  function queueRenderPage(num) {
    if (pageRendering) {
      pageNumPending = num;
    } else {
      renderPage(num);
    }
  }

  /**
   * Displays previous page.
   */
  function onPrevPage() {
    if (pageNum <= 1) {
      return;
    }
    pageNum--;
    queueRenderPage(pageNum);
  }
  document.getElementById('prev').addEventListener('click', onPrevPage);

  /**
   * Displays next page.
   */
  function onNextPage() {
    if (pageNum >= pdfDoc.numPages) {
      return;
    }
    pageNum++;
    queueRenderPage(pageNum);
  }
  document.getElementById('next').addEventListener('click', onNextPage);

  /**
   * Asynchronously downloads PDF.
   */
  PDFJS.getDocument(url).then(function(pdfDoc_) {
    pdfDoc = pdfDoc_;
    document.getElementById('page_count').textContent = pdfDoc.numPages;

    // Initial/first page rendering
    renderPage(pageNum);
  });

}

function renderPDF(url, canvasContainer, options?) {
  var options = options || { scale: 1 };

  function renderPage(page) {
    var viewport = page.getViewport(options.scale);
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
    for(var num = 1; num <= pdfDoc.numPages; num++)
      pdfDoc.getPage(num).then(renderPage);
  }
  PDFJS.workerSrc = '//mozilla.github.io/pdf.js/build/pdf.worker.js';
  PDFJS.disableWorker = false;
  PDFJS.getDocument(url).then(renderPages);
}
