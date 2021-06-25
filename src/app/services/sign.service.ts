import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { GenObjects } from '../classes/gen-objects';

@Injectable({
  providedIn: 'root'
})
export class SignService {

  constructor(private http: HttpClient) { }

  linkRegist = "http://moreiramoises.pt/server/apis/signup.php";
  linkLogin = "http://moreiramoises.pt/server/apis/login.php";
  linkCharacter = "http://moreiramoises.pt/server/apis/createChart.php";

  idPlayer : number;
  username : string;
  pass : string;

  //get localHost userInfo
  userInfoObj : string;
  userInfoObjParse : GenObjects;


  regist(name, pw){
    let data:FormData = new FormData();
    data.append("username", name);
    data.append("password", pw);
    return this.http.post(this.linkRegist , data);
  }

  login(name, pw){
    let data: FormData = new FormData();
    data.append("username", name);
    data.append("password", pw);
    return this.http.post(this.linkLogin, data);
  }

  newChar(name, atk, int, he){
    //get localStorage userInfo
    this.userInfoObj = localStorage.getItem('userInfo');
    this.userInfoObjParse = JSON.parse(this.userInfoObj);

    let data: FormData = new FormData();
    data.append("name", name);
    data.append("atk", atk);
    data.append("isMonster", "false");
    data.append("int", int);
    data.append("vida", he);
    data.append("username", this.userInfoObjParse['name']);
    data.append("password", this.userInfoObjParse['pw']);
    return this.http.post(this.linkCharacter, data);
  }

}
