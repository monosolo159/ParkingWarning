import { Component } from '@angular/core';
import { NavController, NavParams, ModalController, LoadingController, AlertController } from 'ionic-angular';
import { RegisterPage } from '../register/register';
import { ForgotPasswordPage } from '../forgot-password/forgot-password';
import { TabsPage } from '../tabs/tabs';
import { Http } from '@angular/http';
import { Storage } from '@ionic/storage';
import { Server } from '../../providers/server';
import { Md5 } from 'ts-md5/dist/md5';
import { OneSignal } from '@ionic-native/onesignal';

@Component({
  selector: 'page-login',
  templateUrl: 'login.html',
  providers: [Server]
})
export class LoginPage {
  public data_table: Array<{}>;
  public user_device_id;
  // public test;
  public user_username;
  public user_password;

  constructor(private _OneSignal: OneSignal, public navCtrl: NavController, public navParams: NavParams, public modalCtrl: ModalController, public loadingCtrl: LoadingController, public http: Http, public alertCtrl: AlertController, public storage: Storage, public server: Server) {
    this._OneSignal.getIds()
      .then((ids) => {
        this.user_device_id = JSON.parse(JSON.stringify(ids));
      });

    this.storage.get('user_data').then((val) => {
      //ถ้ามีข้อมูลให้ไปที่หน้า tabs
      if (val != null) {
        this.navCtrl.push(TabsPage, {});
      }

    });
  }


  register() {
    this.navCtrl.push(RegisterPage, {});
  }

  forgotPassword() {
    this.navCtrl.push(ForgotPasswordPage, {});
  }


  //เข้าสู่ระบบ
  login() {
    //เช็คช่องว่างของข้อมูลใน textfield
    if (this.user_username == "" || this.user_password == "" || this.user_username == null || this.user_password == null) {
      let alert = this.alertCtrl.create({
        // title: 'แจ้งเตือน',
        subTitle: 'กรุณากรอกข้อมูลให้ครถ้วน',
        buttons: ['ตกลง']
      });
      alert.present();
    } else {

      let loading_popup = this.loadingCtrl.create({
        // content: 'เข้าสู่ระบบ...'
      });
      loading_popup.present();

      //รับข้อมู,จาก textfield
      var send_data = { 'user_username': this.user_username, 'user_password': Md5.hashStr(this.user_password) };
      var link = this.server.linkServer() + "user_service/CheckLogin/format/json";

      //ส่งข้อมูลไปที่เว็บเวอวิส เพื่อตรวจสอบข้อมูล
      this.http.post(link, send_data)
        .subscribe(response => {
          loading_popup.dismiss();

          //รับข้อมูลใส่ไว้ในตัวแปร
          this.data_table = JSON.parse(response["_body"]);

          //เช็คว่ามีข้อมูลหรือไม่
          if (this.data_table.length > 0) {

            var send_data = { 'user_id': this.data_table[0]['user_id'], 'user_device_id': this.user_device_id['userId'] };
            var link = this.server.linkServer() + "user_service/updateUser";
            this.http.post(link, send_data).subscribe(response => { }, error => { });

            var arrUser = {
              user_id: this.data_table[0]['user_id'],
              user_fullname: this.data_table[0]['user_fullname'],
              user_email: this.data_table[0]['user_email'],
              user_username: this.data_table[0]['user_username'],
              user_phone: this.data_table[0]['user_phone'],
              user_phone2: this.data_table[0]['user_phone2'],
              user_phone_open: this.data_table[0]['user_phone_open'],
              user_photo: this.data_table[0]['user_photo'],
              user_sex: this.data_table[0]['user_sex'],
              user_active: this.data_table[0]['user_active']
            }

            //บันทึกข้อมูลที่ได้มาไว้ใน storage ของเครื่อง
            this.storage.set('user_data', arrUser).then((val) => {
              this.navCtrl.push(TabsPage, {});
            });


          } else {
            let alert = this.alertCtrl.create({
              //title: 'แจ้งเตือน',
              subTitle: 'Username/Password ไม่ถูกต้อง',
              buttons: ['ตกลง']
            });
            alert.present();
          }
        }, error => {
        });
    }
  }
}
