import { Component } from '@angular/core';
import { NavController, ModalController, AlertController, LoadingController } from 'ionic-angular';
import { CarAddPage } from '../car-add/car-add';
import { CarDetailPage } from '../car-detail/car-detail';
import { Storage } from '@ionic/storage';
import { Http } from '@angular/http';
import { Server } from '../../providers/server';
import {Observable} from 'rxjs/Observable';

@Component({
  selector: 'page-car',
  templateUrl: 'car.html',
  providers: [Server]
})
export class CarPage {

  public xxxxx = 'https://www.w3schools.com/css/trolltunga.jpg';
  public data_table: Array<{}>;
  public user_id = '';
  public linkPic = this.server.linkServerPic();
  constructor(public loadingCtrl: LoadingController, public navCtrl: NavController, public alertCtrl: AlertController, public modalCtrl: ModalController, public storage: Storage, public server: Server, public http: Http) {
    Observable.interval(1000).subscribe(res => {
      this.reloadData();
    });
  }

  //โหลดข้อมูลทุกครั้งที่เปิดหน้านี้
  // ionViewWillEnter() {
  //   this.reloadData();
  // }

  reloadData() {
    //ดึงข้อมูล user จาก storage ที่บันทึกไว้ในเครื่อง
    this.storage.get('user_data').then((val) => {
      //ถ้ามีข้อมูลให้ รับค่าใส่ตัวแปรไว้
      this.user_id = val['user_id'];

      this.load_data(this.user_id);
      // this.load_allPromotion(this.user_id);
    });
  }

  carDetail(car_id) {
    //รายละเอียดรถ เฉพาะคัน
    this.navCtrl.push(CarDetailPage, { 'car_id': car_id });
  }
  addCar() {
    //เพิ่มรถ
    this.navCtrl.push(CarAddPage, {});
  }

  load_data(user_id) {
    //กำหนดตัวปรกและค่าภายในเพื่อส่งไปที่เว็บเซอวิส
    // let loading_popup = this.loadingCtrl.create({
    //   // content: 'กำลังโหลด...'
    // });
    // loading_popup.present();
    var send_data = { 'user_id': user_id };

    //ลิงค์ที่ต้องการเรียก
    var link = this.server.linkServer() + "car_service/myCar/format/json";

    //ทำการส่งข้อมูลไปที่เว็บเซอวิส
    this.http.post(link, send_data)
      .subscribe(response => {
        // loading_popup.dismiss();
        // loading_popup.dismiss();
        //หากมีการคืนค่ามาให้ ทำการรับค่าและเก็บไว้
        this.data_table = JSON.parse(response["_body"]);

      }, error => {
      });
  }
}
