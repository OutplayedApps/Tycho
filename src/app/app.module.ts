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
import {NsbmenuPage} from "../pages/nsbmenu/nsbmenu";
import {SplashPage} from "../pages/splash/splash";
import { ApiService } from './services/ApiService';

import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { FileOpener } from '@ionic-native/file-opener';

import { SafeHtml } from './pipes/SafeHtml';
import { InAppBrowser } from '@ionic-native/in-app-browser';
import { TextToSpeech } from '@ionic-native/text-to-speech';
import { CodePush } from '@ionic-native/code-push';

@NgModule({
  declarations: [
    MyApp,
    HelloIonicPage,
    ItemDetailsPage,
    ListPage,
    PacketListPage,
    SafeHtml,
    AboutPage,
    NsbappPage,
    NsbmenuPage,
    SplashPage
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
    NsbappPage,
    NsbmenuPage,
    SplashPage
  ],
  providers: [
    StatusBar,
    SplashScreen,
    FileOpener,
    InAppBrowser,
    TextToSpeech,
    ApiService,
    CodePush,
    {provide: ErrorHandler, useClass: IonicErrorHandler}
  ]
})
export class AppModule {}
