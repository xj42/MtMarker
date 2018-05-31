import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';
import { SplashScreen } from '@ionic-native/splash-screen';
import { StatusBar } from '@ionic-native/status-bar';

import { MtMarker } from './app.component';
import { IndexPage } from '../pages/index/index';

@NgModule({
  declarations: [
    MtMarker,
    IndexPage
  ],
  imports: [
    BrowserModule,
    IonicModule.forRoot(MtMarker)
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MtMarker,
    IndexPage
  ],
  providers: [
    StatusBar,
    SplashScreen,
    {provide: ErrorHandler, useClass: IonicErrorHandler}
  ]
})
export class AppModule {}
