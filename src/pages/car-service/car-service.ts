import { Component, ViewChild, ElementRef } from '@angular/core';
import { NavController, ModalController, AlertController, LoadingController } from 'ionic-angular';
import { CarAddPage } from '../car-add/car-add';
import { CarDetailPage } from '../car-detail/car-detail';
import { Storage } from '@ionic/storage';
import { Http } from '@angular/http';
import { Server } from '../../providers/server';
import { Observable } from 'rxjs/Observable';
// import { Geolocation } from '@ionic-native/geolocation';
import 'rxjs/add/operator/map';

declare var google;

@Component({
  selector: 'page-car-service',
  templateUrl: 'car-service.html',
  providers: [Server]
})
export class CarServicePage {

  @ViewChild('mapContainer') mapContainer: ElementRef;
  map: any;

  public xxxxx = 'https://www.w3schools.com/css/trolltunga.jpg';
  public data_table: Array<{}>;
  public user_id = '';

  public linkPic = this.server.linkServerPic();
  constructor(public loadingCtrl: LoadingController, public navCtrl: NavController, public alertCtrl: AlertController, public modalCtrl: ModalController, public storage: Storage, public server: Server, public http: Http) {

  }

  ionViewWillEnter() {
    this.displayGoogleMap();
    this.getMarkers();
  }



  displayGoogleMap() {
    var lat;
    var long;

    // this.geolocation.getCurrentPosition().then((resp) => {
    //  lat = resp.coords.latitude
    //  long =  resp.coords.longitude
    //  console.log(lat+","+long);
    // }).catch((error) => {
    //   console.log('Error getting location', error);
    // });

    let latLng = new google.maps.LatLng(17.150914, 104.153813);

    let mapOptions = {
      center: latLng,
      disableDefaultUI: true,
      zoom: 11,
      mapTypeId: google.maps.MapTypeId.ROADMAP
    }
    this.map = new google.maps.Map(this.mapContainer.nativeElement, mapOptions);
  }

  getMarkers() {
    this.http.get('assets/data/markers.json')
    .map((res) => res.json())
    .subscribe(data => {
      this.addMarkersToMap(data);
    });
  }

  addMarkersToMap(markers) {
    for(let marker of markers) {
      var position = new google.maps.LatLng(marker.latitude, marker.longitude);
      var dogwalkMarker = new google.maps.Marker({position: position, title: marker.title});
      dogwalkMarker.setMap(this.map);
    }
  }

}
