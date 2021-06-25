import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { NgbModal, NgbModalConfig } from '@ng-bootstrap/ng-bootstrap';
import { Character } from 'src/app/classes/character';
import { GenObjects } from 'src/app/classes/gen-objects';
import { CharacterService } from 'src/app/services/character.service';

@Component({
  selector: 'app-arena',
  templateUrl: './arena.component.html',
  styleUrls: ['./arena.component.css']
})
export class ArenaComponent implements OnInit {

  constructor(config: NgbModalConfig, private modalService: NgbModal, private char: CharacterService, router: Router) {
    this.router = router;
    config.backdrop = 'static';
    config.keyboard = false;
  }

  ngOnInit(): void {
    this.refreshBackground();
    this.setPlayerChar();
    this.getRandomEnemy();
  }

  //views do modals
  @ViewChild('contentUpdateChar') contentUpdateChar : any;
  @ViewChild('contentWinChar') contentWinChar : any;

  //player char data
  name : string;
  atk : number;
  int : number;
  he : number;

  //oponent char data
  nameE : string;
  atkE : number;
  intE : number;
  heE : number;

  totalEnemy : number;
  totalPlayer : number;

  //get localHost charInfo
  charInfoObj : string;
  charInfoObjParse : Character;

  //battle variables
  charP : number = 0; //player
  charE : number = 0; //enemy -> random char
  randomS : number;
  roundTurn : number = 0; //if 0 playerTurn if 1 enemyTurn
  turnEnemyAtribute : number = 0; //number beteween 0-2 defines atk, int or he (atributes)
  turnAtk : number = 0; //atk power of the round
  turnDodge : number = 0; //dodge power of the round
  pointsUpdate : number = 0; //points to update
  usablePoints : number; //usable point will be the pointsUpdate
  usablePointsBase : number; //base to calculate update
  weapon : string;
  //define original char values
  atkIni : number;
  intIni : number;
  heIni : number;

  //define coins
  coins : number = 0;

  //localStorage userInfo
  userInfoObj : string;
  userInfoObjParse : GenObjects;

  //router
  router:Router;

  //special FORK
  special : boolean = false;

  //array enemies img's
  imgEn : string;
  arrayImgEn : Array<string> = ["../../../assets/img/en1.png","../../../assets/img/en2.png","../../../assets/img/en3.png","../../../assets/img/en4.png","../../../assets/img/en5.png"]

  //background imgs
  arrayBack : Array<any> = ['../../../assets/img/arena1.png', '../../../assets/img/arena2.png', '../../../assets/img/arena3.png', '../../../assets/img/arena4.png', '../../../assets/img/arena5.jpg'];
  backArena : string;
  random : number;

  setPlayerChar(){
    //get localStorage charInfo
    this.charInfoObj = localStorage.getItem('charInfo');
    this.charInfoObjParse = JSON.parse(this.charInfoObj);
    this.name = this.charInfoObjParse['name'];
    this.atk = this.charInfoObjParse['atk'];
    this.int = this.charInfoObjParse['int'];
    this.he = this.charInfoObjParse['vida'];
    //define original char values
    this.atkIni = Number(this.charInfoObjParse['atk']);
    this.intIni = Number(this.charInfoObjParse['int']);
    this.heIni = Number(this.charInfoObjParse['vida']);

    //define atribute's sum
    this.totalPlayer = this.atk + this.int + this.he;

    //get localStorage charInfo
    this.charInfoObj = localStorage.getItem('userInfo');
    this.charInfoObjParse = JSON.parse(this.charInfoObj);

    //define player weapon
    this.weapon = localStorage.getItem("charWeapon"+this.charInfoObjParse.id);

    //if weapon is sword
    if(this.weapon == 'fork'){
      this.special = true; //ativate btn special
    }

    //define coins
    //get username from localstorage
    this.userInfoObj = localStorage.getItem('userInfo');
    this.userInfoObjParse = JSON.parse(this.userInfoObj);

    //define coins
    this.coins = parseInt(localStorage.getItem("userCoins"+this.userInfoObjParse['name']));

    console.log(this.weapon);
  }

  //get random background
  refreshBackground(){
    this.random = Math.floor(Math.random() * this.arrayBack.length);
    this.backArena = this.arrayBack[this.random];
  }

  //get random enemy
  getRandomEnemy(){
    this.char.getCharEnemy().subscribe((x) => {
      if(x['code'] == 200){
        this.nameE = x['data'].Nome;
        this.atkE = x['data'].Atk;
        this.intE = x['data'].Int;
        this.heE = x['data'].Vida;

        //define atribute's sum
        this.totalEnemy = this.atkE + this.intE + this.heE;

        //if enemy way too strong (more then 3x) && if enemy wayy too weak (less 1/2 player atributes power) && cant play with yourself
        if(this.totalEnemy > this.totalPlayer * 3 || (this.totalPlayer / 2) > this.totalEnemy || this.name == this.nameE){
          this.getRandomEnemy(); //run function again
        }
        else{
          //enemy img
          this.random = Math.floor(Math.random() * this.arrayBack.length);
          this.imgEn = this.arrayImgEn[this.random];
        }

      }
      else{
        console.log('Erro get player');
        //this.status.style.display="none";
      }
    });
  }

  //----------------- START GAME ----------------------------
  //LETS GO!!!!!

  //start game
  startBattle(){
    //if charP == charE
    while(this.charP == this.charE){
      this.randomS = Math.floor(Math.random() * 100);
      this.charP = this.randomS;

      this.randomS = Math.floor(Math.random() * 100);
      this.charE = this.randomS;
    }

    //if charP > charE start player
    if(this.charP > this.charE){
      //playerRound -> id dos btns display
      this.displayPlayerRound();
    }
    else{ //else charP < charE -> enemy start (random guy)
      //playerRound -> id dos btns display
      this.displayEnemyRound();
    }
    console.log(this.charP);
    console.log(this.charE);
  }

  displayPlayerRound(){ //playerCoins
    if(this.he == 0){
      this.router.navigate(['/cave']);
    }
    else{
      this.roundTurn = 0;
      document.getElementById("playerRound").style.display="block";
      document.getElementById("startBattleBtn").style.display="none";
      document.getElementById("enemyRound").style.display="none";
    }
  }

  displayEnemyRound(){
    if(this.heE == 0){ //player win
      //calculate points para update character -> get lasts atributes of player
      this.pointsUpdate = Number(this.atkE) + Number(this.intE);
      this.pointsUpdate = Math.round((this.pointsUpdate/4)*0.25);

      //verify if the battle gave point to upgrade Char
      if(this.pointsUpdate > 0){
        //define origin values of char
        this.usablePoints = this.pointsUpdate; //define new usable points
        this.usablePointsBase = this.pointsUpdate; //define new usable points base
        this.coins += (this.pointsUpdate * 25); //num points * 25 -> coins

        //get username from localstorage
        this.userInfoObj = localStorage.getItem('userInfo');
        this.userInfoObjParse = JSON.parse(this.userInfoObj);

        //define coins
        localStorage.setItem("userCoins"+this.userInfoObjParse['name'], this.coins.toString());

        this.modalService.open(this.contentUpdateChar);
      }
      else{ //encaminha logo para a cave
        this.modalService.open(this.contentWinChar); //open modal Win but no upgrades
      }
    }
    else{
      this.roundTurn = 1;
      document.getElementById("enemyRound").style.display="block";
      document.getElementById("startBattleBtn").style.display="none";
      document.getElementById("playerRound").style.display="none";

      //delay 3 secs very nice effect
      setTimeout(() => {
        //random atribute (0->atk 1->int 2->he)
        this.randomS = Math.floor(Math.random() * 3);
        this.turnEnemyAtribute = this.randomS; //this is the atribute that the enemy is going to atack

        if(this.turnEnemyAtribute == 0){
          this.atkAtk(); //atack atk
        }
        else if(this.turnEnemyAtribute == 1){
          this.atkInt(); //atack int
        }
        else{
          this.atkHe(); //atack he
        }
        console.log(this.turnEnemyAtribute);
      }, 3000); //este 2000 vai ser random entre 2000 e 6000
    }
  }

  //--------- BATTLE ACTIONS --------------
  //atack Atk
  atkAtk(){
    //check if is player or enemy turn
    if(this.roundTurn == 0){ //player
      console.log('atacouuu ENEMY');

      //random atk
      this.randomS = Math.floor(Math.random() * this.atk) + 1;
      this.turnAtk = this.randomS;

      this.turnAtk = (this.turnAtk * 100) / this.atk;

      if(this.turnAtk > 85){
        console.log('recalc');
        //random atk -> porque saiu critical entao, random e o que sair fica
        this.randomS = Math.floor(Math.random() * this.atk) + 1;
        this.turnAtk = this.randomS; //final atk damage -> could by > 85% (critical, lucky you)
      }
      else{
        //turn % of damage in number
        if(this.weapon)
        this.turnAtk = (this.turnAtk * this.atk) / 100;
        this.turnAtk = Math.round(this.turnAtk);
      }

      //if weapon sword
      if(this.weapon == 'sword'){
        this.turnAtk = (this.turnAtk * 0,3) + this.turnAtk; //increses 30% hit power
      }
      else if(this.weapon == 'bow'){ //if weapon bow
        this.turnAtk = (this.turnAtk * 0,1) + this.turnAtk; //increses 10% hit power
      }

      //calculate dodge
      //random intE
      this.randomS = Math.floor(Math.random() * this.intE) + 1;
      this.turnDodge = this.randomS;

      //percent of dodge
      this.turnDodge = (this.turnDodge * 100) / this.intE;

      if(this.turnDodge > 85){
        console.log('recalc');
        //random intE -> porque saiu critical entao, random e o que sair fica
        this.randomS = Math.floor(Math.random() * this.intE) + 1;
        this.turnDodge = this.randomS; //final intE damage -> could by > 85% (critical, lucky you)
      }
      else{
        //turn % of dodge in number
        this.turnDodge = (this.turnDodge * this.intE) / 100;
        this.turnDodge = Math.round(this.turnDodge);
      }



      //calculate damage taken to enemy Atk atribute applying the dodge
      this.turnAtk = this.turnAtk - this.turnDodge;
      console.log(this.turnAtk);
      if(this.turnAtk > 0){ //if turnAtk > 0 atack atribute
        this.atkE = this.atkE - this.turnAtk;
      }

      //define enemy Atk atribute 0 if enemy Atk atribute < 0
      if(this.atkE < 0){
        this.atkE = 0;
      }

      //change game turn to enemy
      this.displayEnemyRound();
    }
    else{ //enemy
      console.log('atacouuu ENEMY');

      //random atk
      this.randomS = Math.floor(Math.random() * this.atkE) + 1;
      this.turnAtk = this.randomS;

      this.turnAtk = (this.turnAtk * 100) / this.atkE;

      if(this.turnAtk > 85){
        console.log('recalc');
        //random atk -> porque saiu critical entao, random e o que sair fica
        this.randomS = Math.floor(Math.random() * this.atkE) + 1;
        this.turnAtk = this.randomS; //final atk damage -> could by > 85% (critical, lucky you)
      }
      else{
        //turn % of damage in number
        this.turnAtk = (this.turnAtk * this.atkE) / 100;
        this.turnAtk = Math.round(this.turnAtk);
      }

      //calculate dodge
      //random intE
      this.randomS = Math.floor(Math.random() * this.int) + 1;
      this.turnDodge = this.randomS;

      //percent of dodge
      this.turnDodge = (this.turnDodge * 100) / this.int;

      if(this.turnDodge > 85){
        console.log('recalc');
        //random intE -> porque saiu critical entao, random e o que sair fica
        this.randomS = Math.floor(Math.random() * this.int) + 1;
        this.turnDodge = this.randomS; //final intE damage -> could by > 85% (critical, lucky you)
      }
      else{
        //turn % of dodge in number
        this.turnDodge = (this.turnDodge * this.int) / 100;
        this.turnDodge = Math.round(this.turnDodge);
      }



      //calculate damage taken to enemy Atk atribute applying the dodge
      this.turnAtk = this.turnAtk - this.turnDodge;
      console.log(this.turnAtk);
      if(this.turnAtk > 0){ //if turnAtk > 0 atack atribute
        this.atk = this.atk - this.turnAtk;
      }

      //define enemy Atk atribute 0 if enemy Atk atribute < 0
      if(this.atk < 0){
        this.atk = 0;
      }

      //change game turn to enemy
      this.displayPlayerRound();
    }

  }

  //atack Int
  atkInt(){
    //check if is player or enemy turn
    if(this.roundTurn == 0){ //player
      console.log('atacouuu int');

      //random atk
      this.randomS = Math.floor(Math.random() * this.atk) + 1;
      this.turnAtk = this.randomS;

      this.turnAtk = (this.turnAtk * 100) / this.atk;

      if(this.turnAtk > 85){
        console.log('recalc');
        //random atk -> porque saiu critical entao, random e o que sair fica
        this.randomS = Math.floor(Math.random() * this.atk) + 1;
        this.turnAtk = this.randomS; //final int damage -> could by > 85% (critical, lucky you)
      }
      else{
        //turn % of damage in number
        this.turnAtk = (this.turnAtk * this.atk) / 100;
        this.turnAtk = Math.round(this.turnAtk);
      }

      //if weapon sword
      if(this.weapon == 'sword'){
        this.turnAtk = (this.turnAtk * 0,3) + this.turnAtk; //increses 30% hit power
      }
      else if(this.weapon == 'bow'){ //if weapon bow
        this.turnAtk = (this.turnAtk * 0,1) + this.turnAtk; //increses 10% hit power
      }

      //calculate dodge
      //random intE
      this.randomS = Math.floor(Math.random() * this.intE) + 1;
      this.turnDodge = this.randomS;

      //percent of dodge
      this.turnDodge = (this.turnDodge * 100) / this.intE;

      if(this.turnDodge > 85){
        console.log('recalc');
        //random intE -> porque saiu critical entao, random e o que sair fica
        this.randomS = Math.floor(Math.random() * this.intE) + 1;
        this.turnDodge = this.randomS; //final intE damage -> could by > 85% (critical, lucky you)
      }
      else{
        //turn % of dodge in number
        this.turnDodge = (this.turnDodge * this.intE) / 100;
        this.turnDodge = Math.round(this.turnDodge);
      }

      //calculate damage taken to enemy IntE atribute applying the dodge
      this.turnAtk = this.turnAtk - this.turnDodge;
      console.log(this.turnAtk);
      if(this.turnAtk > 0){ //if turnAtk > 0 atack atribute
        this.intE = this.intE - this.turnAtk;
      }

      //define enemy Int atribute 0 if enemy Int atribute < 0
      if(this.intE < 0){
        this.intE = 0;
      }

      //change game turn to enemy
      this.displayEnemyRound();
    }
    else{ //enemy
      console.log('atacouuu int ENEMY');

      //random atk
      this.randomS = Math.floor(Math.random() * this.atkE) + 1;
      this.turnAtk = this.randomS;

      this.turnAtk = (this.turnAtk * 100) / this.atkE;

      if(this.turnAtk > 85){
        console.log('recalc');
        //random atk -> porque saiu critical entao, random e o que sair fica
        this.randomS = Math.floor(Math.random() * this.atkE) + 1;
        this.turnAtk = this.randomS; //final int damage -> could by > 85% (critical, lucky you)
      }
      else{
        //turn % of damage in number
        this.turnAtk = (this.turnAtk * this.atkE) / 100;
        this.turnAtk = Math.round(this.turnAtk);
      }

      //calculate dodge
      //random intE
      this.randomS = Math.floor(Math.random() * this.int) + 1;
      this.turnDodge = this.randomS;

      //percent of dodge
      this.turnDodge = (this.turnDodge * 100) / this.int;

      if(this.turnDodge > 85){
        console.log('recalc');
        //random intE -> porque saiu critical entao, random e o que sair fica
        this.randomS = Math.floor(Math.random() * this.int) + 1;
        this.turnDodge = this.randomS; //final intE damage -> could by > 85% (critical, lucky you)
      }
      else{
        //turn % of dodge in number
        this.turnDodge = (this.turnDodge * this.int) / 100;
        this.turnDodge = Math.round(this.turnDodge);
      }

      //calculate damage taken to enemy IntE atribute applying the dodge
      this.turnAtk = this.turnAtk - this.turnDodge;
      console.log(this.turnAtk);
      if(this.turnAtk > 0){ //if turnAtk > 0 atack atribute
        this.int = this.int - this.turnAtk;
      }

      //define enemy Int atribute 0 if enemy Int atribute < 0
      if(this.int < 0){
        this.int = 0;
      }

      //change game turn to enemy
      this.displayPlayerRound();
    }
  }

  //atack Health
  atkHe(){
    //check if is player or enemy turn
    if(this.roundTurn == 0){ //player
      console.log('atacouuu int');

      //random atk
      this.randomS = Math.floor(Math.random() * this.atk) + 1;
      this.turnAtk = this.randomS;

      this.turnAtk = (this.turnAtk * 100) / this.atk;

      if(this.turnAtk > 85){
        console.log('recalc');
        //random atk -> porque saiu critical entao, random e o que sair fica
        this.randomS = Math.floor(Math.random() * this.atk) + 1;
        this.turnAtk = this.randomS; //final int damage -> could by > 85% (critical, lucky you)
      }
      else{
        //turn % of damage in number
        this.turnAtk = (this.turnAtk * this.atk) / 100;
        this.turnAtk = Math.round(this.turnAtk);
      }

      //if weapon sword
      if(this.weapon == 'sword'){
        this.turnAtk = (this.turnAtk * 0,3) + this.turnAtk; //increses 30% hit power
      }
      else if(this.weapon == 'bow'){ //if weapon bow
        this.turnAtk = (this.turnAtk * 0,1) + this.turnAtk; //increses 10% hit power
      }

      //calculate dodge
      //random intE
      this.randomS = Math.floor(Math.random() * this.intE) + 1;
      this.turnDodge = this.randomS;

      //percent of dodge
      this.turnDodge = (this.turnDodge * 100) / this.intE;

      if(this.turnDodge > 85){
        console.log('recalc');
        //random intE -> porque saiu critical entao, random e o que sair fica
        this.randomS = Math.floor(Math.random() * this.intE) + 1;
        this.turnDodge = this.randomS; //final intE damage -> could by > 85% (critical, lucky you)
      }
      else{
        //turn % of dodge in number
        this.turnDodge = (this.turnDodge * this.intE) / 100;
        this.turnDodge = Math.round(this.turnDodge);
      }



      //calculate damage taken to enemy He atribute
      this.turnAtk = this.turnAtk - this.turnDodge;
      console.log(this.turnAtk);
      if(this.turnAtk > 0){ //if turnAtk > 0 atack atribute
        this.heE = this.heE - this.turnAtk;
      }

      //define enemy He atribute 0 if enemy He atribute < 0
      if(this.heE < 0){
        this.heE = 0;
      }

      //change game turn to enemy
      this.displayEnemyRound();
    }
    else{ //enemy
      console.log('atacouuu he ENEMY');

      //random atk
      this.randomS = Math.floor(Math.random() * this.atkE) + 1;
      this.turnAtk = this.randomS;

      this.turnAtk = (this.turnAtk * 100) / this.atkE;

      if(this.turnAtk > 85){
        console.log('recalc');
        //random atk -> porque saiu critical entao, random e o que sair fica
        this.randomS = Math.floor(Math.random() * this.atkE) + 1;
        this.turnAtk = this.randomS; //final int damage -> could by > 85% (critical, lucky you)
      }
      else{
        //turn % of damage in number
        this.turnAtk = (this.turnAtk * this.atkE) / 100;
        this.turnAtk = Math.round(this.turnAtk);
      }

      //calculate dodge
      //random intE
      this.randomS = Math.floor(Math.random() * this.int) + 1;
      this.turnDodge = this.randomS;

      //percent of dodge
      this.turnDodge = (this.turnDodge * 100) / this.int;

      if(this.turnDodge > 85){
        console.log('recalc');
        //random intE -> porque saiu critical entao, random e o que sair fica
        this.randomS = Math.floor(Math.random() * this.int) + 1;
        this.turnDodge = this.randomS; //final intE damage -> could by > 85% (critical, lucky you)
      }
      else{
        //turn % of dodge in number
        this.turnDodge = (this.turnDodge * this.int) / 100;
        this.turnDodge = Math.round(this.turnDodge);
      }


      //if PLAYER EQUIPED WITH BOW
      if(this.weapon == 'bow'){
        this.randomS = Math.floor(Math.random() * (50 - 20 + 1) + 20); //percent of regen
        this.randomS = (this.randomS * 100) / 100; //he regen int

        //calculate damage taken from enemy He atribute
        this.turnAtk = this.turnAtk - this.turnDodge - this.randomS; // sub reg int
        console.log('regen');
      }
      else{
        //calculate damage taken to enemy He atribute
        this.turnAtk = this.turnAtk - this.turnDodge;
      }

      console.log(this.turnAtk);
      if(this.turnAtk > 0){ //if turnAtk > 0 atack atribute
        this.he = this.he - this.turnAtk;
      }

      //define enemy He atribute 0 if enemy He atribute < 0
      if(this.he < 0){
        this.he = 0;
      }

      //change game turn to enemy
      this.displayPlayerRound();
    }
  }

  //special atack
  specialAtk(){

    //random atribute (0->atk 1->int 2->he)
    this.randomS = Math.floor(Math.random() * 3);
    this.turnEnemyAtribute = this.randomS; //this is the atribute that the special is going to atack

    //random atk (between max atk power and half of that value)
    this.randomS = Math.floor(Math.random() * (this.atk - (this.atk / 2) + 1)) + (this.atk / 2);
    this.turnAtk = this.randomS;

    this.turnAtk = this.turnAtk * 2; //duplica o ataque

    //calculate dodge
    //random intE
    this.randomS = Math.floor(Math.random() * this.intE) + 1;
    this.turnDodge = this.randomS;

    //turn % of dodge in number
    this.turnDodge = (this.turnDodge * this.intE) / 100;
    this.turnDodge = Math.round(this.turnDodge);

    //percent of dodge
    this.turnDodge = (this.turnDodge * 100) / this.intE;

    //calculate damage taken to enemy He atribute
    this.turnAtk = this.turnAtk - this.turnDodge;


    //decide which atribute to atack
    if(this.turnEnemyAtribute == 0){
      if(this.turnAtk > 0){ //if turnAtk > 0 atack atribute
        this.atkE = this.atkE - this.turnAtk;
      }

      //define enemy He atribute 0 if enemy He atribute < 0
      if(this.atkE < 0){
        this.atkE = 0;
      }
    }
    else if(this.turnEnemyAtribute == 1){
      if(this.turnAtk > 0){ //if turnAtk > 0 atack atribute
        this.intE = this.intE - this.turnAtk;
      }

      //define enemy He atribute 0 if enemy He atribute < 0
      if(this.intE < 0){
        this.intE = 0;
      }
    }
    else{
      if(this.turnAtk > 0){ //if turnAtk > 0 atack atribute
        this.heE = this.heE - this.turnAtk;
      }

      //define enemy He atribute 0 if enemy He atribute < 0
      if(this.heE < 0){
        this.heE = 0;
      }
    }

    console.log('speeeeecial: ' + this.turnAtk);
    this.special = false;
    //change game turn to enemy
    this.displayEnemyRound();
  }

  soma(ev){
    if(this.usablePoints > 0){
      if(ev == 'atk'){
        this.atkIni += 1;
        this.usablePoints -=1;
      }
      else if(ev == 'int'){
        this.intIni += 1;
        this.usablePoints -=1;
      }
      else{
        this.heIni += 1;
        this.usablePoints -=1;
      }
    }
  }

  //upgrade Char
  upgreadeChar(contentUpdateChar){
    //set char id
    this.charInfoObj = localStorage.getItem('charInfo');
    this.charInfoObjParse = JSON.parse(this.charInfoObj);

    this.char.upgrade(this.name, this.atkIni, this.intIni, this.heIni, this.charInfoObjParse.id).subscribe((x) => {
      if (x['code'] == 200 ){
        this.router.navigate(['/cave']);
        console.log('sucesso no upgrade personagem');
        console.log(x);
        this.modalService.dismissAll(contentUpdateChar);
      }else{
        console.log('erro registo personagem');
      }
    }
    );
  }

  //close modal
  closeModal(contentWinChar){
    this.modalService.dismissAll(contentWinChar);
  }
}
