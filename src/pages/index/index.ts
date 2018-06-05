import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { ArviewPage } from '../arview/arview';
@Component({
  selector: 'page-index',
  templateUrl: 'index.html'
})
export class IndexPage {

  constructor(public navCtrl: NavController) {
  }

  openARView() {
    this.navCtrl.push(ArviewPage);
  }
}
