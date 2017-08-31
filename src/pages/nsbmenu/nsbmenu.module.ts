import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { NsbmenuPage } from './nsbmenu';

@NgModule({
  declarations: [
    NsbmenuPage,
  ],
  imports: [
    IonicPageModule.forChild(NsbmenuPage),
  ],
  exports: [
    NsbmenuPage
  ]
})
export class NsbmenuPageModule {}
