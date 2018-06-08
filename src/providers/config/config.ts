import { Injectable } from "@angular/core";
import { GPSPoint } from "../../classes/GPSPoint";

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
    public location: GPSPoint;
    public heading: number; // North

    /**
     * Marker variables
     */
    public category: string;

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
    };

    constructor() {
        this.init();
    }

    init() {
        this.category = "mountains"; // category
        this.location = GPSPoint.Zero(); // 0,0,0
        this.heading = 0; // North
        this.label = { // label style
            height: 40,
            width: 100,
            colour: "white",
            bgcolour: "green",
            offset: -10,
            thickness: 1
        };
    }

}
