import { Component } from "@angular/core";
import { IonicPage, NavController, NavParams } from "ionic-angular";
import { Device } from "@ionic-native/device";
import { ScreenOrientation } from "@ionic-native/screen-orientation";

import { VDome } from "../../classes/VideoDome";
import { MarkerProvider } from "../../providers/markers/markers";
import { Marker } from "../../classes/Marker";
import { Platform } from "ionic-angular";

/**
 * Generated class for the Video360Page page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: "page-video360",
  templateUrl: "video360.html"
})
export class Video360Page {
	private _game;

	constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public mnt: MarkerProvider,
    private device: Device,
    private screenOrientation: ScreenOrientation,
    private platform: Platform
  ) {
    platform.registerBackButtonAction(() => {
      this.back();
    }, 1);
  }

  ionViewWillEnter() {
    if (
      this.device.platform &&
      this.device.platform.toLowerCase() != "browser"
    ) {
      this.screenOrientation.unlock();
      this.screenOrientation.lock(
        this.screenOrientation.ORIENTATIONS.LANDSCAPE
      );
    }
  }
  ionViewWillLeave(){
	this._game.stop();
	delete this._game;
	console.log("deleted");
}
  ionViewDidLoad() {
    this._game = new VDome("renderCanvas");
	let firstScene = this._game.addScene(this._game.createScene()) - 1;
	this._game.videoDome(firstScene);
    this._game.animateScene(firstScene);
  }

  // Add markers from server
  addMarkers(): void {
    //   this.mnt.update().subscribe(data => {
    // this._mountains = [];
    // for (var i in data) {
    //   let m = new Marker(data[i]);

    //   this._mountains.push(m);
    // }

    // this._game.getMarkers().forEach(i => {
    //   i.addLabel(this._game.getGUI(),this.onMarkerClick);
    // });
    // });
    this._game.addMarkers(this._game.getScene(0));
  }

  restart() {
    if (
      this.device.platform &&
      this.device.platform.toLowerCase() != "browser"
    ) {
      this.screenOrientation.unlock();
      this.screenOrientation.lock(this.screenOrientation.ORIENTATIONS.PORTRAIT);
    }
    this.navCtrl.popTo(this.navCtrl.getByIndex(1));
  }

  back() {
    if (
      this.device.platform &&
      this.device.platform.toLowerCase() != "browser"
    ) {
      this.screenOrientation.unlock();
      this.screenOrientation.lock(this.screenOrientation.ORIENTATIONS.PORTRAIT);
    }
    this.navCtrl.pop();
  }
  // Callback for button click on markers
  onMarkerClick(data: Marker): void {
    console.log(data);
  }
}
