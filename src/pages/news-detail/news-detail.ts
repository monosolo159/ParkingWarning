import { Component } from '@angular/core';
import { NavController, ModalController, LoadingController, AlertController, NavParams} from 'ionic-angular';
import { Storage } from '@ionic/storage';
import { Http } from '@angular/http';
import { Server } from '../../providers/server';

@Component({
  selector: 'page-news-detail',
  templateUrl: 'news-detail.html',
  providers: [Server]
})
export class NewsDetailPage {
  // public data_table_allPromotion: Array<{}>;
  public data_table_myNews: Array<{}>;
  public news_user_id;
  // promotions: string = "MyPromotion";
  public linkPic = this.server.linkServerPicNews();

  //  constructor(public navCtrl: NavController, public modalCtrl: ModalController, private promotion: Promotion) { }
  constructor(public navCtrl: NavController, public modalCtrl: ModalController, public loadingCtrl: LoadingController, public http: Http, public alertCtrl: AlertController, public storage: Storage, public server: Server, public navParams: NavParams) {
    this.news_user_id = this.navParams.get('news_user_id');
    this.load_myNews(this.news_user_id);
  }

  load_myNews(news_user_id) {
    var link = this.server.linkServer() + "news_service/myNewsDetail/format/json";
    // var link = "http://localhost/parking/promotion.php";

    var send_data = { 'news_user_id': news_user_id };
    //เชื่อต่อกับ mysql server โดยส่งข้อมูลแบบ post
    this.http.post(link, send_data)
      .subscribe(response => {

        // loading_popup.dismiss();//เมื่อโหลดเสร็จแล้วให้ปิด popup
        // นำข้อมูลจาก mysql มาแสดงในตัวเลือกของ select controller
        this.data_table_myNews = JSON.parse(response["_body"]);

      }, error => {

      });
  }

  activeMyNews(news_user_id) {

    // url ฝั่ง server ที่ดึงข้อมูลจาก mysql
    // var link = "http://www.parkingwarning.com/index.php/application/promotion_service/myPromotion/format/json";
    var link = this.server.linkServer() + "news_service/activeNews";
    // var link = "http://localhost/parking/promotion.php";

    var send_data = { 'news_user_id': news_user_id, 'news_user_status': 1 };
    //เชื่อต่อกับ mysql server โดยส่งข้อมูลแบบ post
    this.http.post(link, send_data)
      .subscribe(response => {
        this.load_myNews(this.news_user_id);
      }, error => {

      });
  }
}
