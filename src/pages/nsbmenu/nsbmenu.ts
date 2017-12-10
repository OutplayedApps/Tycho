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
    return categories;
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
    //console.log(this.optionValues.difficulty, this.options.gameType, this.optionValues.difficulty[this.options.gameType]);
    return this.optionValues.difficulty["NSB"];
  }

  prettifyVendorName(name) {
    /* Grabs vendor name from metadata.
     */
    return this.getDisplayNameFromMetadata(
      this.nsbService.metadata[name]["metadata"],
      name);
  }

  getVendors() {
    if (this.options.gameType == "QB") return this.nsbService.getVendorsQB();
    let vendors = [];
    for (let vendorNum in this.nsbService.metadata) {
      if (~vendorNum.indexOf("-" + this.options.difficulty))
        vendors.push(vendorNum);
    }
    // Set default vendorNum
    if (this.options.vendorNum != 'RANDOM' && !~vendors.indexOf(this.options.vendorNum)) {
      this.options.vendorNum = vendors[0];
    }

    return vendors;
  }

  getSets() {
    if (this.options.vendorNum == 'RANDOM') return [];
    if (this.options.gameType == "QB") return this.nsbService.getSetsQB();
    let sets = [];
    var setNum = 0;
    for (let key in this.nsbService.metadata[this.options.vendorNum]) {
      setNum++;
      if (key == "metadata") continue;
      sets.push(
        this.getDisplayNameFromMetadata(
          this.nsbService.metadata[this.options.vendorNum][key]["metadata"],
          setNum + "")
      );
    }
    return sets;
  }

  getPackets() {
    if (this.options.gameType == "QB") return [];
    if (this.options.vendorNum == 'RANDOM') return [];
    let packets = [];
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
    return packets;
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
