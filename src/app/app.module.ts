import { NotificationPage } from './../pages/notification/notification';
import { CarPage } from './../pages/car/car';
import { ProfilePage } from './../pages/profile/profile';
import { NewsPage } from './../pages/news/news';
import { NewsDetailPage } from './../pages/news-detail/news-detail';
import { EmergencyPage } from './../pages/emergency/emergency';
import { NgModule } from '@angular/core';
import { IonicApp, IonicModule } from 'ionic-angular';
import { MyApp } from './app.component';
import { TabsPage } from '../pages/tabs/tabs';
import { LoginPage } from '../pages/login/login';
import { CarServicePage } from '../pages/car-service/car-service';
import { RegisterPage } from '../pages/register/register';
import { ForgotPasswordPage } from '../pages/forgot-password/forgot-password';
import { EditPasswordPage } from '../pages/edit-password/edit-password';
import { CarAddPage } from '../pages/car-add/car-add';
import { CarDetailPage } from '../pages/car-detail/car-detail';
import { NotificationAddPage } from '../pages/notification-add/notification-add';
import { NotificationCorrectPage } from '../pages/notification-correct/notification-correct';
import { Server } from '../providers/server';
import { Storage } from '@ionic/storage';
import { ProfileEditPage } from '../pages/profile-edit/profile-edit';
import { ProfileSettingPage } from '../pages/profile-setting/profile-setting';
import { OneSignal } from '@ionic-native/onesignal';
import { MomentModule } from 'angular2-moment';

import 'moment/locale/th';



@NgModule({
  declarations: [
    MyApp,
    EmergencyPage,
    NewsPage,
    NewsDetailPage,
    CarPage,
    ProfilePage,
    TabsPage,
    NotificationPage,
    LoginPage,
    RegisterPage,
    ForgotPasswordPage,
    EditPasswordPage,
    CarAddPage,
    NotificationAddPage,
    NotificationCorrectPage,
    ProfileEditPage,
    ProfileSettingPage,
    CarDetailPage,
    CarServicePage
  ],
  imports: [
    MomentModule,
    IonicModule.forRoot(MyApp)
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    EmergencyPage,
    NewsPage,
    NewsDetailPage,
    CarPage,
    ProfilePage,
    TabsPage,
    NotificationPage,
    LoginPage,
    RegisterPage,
    ForgotPasswordPage,
    EditPasswordPage,
    CarAddPage,
    NotificationAddPage,
    NotificationCorrectPage,
    ProfileEditPage,
    ProfileSettingPage,
    CarDetailPage,
    CarServicePage
  ],
  providers: [Storage, Server, OneSignal]
})
export class AppModule { }
