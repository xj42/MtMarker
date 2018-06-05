import { Injectable } from "@angular/core";
import { HTTP } from "@ionic-native/http";
import { Marker } from "../../classes/Marker";
import { ConfigProvider } from "../config/config";
import { Observable } from "rxjs/Observable";
import { HttpClient } from "@angular/common/http";

/*
  Generated class for the MountainsProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/

@Injectable()
export class MarkerProvider {
  public locationMarkers: Marker[] = [];
  mtn: Observable<any>;
  constructor(
    public http: HTTP,
    private conf: ConfigProvider,
    public httpClient: HttpClient
  ) {
    this.update();
  }

  update() {
    this.http
      .get(
        "http://demo.wise-p.co.jp/drewbell/pos.json?" + this.conf.category,
        {},
        {}
      )
      .then(data => {
        for (var i in data) {
          this.locationMarkers.push(
            new Marker(data[i])
          );
          console.log(data[i]);
        }
      })
      .catch(error => {
        console.log(error);
      });

    return this.httpClient.get(
      "http://demo.wise-p.co.jp/drewbell/mountains.json"
    );
  }
}
