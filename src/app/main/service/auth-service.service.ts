import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment.development';
import { TOKEN_KEY } from '../shared/constants';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthServiceService {
  private loginStatus$ = new BehaviorSubject<boolean>(this.checkToken());

  get isLoggedIn$() {
    return this.loginStatus$.asObservable();
  }

  private checkToken(): boolean {
    return !!localStorage.getItem(TOKEN_KEY);
  }

  private baseUrl = environment.baseUrl + 'User/';
  constructor(private http: HttpClient) {}

  //#region  User Management
  register(form: any) {
    return this.http.post(`${this.baseUrl}Register`, form);
  }

  login(form: any) {
    return this.http.post(`${this.baseUrl}Login`, form);
  }

  forgetPassword(form: any) {
    return this.http.post(`${this.baseUrl}ForgetPassword`, form);
  }

  resetPassword(form: any) {
    return this.http.post(`${this.baseUrl}ResetPassword`, form);
  }

  getAllUsers() {
    return this.http.get(`${this.baseUrl}UserList`);
  }

  getUserDetail(id: string) {
    return this.http.get(`${this.baseUrl}UserDetail/${id}`);
  }

  updateUser(form: any, id: string) {
    return this.http.put(`${this.baseUrl}EditUser/${id}`, form);
  }

  deleteUser(id: string) {
    return this.http.delete(`${this.baseUrl}DeleteUser/${id}`);
  }

  //#endregion User Management

  //#region  Role Management

  getAllRoles() {
    return this.http.get(`${this.baseUrl}RoleList`);
  }

  getRoleDetail(id: string) {
    return this.http.get(`${this.baseUrl}RoleDetail/${id}`);
  }

  createRole(form: any) {
    return this.http.post(`${this.baseUrl}AddRole`, form);
  }

  updateRole(form: any, id: string) {
    return this.http.put(`${this.baseUrl}EditRole/${id}`, form);
  }

  deleteRole(id: string) {
    return this.http.delete(`${this.baseUrl}DeleteRole/${id}`);
  }

  //#endregion Role Management

  //#region  Auth Management
  isLoggedIn() {
    return localStorage.getItem(TOKEN_KEY) != null ? true : false;
  }

  getToken() {
    return localStorage.getItem(TOKEN_KEY);
  }

  deleteToken() {
    localStorage.removeItem(TOKEN_KEY);
  }

  logout(): void {
    localStorage.removeItem(TOKEN_KEY);
    this.loginStatus$.next(false);
  }
  saveToken(token: string) {
    localStorage.setItem(TOKEN_KEY, token);
    this.loginStatus$.next(true);
  }

  getClaims() {
    return JSON.parse(window.atob(this.getToken()!.split('.')[1]));
  }
  //#endregion Auth Management
}
