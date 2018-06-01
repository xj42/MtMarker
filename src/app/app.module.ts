import { MtMarker } from './app.component';

import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule, Injector } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';
import { SplashScreen } from '@ionic-native/splash-screen';
import { StatusBar } from '@ionic-native/status-bar';
import { Device } from '@ionic-native/device';

import { IndexPage } from '../pages/index/index';
import { ArviewPage } from '../pages/arview/arview';
import { MountainsProvider } from '../providers/mountains/mountains';
import { ConfigProvider } from '../providers/config/config';

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
    { provide: ErrorHandler, useClass: IonicErrorHandler },
    Device,
    MountainsProvider,
    ConfigProvider
  ]
})
export class AppModule {
  static injector: Injector;
  constructor(injector: Injector) {
    AppModule.injector = injector;
  }
}
