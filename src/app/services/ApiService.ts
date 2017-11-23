import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';
import {LoadingController, AlertController} from 'ionic-angular';
import 'rxjs/add/operator/mergeMap';

@Injectable()
export class ApiService {
  private fileStructure;

  constructor(private http:Http, public loadingCtrl:LoadingController, public alertCtrl: AlertController) {
  }

  getFile(url:string) {
    return this.http.get(url)
      .map((res:Response) => res.text());
  };

  getJSONFile(url:string) {
    return this.http.get(url)
      .map((res:Response) => res.json());
  };

  getNSBQuestionFile(vendorNum, setNum, packetNum) {
    var fileName = vendorNum + "-" + setNum + "-" + packetNum;
    return this.http.get("assets/files/questions/"+ fileName +".json")
      .map((res:Response) => res.json());
  }

  getNSBMetadata() {
    return this.http.get("assets/files/questions/metadata.json")
      .map((res:Response) => res.json());
  }

  getFileStructure() {
    return this.http.get("assets/packets/filestructure.json")
        .map((res:Response) => res.json());
  };

  syncQuestionsAndMetadata() {
    return this.getNSBMetadata().mergeMap(metadata => {
      var date_modified = metadata["date_modified"];
      if (!date_modified) {
        date_modified = (new Date()).toISOString();
      }
      return this.http.get("https://tychoadmin.herokuapp.com/mobile_api/?time="+date_modified).map((res:Response) => res.json());
    }).subscribe(response => {
      console.log(response);
    });
  }

  presentLoadingCustom() {
    let loading = this.loadingCtrl.create({
      spinner: 'hide',
      content: `
      <div class="loading-custom-spinner-container">
        <div class="loading-custom-spinner-box"></div>
        <div class="loading-content">Loading...</div>
      </div>`
    });

    loading.onDidDismiss(() => {
      console.log('Dismissed loading');
    });

    loading.present();
    (<any>window).loading = loading;
  }

  error() {
    //showAlert() {
      let alert = this.alertCtrl.create({
        title: 'Error',
        subTitle: 'Sorry, there was an error. Please try again later.',
        buttons: ['OK']
      });
      alert.present();
    //}
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


  static hashCode(str:any) { // java String#hashCode
    var hash = 0;
    for (var i = 0; i < str.length; i++) {
      hash = str.charCodeAt(i) + ((hash << 5) - hash);
    }
    return hash;
  }

  static intToRGB(i){
    var c = (i & 0x00FFFFFF)
      .toString(16)
      .toUpperCase();

    return "00000".substring(0, 6 - c.length) + c;
  }

  public colorHash(title) {
    return '#' + ApiService.intToRGB(ApiService.hashCode(title));
  }

}
