import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import {NsbappPage} from "../nsbapp/nsbapp";
import { ApiService } from '../../app/services/ApiService';
import { NSBService } from '../../app/services/NSBService';

/**
 * Generated class for the NsbmenuPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
@Component({
  selector: 'page-nsbmenu',
  templateUrl: 'nsbmenu.html',
  providers: [ApiService, NSBService]
})
export class NsbmenuPage {
  NsbappPage = NsbappPage;
  data: any;
  options: any;
  optionValues: any;
  setInfo: any;
  setChosen: any;
  difficulties: any[];
  vendors: any[];
  sets: any[];
  packets: any[];
  categories: any[];

  constructor(public navCtrl: NavController, public navParams: NavParams,
              public apiService: ApiService, public nsbService: NSBService) {
  }

  ngOnInit() { //runs only on init.
    (<any>window).This = this;

    this.options = this.nsbService.options;
    this.optionValues = this.nsbService.optionValues;
    this.setChosen = null;

    this.nsbService.options["gameType"] = this.navParams.get('gameType');
    console.log("game type is " + this.nsbService.options["gameType"] );
    this.nsbService.loadMetaData().then(() => {
      this.getDifficulties();
      console.log("difficulties", this.difficulties);
      this.getVendors();
      this.getSets();
      this.getPackets();
    });


    /*this.apiService.getQuizbowlTossups().then((data) => {
      console.log(data);
    });*/
    console.log('ngoninit');

  }

  ionViewDidLoad() {

    
  }

  ionViewWillEnter() {
    
  }

  trackByFn(index, item) {
    return index;
  }

  getCategories() {
    // Set default category
    if (this.options.gameType == "QB") return [];
    var categories = this.nsbService.optionValues.category;
    if (!~categories.indexOf(this.options.category)) {
      this.options.category = this.optionValues.category[0]; // Default: all
    }
    this.categories = categories;
  }

  getDisplayNameFromMetadata(currentMetadata, displayName="") {
    /* If displayLabel is defined, will either get displayLabel or label (if displayLabel is true).
     * Defaults to displayName
    */
    if (currentMetadata && currentMetadata["displayLabel"]) {
      if (typeof currentMetadata["displayLabel"] === 'string') {
        displayName = currentMetadata["displayLabel"];
      }
      else if (currentMetadata["displayLabel"] === true &&
            typeof currentMetadata["label"] === 'string') {
        displayName = currentMetadata["label"];
      }
    }
    return displayName;
  }

  getDifficulties() {
    this.difficulties = this.optionValues.difficulty[this.options.gameType];
  }

  prettifyVendorName(name) {
    /* Grabs vendor name from metadata.
     */
    if (this.options.gameType == "QB") return this.nsbService.optionValues.subDifficulties[name]; // description of sub-difficulty.
    return this.getDisplayNameFromMetadata(
      this.nsbService.metadata[name]["metadata"],
      name);
  }

  getVendors() {
    var vendors = [];
    if (this.options.gameType == "QB") {
      vendors = this.nsbService.getVendorsQB();
    } 
    else {
      for (let vendorNum in this.nsbService.metadata) {
        if (~vendorNum.indexOf("-" + this.options.difficulty))
          vendors.push(vendorNum);
      }
    }
    this.vendors = vendors;
    // Set default vendor.
    if (this.vendors.length) this.options.setNum = this.vendors[0].value;
  }

  getSets() {
    /* Gets sets. This function is called when the ion-select for vendorNum is changed.
     */
    var sets = [];
    if (this.options.vendorNum == 'RANDOM') { sets = []; this.getCategories(); return; }
    if (this.options.gameType == "QB") {
      sets = this.nsbService.getSetsQB();
    }
    else {
      var setNum = 0;
      for (let key in this.nsbService.metadata[this.options.vendorNum]) {
        setNum++;
        if (key == "metadata") continue;
        var setToDisplay = this.getDisplayNameFromMetadata(
          this.nsbService.metadata[this.options.vendorNum][key]["metadata"],
          setNum + "");
        sets.push({"name": setToDisplay, "value": setToDisplay});
      }
    }
    this.sets = sets;
    // Set default set.
    if (this.sets.length) this.options.setNum = this.sets[0].value;
  }

  getPackets() {
    var packets = [];
    if (this.options.vendorNum == 'RANDOM') {this.packets = []; return;}
    if (this.options.gameType == "QB") {
      packets = this.nsbService.getPacketsQB();
    }
    else {
      var packetNum = 0;
      for (let key in this.nsbService.metadata[this.options.vendorNum][this.options.setNum]) {
        packetNum++;
        if (key == "metadata") continue;
        packets.push(
          this.getDisplayNameFromMetadata(
            this.nsbService.metadata[this.options.vendorNum][this.options.setNum][key]["metadata"],
            packetNum + "")
        );
      }
    }
    this.packets = packets;
    // Set default packet.
    if (this.packets.length) this.options.packetNum = this.packets[0];
  }

  navigateNsbappPage() {
    if (this.options.vendorNum == 'RANDOM') {
      this.navCtrl.push(NsbappPage, {
        options: this.nsbService.options
      });
    }
    else {
      var packetInfo = this.nsbService.metadata[this.options.vendorNum][this.options.setNum][this.options.packetNum];
      this.navCtrl.push(NsbappPage, {
        options: this.nsbService.options,
        numQuestions: packetInfo.numQuestions,
        fileName: packetInfo.fileName
      });
    }
  }

}
