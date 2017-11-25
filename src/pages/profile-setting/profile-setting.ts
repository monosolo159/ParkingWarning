import { Component } from '@angular/core';
import { NavController, NavParams, ModalController, LoadingController, AlertController } from 'ionic-angular';
import { Http } from '@angular/http';
import { Storage } from '@ionic/storage';
import { Server } from '../../providers/server';

@Component({
  selector: 'page-profile-setting',
  templateUrl: 'profile-setting.html',
  providers: [Server]
})
export class ProfileSettingPage {

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

  public user_phone_open;
  public telPhone;
  constructor(public navCtrl: NavController, public navParams: NavParams, public modalCtrl: ModalController, public loadingCtrl: LoadingController, public http: Http, public alertCtrl: AlertController, public storage: Storage, public server: Server) {

    this.user_id = this.navParams.get('user_id');
    this.reload_user();

  }

  updateItem(item) {
    var newitem;
    if (item.checked == true) {
      newitem = 1;
    } else if (item.checked == false) {
      newitem = 0;
    }
    this.updateUser(newitem);

  }

  updateUser(item) {
    var link = this.server.linkServer() + "user_service/updateUser";
    var send_data = { 'user_id': this.user_id, 'user_phone_open': item };
    // ส่งข้อมูลเพื่ออัพเดทไปที่เว็บเซอวิส
    this.http.post(link, send_data)
      .subscribe(response => {
        var arrUser = {
          user_id: this.user_id,
          user_fullname: this.user_fullname,
          user_email: this.user_email,
          user_username: this.user_username,
          user_phone: this.user_phone,
          user_phone2: this.user_phone2,
          user_phone_open: this.user_phone_open,
          user_photo: this.user_photo,
          user_sex: this.user_sex,
          user_active: this.user_active
        }
        this.storage.set('user_data', arrUser).then((val) => { });
      }, error => { });
    // console.log('updateUser');
  }

  reload_user() {
    //เช็คช่องว่างของข้อมูลใน textfield

    //รับข้อมู,จาก textfield
    var send_data = { 'user_id': this.user_id };
    var link = this.server.linkServer() + "user_service/selectUser/format/json";

    //ส่งข้อมูลไปที่เว็บเวอวิส เพื่อตรวจสอบข้อมูล
    this.http.post(link, send_data)
      .subscribe(response => {
        //รับข้อมูลใส่ไว้ในตัวแปร
        this.data_table = JSON.parse(response["_body"]);

        //เช็คว่ามีข้อมูลหรือไม่
        if (this.data_table.length > 0) {
          if (this.data_table[0]['user_phone_open'] == 0) {
            this.telPhone = false;
          } else if (this.data_table[0]['user_phone_open'] == 1) {
            this.telPhone = true;
          }

          this.user_fullname = this.data_table[0]['user_fullname'];
          this.user_email = this.data_table[0]['user_email'];
          this.user_username = this.data_table[0]['user_username'];
          this.user_phone = this.data_table[0]['user_phone'];
          this.user_phone2 = this.data_table[0]['user_phone2'];
          this.user_photo = this.data_table[0]['user_photo'];
          this.user_phone_open = this.data_table[0]['user_phone_open'];
          this.user_sex = this.data_table[0]['user_sex'];
          this.user_active = this.data_table[0]['user_active'];

        }
      }, error => {
      });
    console.log('reload_user');
  }

  // setDataUser() {
  //   //ดึกข้อมูลจาก storage มาแสดง
  //   this.storage.get('user_data').then((val) => {
  //     this.user_id = val['user_id'];
  //     this.user_fullname = val['user_fullname'];
  //     this.user_email = val['user_email'];
  //     this.user_username = val['user_username'];
  //     this.user_phone = val['user_phone'];
  //     this.user_phone2 = val['user_phone2'];
  //     this.user_photo = val['user_photo'];
  //     this.user_phone_open = val['user_phone_open'];
  //     // console.log(val['user_phone_open']);
  //     if (val['user_sex'] == 0) {
  //       this.user_sex = 'ชาย';
  //     } else if (val['user_sex'] == 1) {
  //       this.user_sex = 'หญิง';
  //     }
  //     if (val['user_active'] == 0) {
  //       this.user_active = 'ยังไม่ยืนยัน';
  //     } else if (val['user_active'] == 1) {
  //       this.user_active = 'ยืนยันแล้ว';
  //     }
  //     if (this.user_phone_open == 0) {
  //       this.isToggled = false;
  //     } else if (this.user_phone_open == 1) {
  //       this.isToggled = true;
  //     }
  //     // this.getData();
  //   });
  //   // this.getData();
  //   console.log('setDataUser');
  // }

}
