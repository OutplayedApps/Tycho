import { BrowserModule } from '@angular/platform-browser';
import { NgModule, ErrorHandler } from '@angular/core';
import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';
import { MyApp } from './app.component';
import { HttpModule } from '@angular/http';

import { HelloIonicPage } from '../pages/hello-ionic/hello-ionic';
import { ItemDetailsPage } from '../pages/item-details/item-details';
import { ListPage } from '../pages/list/list';
import {PacketListPage} from "../pages/packet-list/packet-list";
import {AboutPage} from "../pages/about-page/about-page";
import {NsbappPage} from "../pages/nsbapp/nsbapp";

import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { FileOpener } from '@ionic-native/file-opener';

import { SafeHtml } from './pipes/SafeHtml';
import { InAppBrowser } from '@ionic-native/in-app-browser';

@NgModule({
  declarations: [
    MyApp,
    HelloIonicPage,
    ItemDetailsPage,
    ListPage,
    PacketListPage,
    SafeHtml,
    AboutPage,
    NsbappPage
  ],
  imports: [
    HttpModule,
    BrowserModule,
    IonicModule.forRoot(MyApp)

  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    HelloIonicPage,
    ItemDetailsPage,
    ListPage,
    PacketListPage,
    AboutPage,
    NsbappPage
  ],
  providers: [
    StatusBar,
    SplashScreen,
    FileOpener,
    InAppBrowser,
    {provide: ErrorHandler, useClass: IonicErrorHandler}
  ]
})
export class AppModule {}
