import { Component } from '@angular/core';
import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';
import { ApiService } from '../../app/services/ApiService';
import 'rxjs/add/operator/map';

import { GalleryModal } from 'ionic-gallery-modal';
import { ModalController, NavController, NavParams } from 'ionic-angular';
import { PhotoViewer } from '@ionic-native/photo-viewer';

@Injectable()
@Component({
  selector: 'page-item-details',
  templateUrl: 'item-details.html',
  providers: [ApiService, PhotoViewer]
})
export class ItemDetailsPage {
  Class:any;
  selectedItem:any;
  pageContent:any;

  loading:any;

  constructor(public navCtrl:NavController, public navParams:NavParams,
              private http:Http, private apiService: ApiService, public modalCtrl:ModalController,
              public photoViewer: PhotoViewer) {
    // If we navigated to this page, we will have an item available as a nav param
    this.selectedItem = navParams.get('item');
    console.log(this.selectedItem);
  }

  ionViewDidLoad() {

    this.apiService.presentLoadingCustom();
    var url = '//cdn.mozilla.net/pdfjs/tracemonkey.pdf';
    url = 'assets/files/YGKschoolsofthought.pdf'
    console.log(this.selectedItem);
    console.log(this.selectedItem.googleDocsId);
    url = 'https://www.googleapis.com/drive/v3/files/fileId/export?fileId='+this.selectedItem.googleDocsId+'&mimeType=text/html&key=AIzaSyDIzqeDtau8sP6OtsURRSsSjUxDR1Qd1RA';
    this.apiService.getFile(url).subscribe(data => {
      console.log(data);
      function stripScripts(s) {
        var div = document.createElement('div');
        div.innerHTML = s;
        //var scripts = div.getElementsByTagName('style');
        //var i = scripts.length;
        /*while (i--) {
          scripts[i].parentNode.removeChild(scripts[i]);
        }*/
        var images = div.getElementsByTagName('IMG');
        for (let i = 0; i<images.length; i++) {
          images[i].setAttribute("imageViewer","");
        }
        return div.innerHTML;
      }

      //data = stripScripts(data);
      (<any>window).loading.dismiss();
      this.pageContent = data;
    },
      (err) => {
        (<any>window).loading.dismiss();
        this.apiService.error();
      }
    );

    //url = this.selectedItem.url;


  }
  pageClickHandler(e: HTMLElement){
    console.log(e); // here is the element which has been clicked
    (<any>window).e = e;
    if (e.tagName=="IMG") {
      //e.setAttribute("imageViewer","");
      /*let modal = this.modalCtrl.create(GalleryModal, {
        photos: [{url: e.getAttribute("src")}],
        initialSlide: 0
      });
      modal.present();*/
      this.photoViewer.show(e.getAttribute("src"));
    }
  }





}
