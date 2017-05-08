import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';
import {LoadingController} from 'ionic-angular';

@Injectable()
export class ApiService {

  constructor(private http:Http, public loadingCtrl:LoadingController) {
  }

  getFile(url:string) {
    return this.http.get(url)
      .map((res:Response) => res.text());
  };

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

  coalesce(...args: any[]) {
    var len = args.length;
    for (var i=0; i<len; i++) {
      if (args[i] !== null && args[i] !== undefined) {
        return args[i];
      }
    }
    return null;
  }

}
