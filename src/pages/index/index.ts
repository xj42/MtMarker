import { Component } from "@angular/core";
import { NavController } from "ionic-angular";
import { ArviewPage } from "../arview/arview";
import { VrviewPage } from "../vrview/vrview";
import { Video360Page } from "../video360/video360";
import { AboutPage } from "../about/about";

@Component({
  selector: "page-index",
  templateUrl: "index.html"
})

export class IndexPage {
  constructor(public navCtrl: NavController) {}

  openAbout() {
    this.navCtrl.push(AboutPage);
  }

  openARView() {
    this.navCtrl.push(ArviewPage);
  }

  openVRView() {
    this.navCtrl.push(VrviewPage);
  }

  open360View() {
    this.navCtrl.push(Video360Page);
  }
}
