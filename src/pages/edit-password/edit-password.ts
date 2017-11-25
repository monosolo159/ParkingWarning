import { Component } from '@angular/core';
import { App, NavController, NavParams, AlertController } from 'ionic-angular';
import { Http } from '@angular/http';
import { Storage } from '@ionic/storage';
import { LoginPage } from '../login/login';
import { Server } from '../../providers/server';
import { Md5 } from 'ts-md5/dist/md5';

@Component({
  selector: 'page-edit-password',
  templateUrl: 'edit-password.html',
  providers: [Server]
})
export class EditPasswordPage {
  public data_table: Array<{}>;
  public user_username;
  public user_password;
  public user_password_confirm;
  public user_id;
  constructor(public navCtrl: NavController, public navParams: NavParams, public http: Http, public alertCtrl: AlertController, public storage: Storage, public app: App, public server: Server) { }

  //ทำงานทุกครั้งที่เปิดหน้านี้
  ionViewWillEnter() {
    this.storage.get('user_data').then((val) => {
      this.user_id = val['user_id'];
    });
  }

  //ตรวจสอบข้อมู,ก่อนการอัพเดทรหัสผ่านใหม่
  changePassword() {
    if (this.user_username == '' || this.user_password == '' || this.user_password_confirm == '' || this.user_username == null || this.user_password == null || this.user_password_confirm == null) {
      let alert = this.alertCtrl.create({
        // title: 'แจ้งเตือน',
        subTitle: 'กรุณากรอกข้อมูลให้ครบท้วน',
        buttons: ['ตกลง']
      });
      alert.present();
    } else {

      if (this.user_password.length >= 8 && this.user_password_confirm.length >= 8) {
        if (this.user_password == this.user_password_confirm) {
          this.checkUser();
        } else {
          let alert = this.alertCtrl.create({
            // title: 'แจ้งเตือน',
            subTitle: 'Password ไม่ตรงกัน',
            buttons: ['ตกลง']
          });
          alert.present();
        }
      } else {
        let alert = this.alertCtrl.create({
          subTitle: 'รหัสผ่านต้องมีมากกว่า 8 ตัวอักษร',
          buttons: ['ตกลง']
        });
        alert.present();
      }


    }
  }

  //ตรวจสอบ username และ id ว่ามีหรือไม่
  checkUser() {
    var send_data = { 'user_id': this.user_id, 'user_username': this.user_username };
    var link = this.server.linkServer() + "user_service/CheckUser/format/json";

    this.http.post(link, send_data)
      .subscribe(response => {


        this.data_table = JSON.parse(response["_body"]);

        //เช็คว่ามีข้อมูลหรือไม่
        if (this.data_table.length > 0) {
          this.updatePassword();
        } else {
          let alert = this.alertCtrl.create({
            //title: 'แจ้งเตือน',
            subTitle: 'Username ไม่ถูกต้อง',
            buttons: ['ตกลง']
          });
          alert.present();
        }
      }, error => {
      });
  }

  //บันทึกรหัสผ่านใหม่ และ logout ออกอัตโนมัติ
  updatePassword() {
    var send_data = { 'user_id': this.user_id, 'user_password': Md5.hashStr(this.user_password) };
    var link = this.server.linkServer() + "user_service/updatePassword";

    this.http.post(link, send_data)
      .subscribe(response => {
        this.storage.remove('user_data').then((val) => {
          let navCtrl = this.app.getRootNav();
          navCtrl.setRoot(LoginPage);
        });
      }, error => {
      });

  }
}
