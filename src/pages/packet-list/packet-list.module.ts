import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { PacketListPage } from './packet-list';

@NgModule({
  declarations: [
    PacketListPage,
  ],
  imports: [
    IonicPageModule.forChild(PacketListPage),
  ],
  exports: [
    PacketListPage
  ]
})
export class PacketListModule {}
