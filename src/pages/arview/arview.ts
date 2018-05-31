import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

import { Game } from '../../classes/Game';

/**
 * Generated class for the ArviewPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
    selector: 'page-arview',
    templateUrl: 'arview.html',
})

export class ArviewPage {
    private _game;
    constructor(public navCtrl: NavController, public navParams: NavParams) {

    }

    ionViewDidLoad() {
        this._game = new Game('renderCanvas');
        let firstScene = this._game.addScene(this._game.createScene()) - 1;
        this._game.addMiniMap(this._game.getScene(firstScene));
        this._game.animateScene(firstScene);
    }

}
