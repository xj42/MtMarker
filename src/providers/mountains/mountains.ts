import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Mountain } from "../../classes/Mountain";

/*
  Generated class for the MountainsProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class MountainsProvider {
  public mountains: Mountain[] = [];
  constructor(public http: HttpClient) {}

  update() {}


}
