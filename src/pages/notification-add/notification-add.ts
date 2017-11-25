import { Component } from '@angular/core';
import { NavController, NavParams, AlertController} from 'ionic-angular';
import { Server } from '../../providers/server';
import { Http } from '@angular/http';
import { Storage } from '@ionic/storage';

@Component({
  selector: 'page-notification-add',
  templateUrl: 'notification-add.html'
})
export class NotificationAddPage {

  public data_table_car: Array<{}>;
  public data_table_warning: Array<{}>;
  public data_table_phone: Array<{}>;

  public car_id;
  public user_id_send;
  public warning_list_id;

  public phone;
  public phone2;

  public checkphone1;
  public checkphone2;

  public phoneopen;

  public linkPicNoti = this.server.linkServerPicNotification();
  public linkPic = this.server.linkServerPic();
  constructor(public navCtrl: NavController, public navParams: NavParams, public server: Server, public http: Http, public storage: Storage, public alertCtrl: AlertController) {

  }

  ionViewWillEnter() {
    this.setDataUser();
    this.car_id = this.navParams.get('car_id');
    this.load_data();

    this.load_warning();
  }

  setDataUser() {
    //ดึกข้อมูลจาก storage มาแสดง
    this.storage.get('user_data').then((val) => {
      this.user_id_send = val['user_id'];
    });
  }

  public load_data() {
    //กำหนดตัวปรกและค่าภายในเพื่อส่งไปที่เว็บเซอวิส
    var send_data = { 'car_id': this.car_id };

    //ลิงค์ที่ต้องการเรียก
    var link = this.server.linkServer() + "car_service/carDetail/format/json";

    //ทำการส่งข้อมูลไปที่เว็บเซอวิส
    this.http.post(link, send_data)
      .subscribe(response => {
        //หากมีการคืนค่ามาให้ ทำการรับค่าและเก็บไว้

        this.data_table_car = JSON.parse(response["_body"]);

        this.load_user(this.data_table_car[0]['car_user_id']);

      }, error => {
      });
  }

  public load_user(user_id) {
    //กำหนดตัวปรกและค่าภายในเพื่อส่งไปที่เว็บเซอวิส
    var send_data = { 'user_id': user_id };

    //ลิงค์ที่ต้องการเรียก
    var link = this.server.linkServer() + "user_service/selectUser/format/json";

    //ทำการส่งข้อมูลไปที่เว็บเซอวิส
    this.http.post(link, send_data)
      .subscribe(response => {
        //หากมีการคืนค่ามาให้ ทำการรับค่าและเก็บไว้

        this.data_table_phone = JSON.parse(response["_body"]);

        var xxx1 = String(this.data_table_phone[0]['user_phone']);
        var xxx2 = String(this.data_table_phone[0]['user_phone2']);

        this.phoneopen = this.data_table_phone[0]['user_phone_open'];

        console.log('xxx1.length ' + xxx1.length);
        console.log('xxx2.length ' + xxx2.length);

        if (this.data_table_phone[0]['user_phone'] != null) {
          console.log('phone1 !null');
          if (xxx1.length > 0) {
            this.phone = this.data_table_phone[0]['user_phone'];
            this.checkphone1 = 1;
            console.log('checkphone1' + this.checkphone1);
            console.log('phone1' + this.phone);
          }
        }

        if (this.data_table_phone[0]['user_phone2'] != null) {
          console.log('phone2 !null');
          if (xxx2.length > 0) {
            this.phone2 = this.data_table_phone[0]['user_phone2'];
            this.checkphone2 = 1;
            console.log('checkphone2' + this.checkphone2);
            console.log('phone2' + this.phone2);
          }
        }

      }, error => {
      });
  }

  public load_warning() {
    //กำหนดตัวปรกและค่าภายในเพื่อส่งไปที่เว็บเซอวิส
    var send_data = {};

    //ลิงค์ที่ต้องการเรียก
    var link = this.server.linkServer() + "car_service/carWarning/format/json";

    //ทำการส่งข้อมูลไปที่เว็บเซอวิส
    this.http.post(link, send_data)
      .subscribe(response => {
        //หากมีการคืนค่ามาให้ ทำการรับค่าและเก็บไว้

        this.data_table_warning = JSON.parse(response["_body"]);

      }, error => {
      });
  }

  public carConfirmAddWarning(warning_list_id, warning_list_name) {
    let alert = this.alertCtrl.create({
      title: 'ยืนยันการแจ้งเตือน',
      message: warning_list_name,
      buttons: [
        {
          text: 'ยกเลิก',
          role: 'cancel',
          handler: () => {
            console.log('Cancel');
          }
        },
        {
          text: 'ยืนยัน',
          handler: () => {
            console.log('Confirm');
            this.carSendWarning(warning_list_id);
          }
        }

      ]
    });
    alert.present();
    // this.carSendWarning(warning_list_id);
  }

  public carSendWarning(warning_list_id) {
    var send_data = { 'user_id': this.data_table_car[0]['car_user_id'], 'user_id_send': this.user_id_send, 'warning_list_id': warning_list_id, 'car_id': this.car_id };

    //ลิงค์ที่ต้องการเรียก
    var link = this.server.linkServer() + "car_service/carAddWarning/format/json";

    //ทำการส่งข้อมูลไปที่เว็บเซอวิส
    this.http.post(link, send_data)
      .subscribe(response => {
        //หากมีการคืนค่ามาให้ ทำการรับค่าและเก็บไว้

        // this.data_table_warning = JSON.parse(response["_body"]);

        let alert = this.alertCtrl.create({
          // title: 'แจ้งเตือน',
          subTitle: 'แจ้งเตือนสำเร็จ',
          buttons: ['ตกลง']
        });
        alert.present();
        this.navCtrl.pop();
      }, error => {
      });

  }

}
