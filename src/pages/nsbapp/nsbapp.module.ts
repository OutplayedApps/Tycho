import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { NsbappPage } from './nsbapp';

@NgModule({
  declarations: [
    NsbappPage,
  ],
  imports: [
    IonicPageModule.forChild(NsbappPage),
  ],
  exports: [
    NsbappPage
  ]
})
export class NsbappPageModule {}
