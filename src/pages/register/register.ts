import { Component } from '@angular/core';
import { NavController, NavParams, ModalController, LoadingController, AlertController } from 'ionic-angular';
import { LoginPage } from '../login/login';
import { Http } from '@angular/http';
import { Server } from '../../providers/server';
import { Md5 } from 'ts-md5/dist/md5';

@Component({
  selector: 'page-register',
  templateUrl: 'register.html',
  providers: [Server]
})
export class RegisterPage {
  public data_table: Array<{}>;
  public user_fullname;
  public user_email;
  public user_password;
  public user_phone;
  public user_sex;
  constructor(public navCtrl: NavController, public navParams: NavParams, public modalCtrl: ModalController, public loadingCtrl: LoadingController, public http: Http, public alertCtrl: AlertController, public server: Server) { }

  ionViewWillEnter() {
    this.user_sex = -1;
  }

  // ตรวจสอบความว่างเปล่าของข้อมูล
  Register() {
    if (this.user_fullname == "" || this.user_email == "" || this.user_password == "" || this.user_phone == "" || this.user_fullname == null || this.user_email == null || this.user_password == null || this.user_phone == null || this.user_sex == -1) {
      let alert = this.alertCtrl.create({
        subTitle: 'กรุณากรอกข้อมูลให้ครบท้วน'
      });
      alert.present();
    } else {
      if (this.user_password.length >= 8) {
        this.checkRegis();
      } else {
        let alert = this.alertCtrl.create({
          subTitle: 'รหัสผ่านต้องมีมากกว่า 8 ตัวอักษร',
          buttons: ['ตกลง']
        });
        alert.present();
      }
    }
  }

  // เช็คว่ามี user นี้ในระบบหรือยัง
  checkRegis() {
    let loading_popup = this.loadingCtrl.create({
      // content: 'ระบบกำลังตรวจสอบ...'
    });
    loading_popup.present();

    var link = this.server.linkServer() + "user_service/CheckRegis/format/json";


    var send_data = { 'user_email': this.user_email };

    // ส่งข้อมูลไปตรวจสอบที่เว็บเซอวิส
    this.http.post(link, send_data)
      .subscribe(response => {

        loading_popup.dismiss();

        //รับข้อมูลไว้ที่ตัวแปร
        this.data_table = JSON.parse(response["_body"]);

        // เช็คว่ามีข้อมูลหรือไม่
        if (this.data_table.length > 0) {
          let alert = this.alertCtrl.create({
            subTitle: 'อีเมลนี้ถูกใช้งานแล้ว',
            buttons: ['ตกลง']
          });
          alert.present();
        } else {

          this.RegisterFormServer();

        }

      }, error => {

      });
  }

  //บันทึกข้อมูล โดยส่งไปบันทึกที่เว็บเซอวิส
  RegisterFormServer() {
    var link = this.server.linkServer() + "user_service/Register";
    var send_data = { 'user_fullname': this.user_fullname, 'user_email': this.user_email, 'user_username': this.user_email, 'user_password': Md5.hashStr(this.user_password), 'user_phone': this.user_phone, 'user_sex': this.user_sex };
    this.http.post(link, send_data)
      .subscribe(response => {

        let alert = this.alertCtrl.create({
          subTitle: 'สมัครสมาชิกสำเร็จ โปรดยืนยันตัวตนผ่านอีเมลของท่าน',
          buttons: ['ตกลง']
        });
        alert.present();

        this.navCtrl.push(LoginPage, {});
      }, error => { });
  }
}
