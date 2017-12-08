import { Injectable } from '@angular/core';
import { Http, Response, ResponseContentType, RequestOptions } from '@angular/http';
import {LoadingController, AlertController} from 'ionic-angular';
import 'rxjs/add/operator/mergeMap';
import { AppVersion } from '@ionic-native/app-version';
import { Market } from '@ionic-native/market';
import compareVersions from 'compare-versions';
import pako from 'pako';

@Injectable()
export class ApiService {
  private fileStructure;

  constructor(private http:Http, public loadingCtrl:LoadingController, public alertCtrl: AlertController,
    private market: Market, private appVersion: AppVersion) {
  }

  getFile(url:string) {
    return this.http.get(url)
      .map((res:Response) => res.text());
  };

  getJSONFile(url:string) {
    return this.http.get(url)
      .map((res:Response) => res.json());
  };

 getGzipFile(url:string) {
    return this.http.get(url, new RequestOptions({ responseType: ResponseContentType.Blob }))
      .map((res:Response) => {
        var blob = res.blob();
        var arrayBuffer;
        var fileReader = new FileReader();
        return new Promise(function(resolve, reject) {
          fileReader.readAsArrayBuffer(blob);
          fileReader.onload = function() {
              arrayBuffer = this.result;
              try {
                let result:any = pako.ungzip(new Uint8Array(arrayBuffer), {"to": "string"});
                let obj = JSON.parse(result);
                resolve(obj);
              } catch (err) {
                reject("Error ungzipping / parsing file: " + err);
              }
          };
          fileReader.onerror = function(err){
            reject("Error reading file: " + err);
          }
        });
      }).toPromise();
  }

  getNSBMetadata() {
    console.log("get nsb metadata");
    return this.getJSONFile("assets/files/questions/metadata.json");
  }

  getQuizbowlTossups() {
    return this.getGzipFile("assets/files/quizbowlQuestions/tossups-HS.json.gzip");
  }

  getQuizbowlMetadata() {
    console.log("get qb metadata");
    return this.getJSONFile("assets/files/quizbowlQuestions/metadata.json");
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

  openUpdateDialog() {
    /* Opens dialog if update is available. */
    this.getJSONFile("http://tiny.cc/tychoupdate").subscribe(data => {
      console.log(data);
      this.appVersion.getVersionNumber().then(currentVersion => {
      console.log("Current version: " + (currentVersion) + ", updated against: " + data.version);
        if (compareVersions(currentVersion, data.version) >= 0) {
          // same or greater-than version.
          console.log("Same version!");
          return;
        }
        var description = data.description.replace(/\n/g, "<br>");
        this.alertCtrl.create({
          title: 'Update available',
          subTitle: '<b>Version ' + data.version + ": </b><br><br>" + description,
          buttons: ['Cancel', 
          {
            text: 'Update',
            handler: () => {this.goToAppStore()}
          }]
        }).present();
      });
    });
  }

  goToAppStore() {
    /* Goes to app store / google play store of this app in case of an update. */
    this.appVersion.getPackageName().then(appId => {
      return this.market.open(appId);
    }).then(d => {
      console.log("Thank you for updating!")
    }).catch(e => {
      this.error();
    });
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
