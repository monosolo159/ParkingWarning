import { Component } from '@angular/core';
import { App, NavController, ActionSheetController, ToastController, Platform, ViewController, AlertController, LoadingController, Loading } from 'ionic-angular';
import { Storage } from '@ionic/storage';
import { Server } from '../../providers/server';
import { LoginPage } from '../login/login';
import { ProfileEditPage } from '../profile-edit/profile-edit';
import { ProfileSettingPage } from '../profile-setting/profile-setting';
import { EditPasswordPage } from '../edit-password/edit-password';
import { Camera, File, Transfer, Crop} from 'ionic-native';
import { Http } from '@angular/http';

declare var cordova: any;


@Component({
  selector: 'page-profile',
  templateUrl: 'profile.html',
  providers: [Server]
})
export class ProfilePage {

  public linkPicProfile = this.server.linkServerPicProfile();
  public data_table: Array<{}>;
  lastImage: string = null;
  loading: Loading;

  // devicetoken: string;
  public user_id = '';
  public user_fullname = '';
  public user_email = '';
  public user_username = '';
  public user_phone = '';
  public user_phone2 = '';
  public user_sex = '';
  public user_active = '';
  public user_phone_open;
  public user_photo = '';
  public isToggled: boolean;
  constructor(public navCtrl: NavController, public actionSheetCtrl: ActionSheetController, public alertCtrl: AlertController, public platform: Platform, public loadingCtrl: LoadingController, public toastCtrl: ToastController, public server: Server, public storage: Storage, public http: Http, private viewCtrl: ViewController, public app: App) { }

  ionViewWillEnter() {
    this.setDataUser();
  }

  profileSetting() {
    this.navCtrl.push(ProfileSettingPage, { 'user_id': this.user_id });
  }

  updateItem(item) {

    if (item == 1) {
      item = 0;
      this.isToggled = true;
    } else if (item == 0) {
      item = 1;
      this.isToggled = false;
    }
    console.log(item);
    // console.log(item + ' item');
    this.updateUser(item);
  }

  updateUser(item) {
    var link = this.server.linkServer() + "user_service/updateUser";
    var send_data = { 'user_id': this.user_id, 'user_phone_open': item };
    // console.log(item + ' user');
    // ส่งข้อมูลเพื่ออัพเดทไปที่เว็บเซอวิส
    this.http.post(link, send_data)
      .subscribe(response => {
        this.reload_user();
      }, error => { });
  }

  setDataUser() {
    // this.reload_user();

    //ดึกข้อมูลจาก storage มาแสดง
    this.storage.get('user_data').then((val) => {
      this.user_id = val['user_id'];
      this.user_fullname = val['user_fullname'];
      this.user_email = val['user_email'];
      this.user_username = val['user_username'];
      this.user_phone = val['user_phone'];
      this.user_phone2 = val['user_phone2'];
      this.user_photo = this.linkPicProfile + val['user_photo'];
      this.user_phone_open = val['user_phone_open'];
      // console.log(val['user_phone_open']);
      if (val['user_sex'] == 0) {
        this.user_sex = 'ชาย';
      } else if (val['user_sex'] == 1) {
        this.user_sex = 'หญิง';
      }
      if (val['user_active'] == 0) {
        this.user_active = 'ยังไม่ยืนยัน';
      } else if (val['user_active'] == 1) {
        this.user_active = 'ยืนยันแล้ว';
      }
      // this.user_active = val['user_active'];

      if (this.user_phone_open == 0) {
        this.isToggled = false;
        // this.user_phone_open = true;
      } else if (this.user_phone_open == 1) {
        this.isToggled = true;
      }
    });
  }

  profileEdit() {
    this.navCtrl.push(ProfileEditPage);
  }

  passwordEdit() {
    this.navCtrl.push(EditPasswordPage);
  }

  //ออกจากระบบ
  logout() {
    // ลบข้อมูลใน storage
    let alert = this.alertCtrl.create({
      title: 'ออกจากระบบ',
      // message: warning_list_name,
      buttons: [
        {
          text: 'ยกเลิก',
          role: 'cancel',
          handler: () => {
            console.log('Cancel');
          }
        },
        {
          text: 'ยืนยัน',
          handler: () => {
            console.log('Confirm');
            this.storage.remove('user_data').then((val) => {
              // ไปที่หน้า login
              var send_data = {
                'user_id': this.user_id,
                'user_device_id': ''
              };
              var link = this.server.linkServer() + "user_service/updateUser";

              this.http.post(link, send_data).subscribe(response => { }, error => { });

              let navCtrl = this.app.getRootNav();
              navCtrl.setRoot(LoginPage);
            });
          }
        }

      ]
    });
    alert.present();
  }

  public presentActionSheet() {
    //สร้างเมนูเพื่อเลอกว่า จากกล้อง หรือ จาก คลังภาพ
    let actionSheet = this.actionSheetCtrl.create({
      // title: 'เลือกที่อยูภาพ',
      buttons: [
        {
          text: 'เลือกจากคลังภาพ',
          handler: () => {
            this.takePicture(Camera.PictureSourceType.PHOTOLIBRARY);
          }
        },
        {
          text: 'ถ่ายภาพ',
          handler: () => {
            this.takePicture(Camera.PictureSourceType.CAMERA);
          }
        },
        {
          text: 'ยกเลิก',
          role: 'cancel'
        }
      ]
    });
    actionSheet.present();
  }

  public takePicture(sourceType) {
    //คุณสมบัติของภาพ
    var options = {
      quality: 100,
      sourceType: sourceType,
      saveToPhotoAlbum: true,
      correctOrientation: true,
      targetWidth: 500
    };

    // Get the data of an image
    Camera.getPicture(options).then((imagePath) => {
      // Special handling for Android library
      // alert('imagePath 1 = ' + imagePath);
      if (this.platform.is('android') && sourceType === Camera.PictureSourceType.PHOTOLIBRARY) {
        // FilePath.resolveNativePath(imagePath)
        // .then(filePath => {
        imagePath = 'file://' + imagePath;
        // alert('imagePath ' + imagePath);
        // alert('filePath  ' + filePath);
        Crop.crop(imagePath, { quality: 100 }).then((path) => {
          // alert('imagePath Crop' + imagePath);
          imagePath = path;
          // let correctPath = filePath.substr(0, filePath.lastIndexOf('/') + 1);
          let correctPath = imagePath.substr(0, imagePath.lastIndexOf('/') + 1);
          // alert('correctPath ' + correctPath);
          let currentName = imagePath.substring(imagePath.lastIndexOf('/') + 1, imagePath.lastIndexOf('?'));
          // alert('currentName ' + currentName);
          this.copyFileToLocalDir(correctPath, currentName, this.createFileName());
        });
        // });

      } else {
        // alert('imagePath ' + imagePath);
        Crop.crop(imagePath, { quality: 100 }).then((path) => {
          imagePath = path;
          // var currentName = imagePath.substr(imagePath.lastIndexOf('/') + 1);
          let currentName = imagePath.substring(imagePath.lastIndexOf('/') + 1, imagePath.lastIndexOf('?'));
          // alert('currentName ' + currentName);
          var correctPath = imagePath.substr(0, imagePath.lastIndexOf('/') + 1);
          // alert('correctPath ' + correctPath);
          this.copyFileToLocalDir(correctPath, currentName, this.createFileName());

        });

      }

    }, (err) => {
      // this.presentToast('Error while selecting image.');
    });
  }


  private createFileName() {
    var d = new Date();
    var n = d.getTime();
    var newFileName = this.user_id + '_' + n + ".jpg";
    return newFileName;
  }

  private copyFileToLocalDir(namePath, currentName, newFileName) {
    File.copyFile(namePath, currentName, cordova.file.dataDirectory, newFileName).then(success => {
      this.lastImage = newFileName;
      this.uploadImage();
    }, error => {
      this.presentToast('Error while storing file.');
    });
  }

  private presentToast(text) {
    let toast = this.toastCtrl.create({
      message: text,
      duration: 3000,
      position: 'top'
    });
    toast.present();
  }

  // Always get the accurate path to your apps folder
  public pathForImage(img) {
    if (img === null) {
      return '';
    } else {
      return cordova.file.dataDirectory + img;
    }
  }

  public uploadImage() {
    // Destination URL

    var url = this.server.linkServer() + "user_service/uploadImage";
    // var url = this.server.linkServer() + "car_service/uploadImage";

    //แสดงเอฟเฟคการโหลดข้อมูล
    var targetPath = this.pathForImage(this.lastImage);

    // File name only
    var filename = this.lastImage;

    var options = {
      fileKey: "file",
      fileName: filename,
      chunkedMode: false,
      mimeType: "multipart/form-data"
      // params: { 'fileName': filename }
    };

    const fileTransfer = new Transfer();

    this.loading = this.loadingCtrl.create({
      // content: 'Uploading...',
    });
    this.loading.present();

    fileTransfer.upload(targetPath, url, options).then(data => {
      this.loading.dismissAll();
      // this.presentToast('Image succesful uploaded.');
      this.userUpdatePhoto();
    }, err => {
      this.loading.dismissAll();
      // this.presentToast('Error while uploading file.');
    });
  }


  public userUpdatePhoto() {
    let loading_popup = this.loadingCtrl.create({});
    loading_popup.present();

    var send_data = {
      'user_id': this.user_id,
      'user_photo': this.lastImage
    };
    var link = this.server.linkServer() + "user_service/userUpdatePhoto";

    this.http.post(link, send_data)
      .subscribe(response => {
        this.user_photo = this.lastImage;
        loading_popup.dismiss();
        this.reload_user();
        this.navCtrl.pop();
      }, error => {
      });
  }

  public userPhoto() {
    this.uploadImage();
    this.userUpdatePhoto();

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

          var arrUser = {
            user_id: this.data_table[0]['user_id'],
            user_fullname: this.data_table[0]['user_fullname'],
            user_email: this.data_table[0]['user_email'],
            user_username: this.data_table[0]['user_username'],
            user_phone: this.data_table[0]['user_phone'],
            user_phone2: this.data_table[0]['user_phone2'],
            user_phone_open: this.data_table[0]['user_phone_open'],
            user_photo: this.data_table[0]['user_photo'],
            user_sex: this.data_table[0]['user_sex'],
            user_active: this.data_table[0]['user_active']
          }

          //บันทึกข้อมูลที่ได้มาไว้ใน storage ของเครื่อง
          this.storage.set('user_data', arrUser).then((val) => {

            this.setDataUser();
          });
        }
      }, error => {
      });
  }

}
