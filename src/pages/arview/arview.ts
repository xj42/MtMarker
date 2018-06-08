import { Component } from "@angular/core";
import { IonicPage, NavController, NavParams } from "ionic-angular";

import { Game } from "../../classes/Game";
import { MarkerProvider } from "../../providers/markers/markers";
import { Marker } from "../../classes/Marker";
import { Platform } from "ionic-angular";

import { Device } from "@ionic-native/device";
import { ScreenOrientation } from "@ionic-native/screen-orientation";

/**
 * Generated class for the ArviewPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: "page-arview",
  templateUrl: "arview.html"
})

export class ArviewPage {
  private _game;
  private _mountains;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
	public mnt: MarkerProvider,
	private device: Device,
    private screenOrientation: ScreenOrientation,
    private platform: Platform
  ) {}

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
    this._game = new Game("renderCanvas");
    let firstScene = this._game.addScene(this._game.createScene()) - 1;
    this._game.addMiniMap(this._game.getScene(firstScene));
    this._game.addGUI();
    this.addMarkers();
    this._game.animateScene(firstScene);
  }

  // Add markers from server
  addMarkers():void {
    this.mnt.update().subscribe(data => {
      this._mountains = [];
      for (var i in data) {
        let m = new Marker(data[i]);

        this._mountains.push(m);
	  }

	  this._game.addMarkers(this._mountains, this._game.getScene(0));

      this._game.getMarkers().forEach(i => {
        i.addLabel(this._game.getGUI(),this.onMarkerClick);
      });
    });
  }

  refresh(){

  }

  // Callback for button click on markers
  onMarkerClick(data:Marker):void {
	console.log(data);
  }
}
