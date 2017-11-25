import { Component } from '@angular/core';
import { NavController, NavParams, ModalController, LoadingController, AlertController } from 'ionic-angular';
import { Http } from '@angular/http';
import { Storage } from '@ionic/storage';
import { Server } from '../../providers/server';
import { Md5 } from 'ts-md5/dist/md5';

@Component({
  selector: 'page-profile-edit',
  templateUrl: 'profile-edit.html',
  providers: [Server]
})
export class ProfileEditPage {
  public data_table: Array<{}>;
  public user_fullname;
  public user_email;
  public user_phone;
  public user_phone2;
  public user_id;
  public user_username;
  public user_password;
  public user_photo;
  public user_sex;
  public user_active;
  constructor(public navCtrl: NavController, public navParams: NavParams, public modalCtrl: ModalController, public loadingCtrl: LoadingController, public http: Http, public alertCtrl: AlertController, public storage: Storage, public server: Server) {
    storage.get('user_data').then((val) => {
      this.user_id = val['user_id'];
      this.user_username = val['user_username'];
      this.user_fullname = val['user_fullname'];
      this.user_email = val['user_email'];
      this.user_phone = val['user_phone'];
      this.user_phone2 = val['user_phone2'];
      this.user_photo = val['user_photo'];
      this.user_sex = val['user_sex'];
      this.user_active = val['user_active'];
    });
  }

  // ตรวจสอบข้อมูลว่าครบถ้วนหรือไม่
  Update() {
    if (this.user_fullname == "" || this.user_email == "" || this.user_phone == "" || this.user_password == "" || this.user_sex == "" || this.user_fullname == null || this.user_email == null || this.user_phone == null || this.user_password == null || this.user_sex == null) {
      let alert = this.alertCtrl.create({
        // title: 'แจ้งเตือน',
        subTitle: 'กรุณากรอกข้อมูลให้ครบถ้วน',
        buttons: ['ตกลง']
      });
      alert.present();
    } else {
      this.checkPassword();
    }
  }

  // อัพเดทข้อมูล
  updateUser() {
    var link = this.server.linkServer() + "user_service/updateUser";
    var send_data = { 'user_id': this.user_id, 'user_fullname': this.user_fullname, 'user_email': this.user_email, 'user_phone': this.user_phone, 'user_phone2': this.user_phone2, 'user_sex': this.user_sex };

    // ส่งข้อมูลเพื่ออัพเดทไปที่เว็บเซอวิส
    this.http.post(link, send_data)
      .subscribe(response => {

        var arrUser = {
          user_fullname: this.user_fullname,
          user_email: this.user_email,
          user_id: this.user_id,
          user_username: this.user_username,
          user_phone: this.user_phone,
          user_phone2: this.user_phone2,
          user_photo: this.user_photo,
          user_sex: this.user_sex,
          user_active: this.user_active
        }

        //บันทึกข้อมูลที่อัพเดทแล้วไว้ใน storage
        this.storage.set('user_data', arrUser).then((val) => {
          this.navCtrl.pop();
        });

      }, error => { });
  }

  // ตรวจสอบความถูกต้องของ password ที่ระบุ ว่าตรงกับ password ของ user หรือไม่
  checkPassword() {
    // รับค่าไว้ในตัวแปร
    var send_data = { 'user_username': this.user_username, 'user_password': Md5.hashStr(this.user_password) };
    var link = this.server.linkServer() + "user_service/CheckLogin/format/json";

    //ส่งข้อมูลไปตรวจสอบที่เว็บเซอวิส
    this.http.post(link, send_data)
      .subscribe(response => {

        this.data_table = JSON.parse(response["_body"]);

        // ตรวจสอบว่ามีข้อมูลหรือไม่
        if (this.data_table.length > 0) {
          this.updateUser();
        } else {
          let alert = this.alertCtrl.create({
            //title: 'แจ้งเตือน',
            subTitle: 'Password ไม่ถูกต้อง',
            buttons: ['ตกลง']
          });
          alert.present();
        }
      }, error => {
      });
  }
}
