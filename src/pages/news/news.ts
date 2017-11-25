import { Component } from '@angular/core';
import { NavController, ModalController, LoadingController, AlertController } from 'ionic-angular';
import { Storage } from '@ionic/storage';
import { Http } from '@angular/http';
import { Server } from '../../providers/server';
import { NewsDetailPage } from '../news-detail/news-detail';
// import {MomentModule} from 'angular2-moment';

@Component({
  selector: 'page-news',
  templateUrl: 'news.html',
  providers: [Server]
})
export class NewsPage {
  // public data_table_allPromotion: Array<{}>;
  public data_table_myNews: Array<{}>;
  public user_id = '';
  public linkPic = this.server.linkServerPicNews();
  public xxx;
  constructor(public navCtrl: NavController, public modalCtrl: ModalController, public loadingCtrl: LoadingController, public http: Http, public alertCtrl: AlertController, public storage: Storage, public server: Server) {

  }

  // ทำงานทุกครั้งที่เข้าหน้านี้
  ionViewWillEnter() {
    this.reloadData();
  }

  news_detail(news_user_id) {
    this.navCtrl.push(NewsDetailPage, { 'news_user_id': news_user_id });
  }

  reloadData() {
    this.storage.get('user_data').then((val) => {
      this.user_id = val['user_id'];
      this.load_myNews(this.user_id);
      // this.load_allPromotion(this.user_id);
      // console.log('test reload');
    });

  }

  // โหลดข่าวจากเว็บเซอวิส
  load_myNews(user_id) {
    // var link = "http://www.parkingwarning.com/index.php/application/promotion_service/myPromotion/format/json";
    var link = this.server.linkServer() + "news_service/myNews/format/json";
    // var link = "http://localhost/parking/promotion.php";
    // let loading_popup = this.loadingCtrl.create({
    //   // content: 'กำลังโหลด...'
    // });
    // loading_popup.present();
    var send_data = { 'user_id': user_id };
    //เชื่อต่อกับ mysql server โดยส่งข้อมูลแบบ post
    this.http.post(link, send_data)
      .subscribe(response => {
        // loading_popup.dismiss();
        // loading_popup.dismiss();//เมื่อโหลดเสร็จแล้วให้ปิด popup
        // นำข้อมูลจาก mysql มาแสดงในตัวเลือกของ select controller
        this.data_table_myNews = JSON.parse(response["_body"]);
        // this.xxx = MomentModule.moment("20111031", "YYYYMMDD").fromNow();
      }, error => {

      });
  }
}
