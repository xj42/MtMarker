import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';
import { SplashScreen } from '@ionic-native/splash-screen';
import { StatusBar } from '@ionic-native/status-bar';

import { MtMarker } from './app.component';
import { IndexPage } from '../pages/index/index';
import { ArviewPage } from '../pages/arview/arview';
import { BabylonjsProvider } from '../providers/babylonjs/babylonjs';

@NgModule({
  declarations: [
    MtMarker,
    IndexPage,
    ArviewPage
  ],
  imports: [
    BrowserModule,
    IonicModule.forRoot(MtMarker)
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MtMarker,
    IndexPage,
    ArviewPage
  ],
  providers: [
    StatusBar,
    SplashScreen,
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    BabylonjsProvider
  ]
})
export class AppModule {}
