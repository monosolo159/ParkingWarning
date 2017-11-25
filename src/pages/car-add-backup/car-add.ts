import { Component } from '@angular/core';
import { NavController, NavParams, ActionSheetController, ToastController, Platform, LoadingController, Loading } from 'ionic-angular';
import { Camera, File, Transfer, FilePath } from 'ionic-native';
import { Server } from '../../providers/server';

declare var cordova: any;

/*
  Generated class for the ForgotPassword page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  selector: 'page-car-add',
  templateUrl: 'car-add.html',
  providers: [Server]
})
export class CarAddPage {

  // lastImage: string = null;
  // promises = [];
  lastImage = [];
  lastImageFront: string = null;
  lastImageBlack: string = null;
  lastImageLeft: string = null;
  lastImageRight: string = null;
  loading: Loading;
  private picGroup;

  constructor(public navCtrl: NavController, public navParams: NavParams, public actionSheetCtrl: ActionSheetController, public toastCtrl: ToastController, public platform: Platform, public loadingCtrl: LoadingController, public server: Server) { }

  // ionViewDidLoad() {
  //   console.log('ionViewDidLoad CarAddPage');
  // }

  public presentActionSheet(picGroup) {
    this.picGroup = picGroup;
    // this.presentToast('picGroup = ' + picGroup + 'this.picGroup = ' + this.picGroup);
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
    // Create options for the Camera Dialog
    var options = {
      quality: 100,
      sourceType: sourceType,
      saveToPhotoAlbum: false,
      correctOrientation: true
    };

    // Get the data of an image
    Camera.getPicture(options).then((imagePath) => {
      // Special handling for Android library
      if (this.platform.is('android') && sourceType === Camera.PictureSourceType.PHOTOLIBRARY) {
        FilePath.resolveNativePath(imagePath)
          .then(filePath => {
            let correctPath = filePath.substr(0, filePath.lastIndexOf('/') + 1);
            let currentName = imagePath.substring(imagePath.lastIndexOf('/') + 1, imagePath.lastIndexOf('?'));
            this.copyFileToLocalDir(correctPath, currentName, this.createFileName(this.picGroup), this.picGroup);
          });
      } else {
        var currentName = imagePath.substr(imagePath.lastIndexOf('/') + 1);
        var correctPath = imagePath.substr(0, imagePath.lastIndexOf('/') + 1);
        this.copyFileToLocalDir(correctPath, currentName, this.createFileName(this.picGroup), this.picGroup);
      }
    }, (err) => {
      this.presentToast('Error while selecting image.');
    });
  }

  private createFileName(picGroup) {
    var d = new Date(),
      n = d.getTime(),
      newFileName = n + '_' + picGroup + ".jpg";
    // this.presentToast(newFileName);
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
    var url = this.server.linkServer() + "car_service/uploadImage";

    // File for Upload
    var targetPath = this.pathForImage(this.lastImage[0]);

    // File name only
    var filename = this.lastImage[0];

    var options = {
      fileKey: "file",
      fileName: filename,
      chunkedMode: false,
      mimeType: "multipart/form-data",
      params: { 'fileName': filename }
    };

    const fileTransfer = new Transfer();

    this.loading = this.loadingCtrl.create({
      // content: 'Uploading...',
    });
    this.loading.present();

    // Use the FileTransfer to upload the image
    fileTransfer.upload(targetPath, url, options).then(data => {
      this.loading.dismissAll()
      this.presentToast('Image succesful uploaded.');
    }, err => {
      this.loading.dismissAll()
      this.presentToast('Error while uploading file.');
    });















    // for (var i = 0; i < 4; i++) {
    //   var targetPath;
    //   targetPath = this.pathForImage(this.lastImage[i]);
    //
    //   // File name only
    //   var filename;
    //   filename = this.lastImage[i];
    //
    //   var options = {
    //     fileKey: "file",
    //     fileName: filename,
    //     chunkedMode: false,
    //     mimeType: "multipart/form-data",
    //     params: { 'fileName': filename }
    //   };
    //
    //   const fileTransfer = new Transfer();
    //
    //   this.loading = this.loadingCtrl.create({
    //     // content: 'Uploading...',
    //   });
    //   this.loading.present();
    //
    //   // Use the FileTransfer to upload the image
    //   fileTransfer.upload(targetPath, url, options).then(data => {
    //     this.loading.dismissAll()
    //     this.presentToast('Image succesful uploaded.');
    //   }, err => {
    //     this.loading.dismissAll()
    //     this.presentToast('Error while uploading file.');
    //   });
    // }
  }
  public addCar() {
    this.uploadImage();
    // this.dataCar();
  }
  public dataCar() {

  }
}
