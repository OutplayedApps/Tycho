import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';
import { ApiService } from '../../app/services/ApiService';
import { TextToSpeech } from '@ionic-native/text-to-speech';
declare var window: any;

export interface optionsInterface {
    difficulty: string,
    mode: string,
    audio: string,
    vendorNum: string,
    setNum: string,
    packetNum: string,
}

@Injectable()
export class NSBService {
  public options: optionsInterface;
  public optionValues: any;
  public metadata: any;
  public setInfo: any;

  constructor(private http:Http, public apiService: ApiService, public tts: TextToSpeech) {
    this.optionValues = {
        difficulty: [
            {"label": "Middle School", value: "MS"},
            {"label": "High School", value: "HS"}
        ],
        mode: [
            {"label": "Reader mode", value: "READER"},
            {"label": "Game mode", value: "GAME"}
        ],
        audio: [
            {"label": "Audio on (Read questions out loud)", value: "TRUE"},
            {"label": "Audio off (Text only)", value: "FALSE"}
        ],
        vendorNum: String,
        setNum: String,
        packetNum: String
    }
    this.options = {
        difficulty: this.optionValues.difficulty[0].value,
        mode: this.optionValues.mode[0].value,
        audio: "TRUE",
        vendorNum: "DOE-MS",
        setNum: "1",
        packetNum: "1"
    };
}

    loadMetaData() {
        this.apiService.presentLoadingCustom();
        return this.apiService.getNSBMetadata().subscribe(metadata => {
          (<any>window).loading.dismiss();
          console.log(metadata);
          this.metadata = metadata;
          
        });
    }

    getSetAndFilter(fileName) {
        // gets set by file name, and then filters it.
        this.apiService.presentLoadingCustom();
        return this.apiService.getJSONFile("assets/files/questions/" + fileName + ".json").map(data => {
            (<any>window).loading.dismiss();
            return this.formatMultipleChoice(data);
        });
    }

    formatMultipleChoice(array) {
        for (let i in array) {
            array[i]["tossupQ"] = this.addLineBreaksToMultipleChoice(array[i]["tossupQ"]);
            array[i]["bonusQ"] = this.addLineBreaksToMultipleChoice(array[i]["bonusQ"]);
        }
        return array;
    }

    addLineBreaksToMultipleChoice(text) {
        return text.replace(/([W-Z]\))/g, "<br>$1");
    }

    timeUp() {
        let alert = this.apiService.alertCtrl.create({
            title: 'Time up!',
            subTitle: 'Time\'s up.',
            buttons: ['OK']
          });
        alert.present();
    }

    speakText(text) {
        /* Speaks given text (question or answer) by first converting it to HTML.
         */
        this.tts.speak(this.htmlToPlaintext(text))
        .then(() => console.log('Success'))
        .catch((reason: any) => console.log(reason));
    }

    stopSpeaking() {
        /* Stops speaking all text; called when user leaves window.
         * stop() function doesn't work so speaks empty text instead to work around that.
         */
        this.tts.speak("");
    }

    htmlToPlaintext(text) {
        return text ? String(text).replace(/<[^>]+>/gm, '') : '';
    }

}
