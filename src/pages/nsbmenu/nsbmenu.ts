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
  difficulties: DropdownOption[];
  vendors: DropdownOption[];
  sets: DropdownOption[];
  packets: DropdownOption[];
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
    // console.log("game type is " + this.nsbService.options["gameType"] );
    this.nsbService.loadMetaData().then(() => {
      this.getDifficulties();
      // console.log("difficulties", this.difficulties);
      this.getVendors();
      this.getSets();
      this.getPackets();
    });


    /*this.apiService.getQuizbowlTossups().then((data) => {
      // console.log(data);
    });*/
    // console.log('ngoninit');

  }

  ionViewDidLoad() {

    
  }

  ionViewWillEnter() {
    
  }

  trackByFn(index, item) {
    return index;
  }

  getCategories() {
    var categories = this.nsbService.optionValues.category[this.options.gameType];

    this.categories = categories;
    this.options.category = this.optionValues.category[0]; // Default: all
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
          vendors.push({"name": vendorNum, "value": vendorNum});
      }
    }
    this.vendors = vendors;
    // Set default vendor.
    if (this.vendors.length) this.options.vendorNum = this.vendors[0].value;
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
      packets = this.nsbService.getPacketsQB(this.sets);
    }
    else {
      var packetNum = 0;
      for (let key in this.nsbService.metadata[this.options.vendorNum][this.options.setNum]) {
        packetNum++;
        if (key == "metadata") continue;
        var packetName = this.getDisplayNameFromMetadata(
          this.nsbService.metadata[this.options.vendorNum][this.options.setNum][key]["metadata"],
          packetNum + "");
        var packetValue = packetName;
        packets.push({"name": packetName, "value": packetValue});
      }
    }
    this.packets = packets;
    // Set default packet.
    if (this.packets.length) this.options.packetNum = this.packets[0].value;
  }

  navigateNsbappPage() {
    this.populateSetAndPacketNames();
    if (this.options.vendorNum == 'RANDOM') {
      this.navCtrl.push(NsbappPage, {
        options: this.nsbService.options
      });
    }
    else {
      // Passes the file name in the packetInfo object on to the nsbapp page.
      var packetInfo;
      if (this.options.gameType == "NSB") {
        packetInfo = this.nsbService.metadata[this.options.vendorNum][this.options.setNum][this.options.packetNum];
        /* {fileName: 'DOE-MS-1-2 (vendorNum)-(setNum)-(packetNum)', numQuestions: 20} */
      }
      else { // "QB"
        packetInfo = {"fileName": this.options.setNum + "-" + this.options.packetNum};
      }
      // console.log(packetInfo);
      this.navCtrl.push(NsbappPage, {
        options: this.nsbService.options,
        fileName: packetInfo.fileName
      });
    }
  }

  populateSetAndPacketNames() {
    /* Inefficient way to pass the set and packet names to the nsbapp page, as it usually only stores setNum / packetNum. */
    this.options.setName = this.options.setNum == 'RANDOM' ? 'RANDOM' : this.sets.filter((set) => {return set.value == this.options.setNum; })[0].name;
    this.options.packetName = this.packets.filter((pkt) => {return pkt.value == this.options.packetNum; })[0].name;
  }

}
