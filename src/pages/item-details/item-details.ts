import { Component } from '@angular/core';
import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';
import { ApiService } from '../../app/services/ApiService';
import 'rxjs/add/operator/map';

import { NavController, NavParams } from 'ionic-angular';

@Injectable()
@Component({
  selector: 'page-item-details',
  templateUrl: 'item-details.html',
  providers: [ApiService]
})
export class ItemDetailsPage {
  Class:any;
  selectedItem:any;
  pageContent:any;

  loading:any;

  constructor(public navCtrl:NavController, public navParams:NavParams,
              private http:Http, private apiService: ApiService) {
    // If we navigated to this page, we will have an item available as a nav param
    this.selectedItem = navParams.get('item');
    console.log(this.selectedItem);
  }

  ionViewDidLoad() {

    this.apiService.presentLoadingCustom();
    var url = '//cdn.mozilla.net/pdfjs/tracemonkey.pdf';
    url = 'assets/files/YGKschoolsofthought.pdf'
    console.log(this.selectedItem);
    console.log(this.selectedItem.url);
    url = 'https://www.googleapis.com/drive/v3/files/fileId/export?fileId=1Xxqt2V9gu0ghEMBgVm4xNbEO579Pq8uNXbc5r1OD58I&mimeType=text/html&key=AIzaSyDIzqeDtau8sP6OtsURRSsSjUxDR1Qd1RA';
    this.apiService.getFile(url).subscribe(data => {
      console.log(data);
      function stripScripts(s) {
        var div = document.createElement('div');
        div.innerHTML = s;
        var scripts = div.getElementsByTagName('style');
        var i = scripts.length;
        while (i--) {
          scripts[i].parentNode.removeChild(scripts[i]);
        }
        return div.innerHTML;
      }

      //data = stripScripts(data);
      (<any>window).loading.dismiss();
      this.pageContent = data;
    });

    //url = this.selectedItem.url;


  }





}
