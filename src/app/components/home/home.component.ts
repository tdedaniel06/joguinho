import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NgbModalConfig, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { SignService } from 'src/app/services/sign.service';
import { GenObjects } from 'src/app/classes/gen-objects';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
  providers: [NgbModalConfig, NgbModal]
})
export class HomeComponent implements OnInit {

  constructor(config: NgbModalConfig, private modalService: NgbModal, private sign : SignService, router:Router) {
    this.router = router;
    // customize default values of modals used by this component tree
    config.backdrop = 'static';
    config.keyboard = false;
   }

  ngOnInit(): void {
  }

  userRegist : string;
  pwRegist : string;
  userLogin : string;
  pwLogin : string;

  router:Router;

  localUser : GenObjects;

  //erros
  errRegis : boolean = false;
  errLog : boolean = false;


  registar(userRegist:string, pwRegist:string, content){
      this.sign.regist(userRegist, pwRegist).subscribe((x) => {
        if (x['code'] == 200 ){

          //create localStorage coins saver
          localStorage.setItem("userCoins"+userRegist, "0");

          //create localStorage coins saver
          localStorage.setItem("userWeapon"+userRegist, "none");

          this.modalService.dismissAll(content);
        }else{
          this.errRegis = true;
        }
      }
      );
  }

  login(userLogin:string, pwLogin:string, content){
      this.sign.login(userLogin, pwLogin).subscribe((x) => {

        //remove users info/char localStorage
        localStorage.removeItem("userInfo");
        localStorage.removeItem("charInfo");

        this.localUser = new GenObjects(userLogin, pwLogin, x['data']); //definir class com os values
        localStorage.setItem("userInfo", JSON.stringify(this.localUser)); //save userInfo localStorage

        if (x['code'] == 200 ){
          this.router.navigate(['/cave']);
          console.log(x['data']);
          this.modalService.dismissAll(content);
        } else{
          this.errLog = true;
        }
      }
      );
  }

  //open modal regist
  open(content) {
    this.modalService.open(content);
  }

  //open modal login
  openLogin(contentLogin) {
    this.modalService.open(contentLogin);
  }
}
