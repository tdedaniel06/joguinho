import { Component, OnInit } from '@angular/core';
import { NgbModalConfig, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Character } from 'src/app/classes/character';
import { GenObjects } from 'src/app/classes/gen-objects';
import { CharacterService } from 'src/app/services/character.service';
import { SignService } from 'src/app/services/sign.service';

@Component({
  selector: 'app-cave',
  templateUrl: './cave.component.html',
  styleUrls: ['./cave.component.css']
})
export class CaveComponent implements OnInit {

  constructor(config: NgbModalConfig, private modalService: NgbModal, private sign: SignService, private char: CharacterService) {
    config.backdrop = 'static';
    config.keyboard = false;
   }

  ngOnInit(): void {
    this.refreshHeader();
    this.getCharReady();
  }

  name : string;
  atk : number;
  int : number;
  he : number;

  atkP : number = 0;
  intP : number = 0;
  heP : number = 0;
  total : number = 30;

  created : number = 0;

  //localstorage class
  localUser : Character;

  //get localHost userInfo
  userInfoObj : string;
  userInfoObjParse : GenObjects;

  //get elements id
  status;
  noChar;

  //weap atrib
  nomeA : string;
  atkA : number;
  tipo : string;

  coins : number;
  weapon : string = 'none';

  tpSW : boolean = false;
  tpBW : boolean = false;
  tpFK : boolean = false;

  //erros
  errChar : boolean = false;

  //adventure mode
  btnAdv : boolean = false;

  //get localHost charInfo
  charInfoObj : string;
  charInfoObjParse : Character;

  arrayMessage : Array<any> = ['Strike while the iron is hot!','Blood is thicker than water!','Misery loves company!','Appear weak when you are strong, and strong when you are weak!','Better to reign in hell than serve in heaven!','The truth may hurt, but fooling yourself will enslave you!'];
  headerMessage : string;
  random : number;

  refreshHeader(){
    this.random = Math.floor(Math.random() * this.arrayMessage.length);
    this.headerMessage = this.arrayMessage[this.random];
  }

  //get char
  getCharReady(){
    //get elementsID
    this.status = document.getElementById("statusChar");
    this.noChar = document.getElementById("noChar");

    this.char.getChar().subscribe((x) => {
      if(x['code'] == 200){
        this.name = x['data'].Personagens[0].Nome;
        this.atk = x['data'].Personagens[0].Atk;
        this.int = x['data'].Personagens[0].Int;
        this.he = x['data'].Personagens[0].Vida;

        //trata localStorage
        this.localUser = new Character(x['data'].Personagens[0].Nome, x['data'].Personagens[0].ID, x['data'].Personagens[0].Atk, x['data'].Personagens[0].Int, x['data'].Personagens[0].Vida); //definir class com os values
        localStorage.setItem("charInfo", JSON.stringify(this.localUser)); //save userInfo localStorage

        //get username from localstorage
        this.userInfoObj = localStorage.getItem('userInfo');
        this.userInfoObjParse = JSON.parse(this.userInfoObj);

        //define coins
        this.coins = parseInt(localStorage.getItem("userCoins"+this.userInfoObjParse['name']));

        //get localStorage userInfo
        this.charInfoObj = localStorage.getItem('userInfo');
        this.charInfoObjParse = JSON.parse(this.charInfoObj);

        //check if localStorage char weapon exits
        if (localStorage.getItem("charWeapon"+this.charInfoObjParse.id) === null) {
          //set localstorage to char's weapon
          localStorage.setItem("charWeapon"+this.charInfoObjParse.id, 'none');
        }

        //define charWeapon
        this.weapon = localStorage.getItem("charWeapon"+this.charInfoObjParse.id);


        //get all weapons
        this.allWeapon();

        //active btn adventure mode
        this.btnAdv = true;

        this.noChar.style.display="none";
      }
      else{
        this.status.style.display="none";
      }
    });
  }

  soma(ev){
    if(this.total > 0){
      if(ev == 'atkP'){
        this.atkP += 1;
        this.total -=1;
      }
      else if(ev == 'intP'){
        this.intP += 1;
        this.total -=1;
      }
      else{
        this.heP += 1;
        this.total -=1;
      }
    }
  }

  sub(ev){
    if(this.total < 30){
      if(ev == 'atkP' && this.atkP > 0){
        this.atkP -= 1;
        this.total +=1;
      }
      else if(ev == 'intP' && this.intP > 0){
        this.intP -= 1;
        this.total +=1;
      }
      else if(ev == 'heP' && this.heP > 0){
        this.heP -= 1;
        this.total +=1;
      }
    }
  }

  //create char
  createChar(nameP:string, contentChar){
    this.sign.newChar(nameP, this.atkP, this.intP, this.heP).subscribe((x) => {
        if (x['code'] == 200 ){
          this.created = 1;
          console.log('sucesso no registo personagem');
          this.modalService.dismissAll(contentChar);

          //define weapon none
          //get localStorage userInfo
          this.charInfoObj = localStorage.getItem('userInfo');
          this.charInfoObjParse = JSON.parse(this.charInfoObj);

          //define charWeapon
          localStorage.setItem("charWeapon"+this.charInfoObjParse.id, 'none');

          window.location.reload();
        }else{
          this.errChar = true;
        }
      }
      );
  }

  //getAllWeapons
  allWeapon(){
    this.char.getAllWeapons().subscribe((x) => {
      if(x['code'] == 200){

        for (let i = 0; i < x['data'].Armas.length; i++) {
          if(x['data'].Armas[i].TipoDeArma == 'sw'){
            this.tpSW = true;
          }
          else if(x['data'].Armas[i].TipoDeArma == 'bw'){
            this.tpBW = true;
          }
          else{
            this.tpFK = true;
          }
        }
      }
      else{
        console.log('Erro get armas');
      }
    });
  }

  //buy weapon
  buyWeap(weap){
    if(weap == 'sword' && this.coins >= 1500){
      this.nomeA = 'Sword';
      this.atkA = 30;
      this.tipo = 'sw';
      this.buyWeaponFunc();

      //get username from localstorage
      this.userInfoObj = localStorage.getItem('userInfo');
      this.userInfoObjParse = JSON.parse(this.userInfoObj);

      this.coins -= 1500;

      //define coins
      localStorage.setItem("userCoins"+this.userInfoObjParse['name'], this.coins.toString());
    }
    else if(weap == 'bow' && this.coins >= 3000){
      this.nomeA = 'Bow';
      this.atkA = 60;
      this.tipo = 'bw';
      this.buyWeaponFunc();

      //get username from localstorage
      this.userInfoObj = localStorage.getItem('userInfo');
      this.userInfoObjParse = JSON.parse(this.userInfoObj);

      this.coins -= 3000;

      //define coins
      localStorage.setItem("userCoins"+this.userInfoObjParse['name'], this.coins.toString());
    }
    else if(weap == 'fork' && this.coins >= 6000){
      this.nomeA = 'Fork';
      this.atkA = 100;
      this.tipo = 'fk';
      this.buyWeaponFunc();

      //get username from localstorage
      this.userInfoObj = localStorage.getItem('userInfo');
      this.userInfoObjParse = JSON.parse(this.userInfoObj);

      this.coins -= 6000;

      //define coins
      localStorage.setItem("userCoins"+this.userInfoObjParse['name'], this.coins.toString());
    }
  }

  buyWeaponFunc(){
    this.char.buyWeapon(this.nomeA, this.atkA, this.tipo).subscribe((x) => {
      if (x['code'] == 200 ){
        if(this.tipo == 'sw'){
          this.tpSW = true;
        }
        else if(this.tipo == 'bw'){
          this.tpBW = true;
        }
        else{
          this.tpFK = true;
        }
      }else{
        console.log('error criar arma');
      }
    }
    );
  }

  //equip weapon
  equipWeap(weap){
    this.weapon = weap;

    //get localStorage charInfo
    this.charInfoObj = localStorage.getItem('userInfo');
    this.charInfoObjParse = JSON.parse(this.charInfoObj);

    //set localstorage to char's weapon
    localStorage.setItem("charWeapon"+this.charInfoObjParse.id, weap);
  }

  //unequip weapon
  unEquip(){
    this.weapon = 'none';

    //get localStorage userInfo
    this.charInfoObj = localStorage.getItem('userInfo');
    this.charInfoObjParse = JSON.parse(this.charInfoObj);

    //set localstorage to char's weapon
    localStorage.setItem("charWeapon"+this.charInfoObjParse.id, 'none');
  }



  //open modal char
  openChar(contentChar) {
    this.modalService.open(contentChar);
  }

  //open modal store
  openStore(contentStore) {
    this.modalService.open(contentStore);
  }
}
