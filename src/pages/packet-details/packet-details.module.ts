import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { PacketDetails } from './packet-details';

@NgModule({
  declarations: [
    PacketDetails,
  ],
  imports: [
    IonicPageModule.forChild(PacketDetails),
  ],
  exports: [
    PacketDetails
  ]
})
export class PacketDetailsModule {}
