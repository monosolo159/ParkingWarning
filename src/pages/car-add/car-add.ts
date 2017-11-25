import { Component } from '@angular/core';
import { NavController, NavParams, ActionSheetController, ToastController, Platform, LoadingController, Loading, AlertController} from 'ionic-angular';
import { Camera, File, Transfer, Crop } from 'ionic-native';
import { Server } from '../../providers/server';
import { Storage } from '@ionic/storage';
//import { TabsPage } from './../tabs/tabs';
import { Http } from '@angular/http';


// import { ImagePicker } from '@ionic-native/image-picker';

declare var cordova: any;


@Component({
  selector: 'page-car-add',
  templateUrl: 'car-add.html',
  providers: [Server]
})
export class CarAddPage {

  public data_table: Array<{}>;
  public data_table_province: Array<{}>;
  public data_table_brand: Array<{}>;
  public data_table_brand_year: Array<{}>;
  public data_table_model: Array<{}>;
  public data_table_color: Array<{}>;

  lastImage = [];
  lastImageFront: string = null;
  lastImageBlack: string = null;
  lastImageLeft: string = null;
  lastImageRight: string = null;
  loading: Loading;

  // public car_id = 0;
  public picGroup;
  public car_user_id;
  public car_license_plate;
  public car_brand_id;
  public car_model_id;
  public car_year;
  public car_color;
  public car_province;
  public car_pic_front;
  public car_pic_back;
  public car_pic_left;
  public car_pic_right;


  constructor(public alertCtrl: AlertController, public navCtrl: NavController, public navParams: NavParams, public actionSheetCtrl: ActionSheetController, public toastCtrl: ToastController, public platform: Platform, public loadingCtrl: LoadingController, public server: Server, public storage: Storage, public http: Http) {

  }

  ionViewWillEnter() {
    this.getDataUser();
    this.getProvince();
    this.car_province = 0;

    this.getCarBrand();
    this.car_brand_id = 0;
    this.car_year = 0;
    this.car_model_id = 0;
    this.car_color = 0;

    this.getCarColor();
  }

  public getDataUser() {
    //ดึงค่าจาก storage ใส่ตัวแปร
    this.storage.get('user_data').then((val) => {
      this.car_user_id = val['user_id'];
    });

  }

  //รับข้อมูลจากเว็บเซอวิส *จังหวัด
  public getProvince() {
    var send_data = {};
    var link = this.server.linkServer() + "car_service/carProvince/format/json";

    this.http.post(link, send_data)
      .subscribe(response => {
        //หากมีข้อมู,ส่งคืนกลับมาให้ใส่ตัวแปรไว้
        this.data_table_province = JSON.parse(response["_body"]);
      }, error => {
      });
  }

  //รับข้อมูลจากเว็บเซอวิส *ยี่ห้อรถ
  public getCarBrand() {
    var send_data = {};
    var link = this.server.linkServer() + "car_service/carBrand/format/json";

    this.http.post(link, send_data)
      .subscribe(response => {
        //หากมีข้อมู,ส่งคืนกลับมาให้ใส่ตัวแปรไว้
        this.data_table_brand = JSON.parse(response["_body"]);

      }, error => {
      });
  }

  //รับข้อมูลจากเว็บเซอวิส *ปีรถ
  public getCarBrandYear() {
    var send_data = { 'car_brand_id': this.car_brand_id };
    var link = this.server.linkServer() + "car_service/carBrandYear/format/json";

    this.http.post(link, send_data)
      .subscribe(response => {
        //หากมีข้อมู,ส่งคืนกลับมาให้ใส่ตัวแปรไว้
        this.data_table_brand_year = JSON.parse(response["_body"]);
        this.car_year = 0;
      }, error => {
      });
  }

  public getCarModel() {
    var send_data = { 'car_brand_year_id': this.car_year };
    var link = this.server.linkServer() + "car_service/carModel/format/json";

    this.http.post(link, send_data)
      .subscribe(response => {
        //หากมีข้อมู,ส่งคืนกลับมาให้ใส่ตัวแปรไว้
        this.data_table_model = JSON.parse(response["_body"]);

      }, error => {
      });
  }

  public getCarColor() {
    var send_data = {};
    var link = this.server.linkServer() + "car_service/carColor/format/json";

    this.http.post(link, send_data)
      .subscribe(response => {
        //หากมีข้อมู,ส่งคืนกลับมาให้ใส่ตัวแปรไว้
        this.data_table_color = JSON.parse(response["_body"]);

      }, error => {
      });
  }

  //เลือกภาพรถ *4ภาพ
  public presentActionSheet(picGroup) {
    this.picGroup = picGroup;

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

  //สร้างภาพ
  public takePicture(sourceType) {
    //คุณสมบัติของภาพ
    var options = {
      // allowEdit: true,
      quality: 100,
      sourceType: sourceType,
      destinationType: Camera.DestinationType.FILE_URI,
      saveToPhotoAlbum: true,
      correctOrientation: true,
      targetWidth: 800
    };

    // var img = new Image();
    // Get the data of an image
    Camera.getPicture(options).then((imagePath) => {
      //กรณี android และ platform อื่นๆ

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
          this.copyFileToLocalDir(correctPath, currentName, this.createFileName(this.picGroup), this.picGroup);
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
          this.copyFileToLocalDir(correctPath, currentName, this.createFileName(this.picGroup), this.picGroup);

        });

      }

    }, (err) => {
      // this.presentToast('Error while selecting image.');
    });


  }

  public checkImage(correctPath, currentName) {
    var img = new Image();
    img.src = correctPath + currentName;
    img.onload = function() { };
    alert(img.width + ' x ' + img.height);
    var imageinfo = [];
    imageinfo['width'] = img.width;
    imageinfo['height'] = img.height;
    if (img.width >= img.height) {
      return true;
    } else {
      return false;
    }
  }
  //สร้างชื่อไฟล์ใหม่ จากวันเวลา
  private createFileName(picGroup) {
    var d = new Date();
    var n = d.getTime();
    var newFileName = this.car_user_id + '_' + n + '_' + picGroup + ".jpg";
    return newFileName;
  }

  // Copy the image to a local folder
  private copyFileToLocalDir(namePath, currentName, newFileName, picGroup) {

    File.copyFile(namePath, currentName, cordova.file.dataDirectory, newFileName).then(success => {
      if (this.picGroup === 0) {
        this.lastImage[0] = newFileName;
        this.lastImageFront = newFileName;
      } else if (this.picGroup === 1) {
        this.lastImage[1] = newFileName;
        this.lastImageBlack = newFileName;
      } else if (this.picGroup === 2) {
        this.lastImage[2] = newFileName;
        this.lastImageLeft = newFileName;
      } else if (this.picGroup === 3) {
        this.lastImage[3] = newFileName;
        this.lastImageRight = newFileName;
      }

    }, error => {
      // this.presentToast('Error while storing file.');
    });
  }

  // private presentToast(text) {
  //   let toast = this.toastCtrl.create({
  //     message: text,
  //     duration: 3000,
  //     position: 'top'
  //   });
  //   toast.present();
  // }

  // Always get the accurate path to your apps folder
  public pathForImage(img) {
    if (img === null) {
      return '';
    } else {
      return cordova.file.dataDirectory + img;
    }
  }


  //อัพโหลดภาพไปที่เว็บเซอวิส
  public uploadImage() {
    // Destination URL
    var url = this.server.linkServer() + "car_service/uploadImage";

    //แสดงเอฟเฟคการโหลดข้อมูล
    this.loading = this.loadingCtrl.create({});
    this.loading.present();

    //อัพโหลดไลฟ์ภาพทีละไฟล์
    for (var i = 0; i < 4; i++) {
      if (this.lastImage[i]) {
        var targetPath = this.pathForImage(this.lastImage[i]);

        // File name only
        var filename = this.lastImage[i];

        var options = {
          fileKey: "file",
          fileName: filename,
          chunkedMode: false,
          mimeType: "multipart/form-data"
          // params: { 'fileName': filename }
        };

        const fileTransfer = new Transfer();

        // Use the FileTransfer to upload the image
        fileTransfer.upload(targetPath, url, options).then(data => {
          // this.loading.dismissAll();
          // this.presentToast('Image succesful uploaded.');
        }, err => {
          // this.loading.dismissAll();
          // this.presentToast('Error while uploading file.');
        });
      }

    }

    this.addDataCar();
    //ปิดเอฟเฟคการโหลดข้อมูล
    this.loading.dismissAll();
  }

  //เพิ่มข้อมูลรถ user
  public addDataCar() {
    let loading_popup = this.loadingCtrl.create({});
    loading_popup.present();

    this.car_license_plate = this.car_license_plate.replace(/\s/g, '');

    var send_data = {
      'car_license_plate': this.car_license_plate,
      'car_brand_id': this.car_brand_id,
      'car_model_id': this.car_model_id,
      'car_year': this.car_year,
      'car_color': this.car_color,
      'car_province': this.car_province,
      'car_user_id': this.car_user_id,
      'car_pic_front': this.lastImage[0],
      'car_pic_back': this.lastImage[1],
      'car_pic_left': this.lastImage[2],
      'car_pic_right': this.lastImage[3]
    };
    var link = this.server.linkServer() + "car_service/addMyCar";

    this.http.post(link, send_data)
      .subscribe(response => {

        loading_popup.dismiss();

        this.navCtrl.pop();
      }, error => {
      });
  }

  public addCar() {
    if (this.lastImage[0] == null || this.lastImage[1] == null || this.lastImage[2] == null || this.lastImage[3] == null || this.car_license_plate == '' || this.car_brand_id == 0 || this.car_model_id == 0 || this.car_year == 0 || this.car_color == 0 || this.car_province == 0) {
      let alert = this.alertCtrl.create({
        // title: 'แจ้งเตือน',
        subTitle: 'กรุณากรอกข้อมูลให้ครบถ้วน',
        buttons: ['ตกลง']
      });
      alert.present();
    } else {
      this.uploadImage();
    }

    // this.addDataCar();
  }
}
