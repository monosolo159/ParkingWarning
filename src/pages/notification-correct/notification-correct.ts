import { Component } from '@angular/core';
import { NavController, NavParams, AlertController} from 'ionic-angular';
import { Server } from '../../providers/server';
import { Http } from '@angular/http';
import { Storage } from '@ionic/storage';

@Component({
  selector: 'page-notification-correct',
  templateUrl: 'notification-correct.html'
})
export class NotificationCorrectPage {

  public data_table_warning: Array<{}>;

  public notification_id;

  public warning_list_id;

  public notification_date_correct;

  public user_id_send;
  // public notification_date_correct_check;

  constructor(public navCtrl: NavController, public navParams: NavParams, public server: Server, public http: Http, public storage: Storage, public alertCtrl: AlertController) {
    // this.notification_date_correct = new Date().toISOString();
  }

  ionViewWillEnter() {

    this.notification_id = this.navParams.get('notification_id');
    console.log('notification_id correct ' + this.notification_id);
    this.load_warning();
  }


  public load_warning() {
    //กำหนดตัวปรกและค่าภายในเพื่อส่งไปที่เว็บเซอวิส
    var send_data = { 'notification_id': this.notification_id };

    //ลิงค์ที่ต้องการเรียก
    var link = this.server.linkServer() + "car_service/carWarning/format/json";

    //ทำการส่งข้อมูลไปที่เว็บเซอวิส
    this.http.post(link, send_data)
      .subscribe(response => {
        //หากมีการคืนค่ามาให้ ทำการรับค่าและเก็บไว้

        this.data_table_warning = JSON.parse(response["_body"]);

        // this.notification_date_correct_check = this.data_table_warning[0]['notification_date_correct'];
      }, error => {
      });
  }

  public carActiveWarning() {
    let alert = this.alertCtrl.create({
      title: 'ยืนยันการแจ้งเตือน',
      // message: warning_list_name,
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
            this.carSendActiveWarning();
          }
        }

      ]
    });
    alert.present();
    // this.carSendWarning(warning_list_id);
  }

  public carSendActiveWarning() {
    var send_data = { 'notification_id': this.notification_id, 'notification_date_correct': this.notification_date_correct };

    //ลิงค์ที่ต้องการเรียก
    var link = this.server.linkServer() + "car_service/carUpdateWarning/format/json";

    //ทำการส่งข้อมูลไปที่เว็บเซอวิส
    this.http.post(link, send_data)
      .subscribe(response => {
        // หากมีการคืนค่ามาให้ ทำการรับค่าและเก็บไว้
        // let alert = this.alertCtrl.create({
        //   // title: 'แจ้งเตือน',
        //   subTitle: 'แจ้งเตือนสำเร็จ',
        //   // buttons: ['ตกลง']
        // });
        // alert.present();
        this.navCtrl.pop();
      }, error => {
      });
  }

}
