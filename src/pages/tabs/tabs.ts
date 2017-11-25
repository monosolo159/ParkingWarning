import { NotificationPage } from './../notification/notification';
import { ModalController, NavParams, Tabs, AlertController} from 'ionic-angular';
import { ProfilePage } from './../profile/profile';
import { EmergencyPage } from './../emergency/emergency';
import { NewsPage } from './../news/news';
import { CarPage } from './../car/car';
import { CarServicePage } from './../car-service/car-service';
import { Component, ViewChild } from '@angular/core';
import { Http } from '@angular/http';
import { Storage } from '@ionic/storage';
import { Server } from '../../providers/server';
import {Observable} from 'rxjs/Observable';


@Component({
  templateUrl: 'tabs.html'
})
export class TabsPage {

  @ViewChild('myTabs') tabRef: Tabs;

  newsRoot: any = NewsPage;
  emergencyRoot: any = EmergencyPage;
  notificationRoot: any = NotificationPage;
  carRoot: any = CarPage;
  profileRoot: any = ProfilePage;
  carserviceRoot: any = CarServicePage;

  public data_table: Array<{}>;
  public selectIndexTabs = 0;
  public user_id;
  public tabsEnable;

  // constructor(public modalCtrl: ModalController, public navParams: NavParams) {
  constructor(public modalCtrl: ModalController, public navParams: NavParams, public server: Server, public storage: Storage, public http: Http, public alertCtrl: AlertController) {

    Observable.interval(1000).subscribe(res => {
      this.storage.get('user_data').then((val) => {
        //ถ้ามีข้อมูลให้ไปที่หน้า tabs
        if (val != null) {
          this.user_id = val['user_id'];
          this.checkUserCar();
        }

      });
    });
  }

  public checkUserCar() {
    var send_data = { 'user_id': this.user_id };
    var link = this.server.linkServer() + "car_service/myCar/format/json";

    //ส่งข้อมูลไปที่เว็บเวอวิส เพื่อตรวจสอบข้อมูล
    this.http.post(link, send_data)
      .subscribe(response => {
        //รับข้อมูลใส่ไว้ในตัวแปร
        this.data_table = JSON.parse(response["_body"]);

        //เช็คว่ามีข้อมูลหรือไม่
        if (this.data_table.length < 1) {
          this.tabsEnable = false;
          this.selectIndexTabs = 4;
        }
        else {
          this.tabsEnable = true;
          this.selectIndexTabs = 0;
        }

        if (this.tabRef.getSelected().index != 4 && this.tabsEnable == false) {
          this.tabRef.select(4);
          let alert = this.alertCtrl.create({
            // title: 'แจ้งเตือน',
            subTitle: 'กรุณาเพิ่มข้อมูลรถของท่าน',
            buttons: ['ตกลง']
          });
          alert.present();
          // console.log('in if');
        }
        console.log(this.tabRef.getSelected().index);
      }, error => {
      });
  }
}
