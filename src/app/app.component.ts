import { Component, ViewChild } from '@angular/core';
import { App, Platform, Nav, AlertController } from 'ionic-angular';
import { StatusBar, Splashscreen} from 'ionic-native';
import { OneSignal } from '@ionic-native/onesignal';
import { LoginPage } from '../pages/login/login';
import { TabsPage } from '../pages/tabs/tabs';
import { Storage } from '@ionic/storage';
import { Server } from '../providers/server';
import { Http } from '@angular/http';

// import {Observable} from 'rxjs/Observable';
import 'rxjs/add/observable/fromEvent';

@Component({
  template: `<ion-nav [root]="rootPage"></ion-nav>`,
  providers: [Server]
})
export class MyApp {
  @ViewChild(Nav) nav: Nav;

  public rootPage: any;
  public data_table_province: Array<{}>;
  constructor(private _OneSignal: OneSignal, public platform: Platform, public alertCtrl: AlertController, public storage: Storage, public app: App, public http: Http, public server: Server) {

    // var offline = Observable.fromEvent(document, "offline");
    // var online = Observable.fromEvent(document, "online");
    //
    // offline.subscribe(() => {
    //   let alert = alertCtrl.create({
    //     // title: "Connection",
    //     message: "ไม่สามารถเชื่อมต่อกับระบบได้",
    //     buttons: ['ตกลง']
    //   });
    //   alert.present();
    //   // this.exitApp()
    // });
    //
    // online.subscribe(() => {
    //   let alert = alertCtrl.create({
    //     // title: "Connection",
    //     message: "เชื่อมต่อกับระบบแล้ว",
    //     buttons: ['ตกลง']
    //   });
    //   alert.present();
    // });

    storage.get('user_data').then((val) => {
      if (val == null) {
        this.rootPage = LoginPage;
      } else {
        this.rootPage = TabsPage;
      }
    });

    platform.ready().then(() => {
      // this.checkNetwork();
      this.platform.registerBackButtonAction(() => {
        // navigator['app'].exitApp();
        this.exit();
      });

      StatusBar.styleDefault();
      // StatusBar.styleLightContent();
      Splashscreen.hide();

      this.initializeApp();

    });
  }

  exit() {
    let alert = this.alertCtrl.create({
      // title: 'Confirm',
      message: 'ออกจากแอพ',
      buttons: [{
        text: "ออก",
        handler: () => { this.exitApp() }
      }, {
          text: "ยกเลิก",
          role: 'cancel'
        }]
    })
    alert.present();
  }
  exitApp() {
    this.platform.exitApp();
  }


  initializeApp() {
    // this.platform.ready().then(() => {

    this._OneSignal.startInit('6ac42896-75e0-44a6-800e-18ace3d1ffde', '141918096663');
    // this._OneSignal.inFocusDisplaying(this._OneSignal.OSInFocusDisplayOption.InAppAlert);
    this._OneSignal.inFocusDisplaying(this._OneSignal.OSInFocusDisplayOption.InAppAlert);
    this._OneSignal.enableVibrate(true);
    this._OneSignal.enableSound(true);
    this._OneSignal.setSubscription(true);
    this._OneSignal.getIds()
      .then((ids) => {
        // this.deviceId = JSON.stringify(ids);
        console.log('getIds: ' + JSON.stringify(ids));
      });
    this._OneSignal.handleNotificationReceived().subscribe(() => {
      // handle received here how you wish.
      this.server.notiVibration([5000, 2000, 5000, 2000, 5000, 2000, 5000, 2000, 5000, 2000, 5000]);
    });
    this._OneSignal.handleNotificationOpened().subscribe(() => {
      // handle opened here how you wish.
      // Vibration.vibrate([0, 0, 0, 0, 0]);
    });
    this._OneSignal.endInit();
    // })
  }

}
