import { MtMarker } from "./app.component";

import { BrowserModule } from "@angular/platform-browser";
import { ErrorHandler, NgModule, Injector } from "@angular/core";
import { IonicApp, IonicErrorHandler, IonicModule } from "ionic-angular";
import { SplashScreen } from "@ionic-native/splash-screen";
import { StatusBar } from "@ionic-native/status-bar";
import { Device } from "@ionic-native/device";
import { HTTP } from "@ionic-native/http";
import { IndexPage } from "../pages/index/index";
import { ArviewPage } from "../pages/arview/arview";
import { MarkerProvider } from "../providers/markers/markers";
import { HttpClientModule } from '@angular/common/http';

import { ConfigProvider } from "../providers/config/config";
import {
	BackgroundGeolocation
  } from "@ionic-native/background-geolocation";
@NgModule({
  declarations: [MtMarker, IndexPage, ArviewPage],
  imports: [BrowserModule, IonicModule.forRoot(MtMarker),HttpClientModule],
  bootstrap: [IonicApp],
  entryComponents: [MtMarker, IndexPage, ArviewPage],
  providers: [
    StatusBar,
    SplashScreen,
    { provide: ErrorHandler, useClass: IonicErrorHandler },
    Device,
    MarkerProvider,
    ConfigProvider,
	HTTP,
	BackgroundGeolocation
  ]
})
export class AppModule {
  static injector: Injector;
  constructor(injector: Injector) {
    AppModule.injector = injector;
  }
}
