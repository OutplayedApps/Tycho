import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';
import { ApiService } from '../../app/services/ApiService';
declare var window: any;

@Injectable()
export class NSBService {
  private fileStructure;
  public options: any;
  public optionValues: any;
  public data: any;
  public setInfo: any;

  constructor(private http:Http, public apiService: ApiService) {
    console.log('constructing');
    this.optionValues = {
        difficulty: ["MS", "HS"],
        mode: ["Reader mode", "Game mode"],
        setNum: Number,
        packetNum: Number
    }
    this.options = {
        difficulty: this.optionValues.difficulty[0],
        mode: this.optionValues.mode[0],
        setNum: 1,
        packetNum: 1
    };
}

    loadData() {
        this.apiService.presentLoadingCustom();
        return this.apiService.getNSBQuestions().subscribe(data => {
          (<any>window).loading.dismiss();
          console.log(data);
          this.data = data;
          this.setInfo = {
              "HS": this.getSetInfo(data, "HS"),
              "MS": this.getSetInfo(data, "MS")
          };
        });
    }

    getSetInfo(data, name) {
        let questions = data[name];
        let sets = [];
        
        for (let i = 1; questions[i+"_1_1"]; i++) {
            let set = {"index": i, "packets": [] };
            for (let j = 1; questions[i+"_"+j+"_1"]; j++) {
                set.packets.push(j);
            }
            sets.push(set);
        }
        console.log(sets);
        return sets;
    }

    filterSetBasedOnOptions() {
        console.log(this.data);
        let questions = this.data[this.options.difficulty];
        var array = Object.keys(questions).map(key => questions[key])
        array = array.filter(obj => {
            return obj.setNum == this.options.setNum && obj.packetNum == this.options.packetNum;
        });
        return this.formatMultipleChoice(array);
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

}
