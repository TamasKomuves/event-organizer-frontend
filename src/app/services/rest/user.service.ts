import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { IUser } from '../../interface/IUser';
import { IPasswordChange } from '../../interface/IPasswordChange';
import { BaseRestService } from './base-rest.service';
import { IUserRegistration } from 'src/app/interface/IUserRegistration';

@Injectable({
  providedIn: 'root'
})
export class UserService extends BaseRestService {
  constructor(httpClient: HttpClient) {
    super(httpClient);
  }

  login(email: string, password: string) {
    const url = 'public/users/login';
    const body = {
      email: email,
      password: password
    };

    return this.postMethodWithoutAuth(url, body);
  }

  register(user: IUserRegistration) {
    const url = 'public/users/registration';
    return this.postMethodWithoutAuth(url, user);
  }

  logout() {
    const url = 'users/logout';
    return this.getMethod(url);
  }

  getCurrentUser() {
    const url = 'users/current';
    return this.getMethod<IUser>(url);
  }

  getUserByEmail(email: string) {
    const url = 'users/' + email;
    return this.getMethod<IUser>(url);
  }

  getAllUsers() {
    const url = 'users/all';
    return this.getMethod<Array<IUser>>(url);
  }

  updateUserName(email: string, firstname: string, lastname: string) {
    const url = 'users/update/' + email + '/' + firstname + '/' + lastname;
    return this.getMethod(url);
  }

  changePassword(passwordChange: IPasswordChange) {
    const url = 'users/change-password';
    return this.putMethod(url, passwordChange);
  }

  deleteUser() {
    const url = 'users/delete';
    return this.deleteMethod(url);
  }
}
