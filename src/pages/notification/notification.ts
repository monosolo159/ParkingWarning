import { Component, ViewChild } from '@angular/core';
import { NavController, ModalController, AlertController, Platform} from 'ionic-angular';
import { NotificationAddPage } from '../notification-add/notification-add';
import { NotificationCorrectPage } from '../notification-correct/notification-correct';
import { Searchbar } from 'ionic-angular';
import { Http } from '@angular/http';
import { Server } from '../../providers/server';
import { Storage } from '@ionic/storage';
import { Observable } from 'rxjs/Rx';
import { OneSignal } from '@ionic-native/onesignal';

// import { Vibration} from 'ionic-native';


@Component({
  selector: 'page-notification',
  templateUrl: 'notification.html',
  providers: [Server]

})
export class NotificationPage {
  // public today: Array<{}>;
  @ViewChild('mainSearchbar') searchbar: Searchbar;
  notification: string = "Search";
  public data_table_province: Array<{}>;
  public data_table_car: Array<{}>;
  public data_table_notification: Array<{}>;

  public linkPic = this.server.linkServerPic();
  public linkPicNoti = this.server.linkServerPicNotification();

  public selectables;
  public car_license_plate = '';
  public car_province;
  public user_id;
  public countBadge = 0;
  constructor(public platform: Platform, private _OneSignal: OneSignal, public navCtrl: NavController, public modalCtrl: ModalController, public server: Server, public http: Http, public storage: Storage, public alertCtrl: AlertController) {
    Observable.interval(1000).subscribe(res => {
      this.getNotification();
    });
  }

  ionViewWillEnter() {
    this.setDataUser();
    // this.countBadges();
  }

  public countBadges() {
    this.countBadge = 0;
    for (var i = 0; i < this.data_table_notification.length; i++) {
      if (this.data_table_notification[i]['notification_status'] == 0) {
        this.countBadge++;
      }
    }
  }

  public activeNotification(notification_id) {

    console.log(notification_id);

    this.server.notiVibration(0);
    // this.server.notiSoundVibration(false);
    this.navCtrl.push(NotificationCorrectPage, { 'notification_id': notification_id });

  }

  setDataUser() {
    //ดึกข้อมูลจาก storage มาแสดง
    this.storage.get('user_data').then((val) => {
      this.user_id = val['user_id'];
      this.getNotification();
      this.getProvince();
      this.car_province = 0;
    });
  }

  public getNotification() {
    var send_data = { 'user_id': this.user_id };
    var link = this.server.linkServer() + "/car_service/carMyWarning/format/json";

    this.http.post(link, send_data)
      .subscribe(response => {
        //หากมีข้อมู,ส่งคืนกลับมาให้ใส่ตัวแปรไว้
        this.data_table_notification = JSON.parse(response["_body"]);

        this.countBadges();
      }, error => {
      });
  }

  public getProvince() {
    var send_data = {};
    var link = this.server.linkServer() + "car_service/carProvince/format/json";

    this.http.post(link, send_data)
      .subscribe(response => {
        //หากมีข้อมู,ส่งคืนกลับมาให้ใส่ตัวแปรไว้
        this.data_table_province = JSON.parse(response["_body"]);
      }, error => {
      });
  }

  addNotification(car_id, car_user_id) {

    if (car_user_id == this.user_id) {
      let alert = this.alertCtrl.create({
        // title: 'แจ้งเตือน',
        subTitle: 'ไม่สามารถแจ้งเตือนรถของท่านเอง',
        buttons: ['ตกลง']
      });
      alert.present();
    } else {
      this.navCtrl.push(NotificationAddPage, { 'car_id': car_id });
    }

  }

  public getSearchCar() {
    this.car_license_plate = this.car_license_plate.replace(/\s/g, '');
    var send_data = { 'car_license_plate': this.car_license_plate, 'car_province': this.car_province };
    var link = this.server.linkServer() + "car_service/searchCar/format/json";

    this.http.post(link, send_data)
      .subscribe(response => {
        //หากมีข้อมู,ส่งคืนกลับมาให้ใส่ตัวแปรไว้
        this.data_table_car = JSON.parse(response["_body"]);

        if (this.data_table_car.length < 1) {
          let alert = this.alertCtrl.create({
            // title: 'แจ้งเตือน',
            subTitle: 'ไม่พบป้ายทะเบียนที่ระบุ',
            buttons: ['ตกลง']
          });
          alert.present();
        }
      }, error => {
      });
  }
}
