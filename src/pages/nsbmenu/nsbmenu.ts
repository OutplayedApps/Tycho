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
    this.nsbService.loadMetaData();

    console.log('ionViewDidLoad NsbappPage');

    console.log('ngoninit nsbmenupage');
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad NsbmenuPage');
  }

  trackByFn(index, item) {
    return index;
  }

  getSets() {
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

  prettifyVendorName(name) {
    /* Grabs vendor name from metadata.
     */
    return this.getDisplayNameFromMetadata(
      this.nsbService.metadata[name]["metadata"],
      name);
  }

  getVendors() {
    let vendors = [];
    for (let vendorNum in this.nsbService.metadata) {
      if (~vendorNum.indexOf("-" + this.options.difficulty))
        vendors.push(vendorNum);
    }
    // Set default vendorNum
    if (!~vendors.indexOf(this.options.vendorNum)) {
      this.options.vendorNum = this.options.difficulty == "MS" ? "DOE-MS": "DOE-HS";
    }

    return vendors;
  }

  getPackets() {
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
    var packetInfo = this.nsbService.metadata[this.options.vendorNum][this.options.setNum][this.options.packetNum];
    this.navCtrl.push(NsbappPage, {
      options: this.nsbService.options,
      numQuestions: packetInfo.numQuestions,
      fileName: packetInfo.fileName
    })
  }

}
