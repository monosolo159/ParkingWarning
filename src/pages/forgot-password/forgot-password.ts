import { Component } from '@angular/core';
import {NavController, NavParams, ModalController, LoadingController, AlertController } from 'ionic-angular';
import { Server } from '../../providers/server';
import { Http } from '@angular/http';


@Component({
  selector: 'page-forgot-password',
  templateUrl: 'forgot-password.html'
})
export class ForgotPasswordPage {
  public user_email;
  public data_table_user: Array<{}>;
  public data_table: Array<{}>;

  constructor(public navCtrl: NavController, public navParams: NavParams, public modalCtrl: ModalController, public http: Http, public loadingCtrl: LoadingController, public server: Server, public alertCtrl: AlertController) { }

  //ขอรหัสผ่านใหม่
  forgotPassword() {
    if (this.user_email == '' || this.user_email == null) {
      let alert = this.alertCtrl.create({
        subTitle: 'กรุณากรอกข้อมูลให้ครบถ้วน'
      });
      alert.present();
    } else {
      this.checkEmail();

    }
  }

  checkEmail() {
    let loading_popup = this.loadingCtrl.create({
      // content: 'เข้าสู่ระบบ...'
    });
    loading_popup.present();

    //รับข้อมู,จาก textfield
    var send_data = { 'user_email': this.user_email };
    var link = this.server.linkServer() + "user_service/CheckRegis/format/json";

    //ส่งข้อมูลไปที่เว็บเวอวิส เพื่อตรวจสอบข้อมูล
    this.http.post(link, send_data)
      .subscribe(response => {
        loading_popup.dismiss();

        this.data_table_user = JSON.parse(response["_body"]);

        //เช็คว่ามีข้อมูลหรือไม่
        if (this.data_table_user.length > 0) {

          this.sendPassword(this.data_table_user);

        } else {
          let alert = this.alertCtrl.create({
            //title: 'แจ้งเตือน',
            subTitle: 'อีเมลไม่ถูกต้อง',
            buttons: ['ตกลง']
          });
          alert.present();
        }


      }, error => {
      });
  }

  sendPassword(data_table) {
    let loading_popup = this.loadingCtrl.create({
      // content: 'เข้าสู่ระบบ...'
    });
    loading_popup.present();

    //รับข้อมู,จาก textfield
    var send_data = { 'user_id': data_table[0]['user_id'], 'user_email': data_table[0]['user_email'], 'user_username': data_table[0]['user_username'], 'user_fullname': data_table[0]['user_fullname'] };
    var link = this.server.linkServer() + "user_service/forgotPassword/format/json";


    //ส่งข้อมูลไปที่เว็บเวอวิส เพื่อตรวจสอบข้อมูล
    this.http.post(link, send_data)
      .subscribe(response => {
        loading_popup.dismiss();

        this.data_table = JSON.parse(response["_body"]);

        //เช็คว่ามีข้อมูลหรือไม่
        if (this.data_table.length > 0) {

          let alert = this.alertCtrl.create({
            subTitle: 'ระบบส่งรหัสใหม่ให้ท่านแล้ว โปรดตรวจสอบอีเมลของท่าน'
          });
          alert.present();
          this.navCtrl.pop();
        } else {
          let alert = this.alertCtrl.create({
            //title: 'แจ้งเตือน',
            subTitle: 'เกิดข้อผิดพลาด ไม่สามารถขอรหัสผ่านใหม่ได้',
            buttons: ['ตกลง']
          });
          alert.present();
        }

      }, error => {
      });
  }

}
