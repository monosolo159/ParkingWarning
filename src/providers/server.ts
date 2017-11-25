import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';
import { Vibration} from 'ionic-native';



@Injectable()
export class Server {
  private pvdLinkShort = 'http://parkingwarning.com/';
  // private pvdLinkShort = 'http://192.168.0.108/ParkingWarningWebSiteService/';


  //ที่เก็บภาพรถ
  private pvdLinkPic = this.pvdLinkShort + 'upload/images/cars/';

  private pvdLinkPicProfile = this.pvdLinkShort + 'upload/images/users/';

  private pvdLink = this.pvdLinkShort + 'index.php/application/';

  private pvdLinkPicNotification = this.pvdLinkShort + 'upload/images/notification/';

  private pvdLinkPicNews = this.pvdLinkShort + 'upload/images/news/';
  // private pvdLink = 'http://parkingwarning.com/index.php/application/';
  constructor(public http: Http) {
    // console.log('Hello Promotion Provider');
  }

  linkServer() {
    return this.pvdLink;
  }
  linkServerShort() {
    return this.pvdLinkShort;
  }
  linkServerPic() {
    return this.pvdLinkPic;
  }
  linkServerPicProfile() {
    return this.pvdLinkPicProfile;
  }
  linkServerPicNotification() {
    return this.pvdLinkPicNotification;
  }

  linkServerPicNews() {
    return this.pvdLinkPicNews;
  }

  notiVibration(time) {
    Vibration.vibrate(time);
  }


}
