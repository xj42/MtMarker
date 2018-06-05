import { Injectable } from "@angular/core";
import { GPSPoint } from "../../classes/GPSPoint";
import {
  BackgroundGeolocation,
  BackgroundGeolocationConfig,
  BackgroundGeolocationResponse
} from "@ionic-native/background-geolocation";
import { Platform } from "ionic-angular";

/*
  Generated class for the ConfigProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class ConfigProvider {
  /**
   * Device variables
   */
  public location: GPSPoint = GPSPoint.Zero(); // 0,0,0
  public heading: number = 0; // North

  /**
   * Marker variables
   */
  public category: string = "mountains"; // marker type

  /**
   * Label variables
   */
  public label: {
    height: number;
    width: number;
    colour: string;
    bgcolour: string;
    offset: number;
    thickness: number;
  } = {
    height: 40,
    width: 100,
    colour: "white",
    bgcolour: "green",
    offset: -10,
    thickness: 1
  };
  /**
   * Providers
   */
  private GeoConf: BackgroundGeolocationConfig;
  private backgroundGeolocation;

  constructor(private geo: BackgroundGeolocation, private plt: Platform) {
    this.GeoConf = {
      desiredAccuracy: 10,
      stationaryRadius: 20,
      distanceFilter: 30,
      debug: true, //  enable this hear sounds for background-geolocation life-cycle.
      stopOnTerminate: false // enable this to clear background location settings when the app terminates
    };

    // this.backgroundGeolocation
    //   .configure(this.GeoConf)
    //   .subscribe((location: BackgroundGeolocationResponse) => {
    //     console.log(location);

    //     // IMPORTANT:  You must execute the finish method here to inform the native plugin that you're finished,
    //     // and the background-task may be completed.  You must do this regardless if your HTTP request is successful or not.
    //     // IF YOU DON'T, ios will CRASH YOUR APP for spending too much time in the background.
    // 	if (plt.is('ios'))
    // 		this.backgroundGeolocation.finish(); // FOR IOS ONLY
    //   });
  }

  init() {
    // start recording location
    // this.backgroundGeolocation.start();
  }

  DeInit() {
    // If you wish to turn OFF background-tracking, call the #stop method.
    // this.backgroundGeolocation.stop();
  }
}
