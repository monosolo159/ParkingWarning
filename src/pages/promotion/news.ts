import { Component } from '@angular/core';
import { NavController, ModalController, LoadingController, AlertController } from 'ionic-angular';
import { Storage } from '@ionic/storage';
//import { TabsPage } from './../tabs/tabs';
import { Http } from '@angular/http';
import { Server } from '../../providers/server';

/*
Generated class for the Category page.

See http://ionicframework.com/docs/v2/components/#navigation for more info on
Ionic pages and navigation.
*/
@Component({
  selector: 'page-news',
  templateUrl: 'news.html',
  providers: [Server]
})
export class NewsPage {
  public data_table_allPromotion: Array<{}>;
  public data_table_myPromotion: Array<{}>;
  public user_id = '';
  // promotions: string = "MyPromotion";


  //  constructor(public navCtrl: NavController, public modalCtrl: ModalController, private promotion: Promotion) { }
  constructor(public navCtrl: NavController, public modalCtrl: ModalController, public loadingCtrl: LoadingController, public http: Http, public alertCtrl: AlertController, public storage: Storage, public server: Server) {
    // storage.get('user_data').then((val) => {
    //   this.user_id = val['user_id'];
    //   this.load_myPromotion(this.user_id);
    //   this.load_allPromotion(this.user_id);
    // });
  }

  ionViewWillEnter() {
    this.reloadData();
  }

  reloadData() {
    this.storage.get('user_data').then((val) => {
      this.user_id = val['user_id'];
      this.load_myNews();
      // this.load_allPromotion(this.user_id);
      // console.log('test reload');
    });

  }

  // load_allPromotion(user_id){
  //   // let loading_popup = this.loadingCtrl.create({
  //   //   // content: 'เข้าสู่ระบบ...'
  //   // });
  //   // loading_popup.present();
  //   var send_data = {'user_id':user_id};
  //
  //   var link = this.server.linkServer()+"promotion_service/promotionlist/format/json";
  //
  //
  //   this.http.post(link, send_data)
  //   .subscribe(response => {
  //     // loading_popup.dismiss();
  //     this.data_table_allPromotion = JSON.parse(response["_body"]);
  //
  //   }, error => {
  //   });
  // }

  load_myNews() {
    // ให้แสดง popup กำลังโหลด
    // let loading_popup = this.loadingCtrl.create({
    //   // content: 'กำลังโหลด...'
    // });
    // loading_popup.present();

    // url ฝั่ง server ที่ดึงข้อมูลจาก mysql
    // var link = "http://www.parkingwarning.com/index.php/application/promotion_service/myPromotion/format/json";
    var link = this.server.linkServer() + "news_service/myNews/format/json";
    // var link = "http://localhost/parking/promotion.php";

    var send_data = { 'user_id': this.user_id };
    //เชื่อต่อกับ mysql server โดยส่งข้อมูลแบบ post
    this.http.post(link, send_data)
      .subscribe(response => {

        // loading_popup.dismiss();//เมื่อโหลดเสร็จแล้วให้ปิด popup
        // นำข้อมูลจาก mysql มาแสดงในตัวเลือกของ select controller
        this.data_table_myPromotion = JSON.parse(response["_body"]);

      }, error => {

      });
  }

  activeMyNews(news_user_id) {

    // url ฝั่ง server ที่ดึงข้อมูลจาก mysql
    // var link = "http://www.parkingwarning.com/index.php/application/promotion_service/myPromotion/format/json";
    var link = this.server.linkServer() + "news_service/addMyPromotion/format/json";
    // var link = "http://localhost/parking/promotion.php";

    var send_data = { 'user_id': this.user_id, 'news_user_status': 1 };
    //เชื่อต่อกับ mysql server โดยส่งข้อมูลแบบ post
    this.http.post(link, send_data)
      .subscribe(response => {
        // this.promotions = "MyPromotion";
        // นำข้อมูลจาก mysql มาแสดงในตัวเลือกของ select controller
        // this.data_table_myPromotion=JSON.parse(response["_body"]);
        // this.load_allPromotion(this.user_id);
        this.load_myNews();
      }, error => {

      });
  }


  //
  //
  //
  // swipeLeft() {
  //   //let tab: TabsPage = this.navCtrl.parent;
  //   //tab.select(1);
  //
  // }
  //
  // swipeRight() {
  //   //let tab: TabsPage = this.navCtrl.parent;
  //   //tab.select(4);
  //
  // }

}
