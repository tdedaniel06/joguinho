import { HttpClient } from '@angular/common/http';
import { stringify } from '@angular/compiler/src/util';
import { Injectable } from '@angular/core';
import { Character } from '../classes/character';
import { GenObjects } from '../classes/gen-objects';

@Injectable({
  providedIn: 'root'
})
export class CharacterService {

  constructor(private http: HttpClient) { }

  linkGetChar = "http://moreiramoises.pt/server/apis/get/getChar.php";
  linkGetRandomEnemy = "http://moreiramoises.pt/server/apis/get/getRandomChar.php?";
  linkUpgradeChar = "http://moreiramoises.pt/server/apis/updateChart.php";
  linkBuyWeapon = "http://moreiramoises.pt/server/apis/createArma.php";
  linkAllWepaons = "http://moreiramoises.pt/server/apis/get/getArma.php";

  //get localHost userInfo
  userInfoObj : string;
  userInfoObjParse : GenObjects;

  //get localHost charInfo
  charInfoObj : string;
  charInfoObjParse : Character;

  id : string;

  getChar(){
    //get localStorage userInfo
    this.userInfoObj = localStorage.getItem('userInfo');
    this.userInfoObjParse = JSON.parse(this.userInfoObj);

    return this.http.get(this.linkGetChar + '?PlayerID=' + this.userInfoObjParse['id']);
  }

  getCharEnemy(){
    return this.http.get(this.linkGetRandomEnemy);
  }

  upgrade(name, atk, int, he, id){
    //get localStorage userInfo
    this.userInfoObj = localStorage.getItem('userInfo');
    this.userInfoObjParse = JSON.parse(this.userInfoObj);

    let data: FormData = new FormData();
    data.append("idChar", id);
    data.append("name", name);
    data.append("atk", atk);
    data.append("isMonster", "false");
    data.append("int", int);
    data.append("vida", he);
    data.append("username", this.userInfoObjParse['name']);
    data.append("password", this.userInfoObjParse['pw']);
    return this.http.post(this.linkUpgradeChar, data);
  }

  //buy weapon
  buyWeapon(name, atk, tipo){
    //get localStorage userInfo
    this.userInfoObj = localStorage.getItem('userInfo');
    this.userInfoObjParse = JSON.parse(this.userInfoObj);

    //get localStorage charInfo
    this.charInfoObj = localStorage.getItem('charInfo');
    this.charInfoObjParse = JSON.parse(this.charInfoObj);

    this.id = this.charInfoObjParse['id'].toString();

    let data:FormData = new FormData();
    data.append("name", name);
    data.append("atk", atk);
    data.append("durabilidade", null);
    data.append("tipoDeArma", tipo);
    data.append("vida", null);
    data.append("username", this.userInfoObjParse['name']);
    data.append("password", this.userInfoObjParse['pw']);
    data.append("idPersonagem", this.id);
    return this.http.post(this.linkBuyWeapon, data);
  }

  //get all weapons
  getAllWeapons(){
    //get localStorage charInfo
    this.charInfoObj = localStorage.getItem('charInfo');
    this.charInfoObjParse = JSON.parse(this.charInfoObj);
    //linha abaixo nao carrega no primeiro load da pagina
    this.id = this.charInfoObjParse['id'].toString();

    return this.http.get(this.linkAllWepaons + "?IDPersonagem=" + this.id);
  }
}
