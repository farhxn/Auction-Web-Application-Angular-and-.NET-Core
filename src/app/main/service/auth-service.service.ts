import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment.development';
import { TOKEN_KEY } from '../shared/constants';

@Injectable({
  providedIn: 'root'
})
export class AuthServiceService {
  private baseUrl = environment.baseUrl+"User/";
  constructor(private http:HttpClient) { }

  register(form:any){
    return this.http.post(`${this.baseUrl}Register`, form);
  }

  login(form:any){
    return this.http.post(`${this.baseUrl}Login`, form);
  }

  forgetPassword(form:any){
    return this.http.post(`${this.baseUrl}ForgetPassword`, form);
  }

  resetPassword(form:any){
    return this.http.post(`${this.baseUrl}ResetPassword`, form);
  }

  getAllUsers(){
    return this.http.get(`${this.baseUrl}UserList`);
  }


  isLoggedIn(){
    return localStorage.getItem(TOKEN_KEY) != null ? true :false
  }

  getToken(){
    return localStorage.getItem(TOKEN_KEY)
  }

  deleteToken(){
    localStorage.removeItem(TOKEN_KEY)
  }

  saveToken(token:string){
    localStorage.setItem(TOKEN_KEY,token)
  }

  getClaims(){
    return JSON.parse(window.atob(this.getToken()!.split('.')[1]))
  }
}
