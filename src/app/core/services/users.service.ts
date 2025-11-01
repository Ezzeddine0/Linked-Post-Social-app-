import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../environment/environment';
import { jwtDecode } from 'jwt-decode';

@Injectable({
  providedIn: 'root',
})
export class UsersService {
  private readonly _HttpClient = inject(HttpClient);
  constructor() {}

  signup(data: object): Observable<any> {
    return this._HttpClient.post(`${environment.baseUrl}/users/signup`, data);
  }

  signin(data: object): Observable<any> {
    return this._HttpClient.post(`${environment.baseUrl}/users/signin`, data);
  }

  changePassword(data: object): Observable<any> {
    return this._HttpClient.patch(
      `${environment.baseUrl}/users/change-password`,
      data
    );
  }

  uploadProfilePhoto(data: object): Observable<any> {
    return this._HttpClient.put(
      `${environment.baseUrl}/users/change-password`,
      data
    );
  }
  getLoggedUserData(): Observable<any> {
    return this._HttpClient.get(`${environment.baseUrl}/users/profile-data`);
  }

  userId: string = '';
  userData: any = null;

  saveUserData() {
    if (localStorage.getItem('userToken') !== null) {
      let token: any = localStorage.getItem('userToken');
      //npm i jwt decode
      this.userData = jwtDecode(token);
      localStorage.setItem('UserId', this.userData.id);
      this.userId = this.userData.id;
    }
  }

  // userData!:object
  // saveUserInfo() {
  //   if (localStorage.getItem('userToken') !== null) {
  //     let token: any = localStorage.getItem('userToken');
  //     //npm i jwt decode
  //     this.userData = jwtDecode(token);
  //     localStorage.setItem('UserId', this.userData.id);
  //     this.userId = this.userData.id;
  //   }
  // }
}
