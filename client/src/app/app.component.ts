import { Component, OnInit } from '@angular/core';
import { UserService } from './services/user.service';
import { User } from './models/user';
import { GLOBAL } from './services/global';
import { Router, ActivatedRoute, Params } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  providers: [UserService]

})
export class AppComponent implements OnInit {
  public title = 'Musify';
  public user: User;
  public user_register: User;
  public identity;
  public token;
  public errorMessage;
  public alertRegister;
  public url:string;

  constructor(private _userService: UserService,
    private _route: ActivatedRoute,
    private _router: Router)
    {
    this.user =  new User('','','','','','ROLE_USER','');
    this.user_register =  new User('','','','','','ROLE_USER','');
    this.url = GLOBAL.url;
  }

  ngOnInit(){
    this.identity = this._userService.getIdentity();
    this.token = this._userService.getToken();
    console.log(this.identity);
    console.log(this.token);
  }

  public onSubmit3(){
    this._userService.try().subscribe(
      response => {
        let identity = response;
        console.log(identity);

      },error =>{
        console.log('error');
      });
  }

  public onSubmit(){

    this._userService.signUp(this.user).subscribe(
      response => {
        let identity = response.user;
        this.identity = identity;

        if(!this.identity._id){
          alert('El usuario no ha sido correctamente identificado');
        }else{
          //CREAR ELEMENTO EN EL LOCAL STORAGE PARA TENER AL USUARIO EN SESION
          localStorage.setItem('identity', JSON.stringify(identity));
           //CREAR ELEMENTO EN EL LOCAL STORAGE PARA TENER AL USUARIO EN SESION
           this._userService.signUp(this.user, 'true').subscribe(
            response => {
              let token = response.token;
              this.token = token;
              this.user_register = new User('','','','','','ROLE_USER','');

              if(this.token.lenght <= 0){
                alert('El token no se ha generado');
              }else{
                  //CREAR ELEMENTO EN EL LOCAL STORAGE PARA TENER AL token disponible
                  localStorage.setItem('token', token);
                  window.location.reload();
                  //console.log(token);
                  //console.log(identity);

              }

          }, error =>{
            var errorMensaje = <any>error;
            if(errorMensaje != null){
              var body = JSON.parse(error._body);
              this.errorMessage = body.message;
              console.log(error);
            }
          });

        }

    }, error =>{
      var errorMensaje = <any>error;
      if(errorMensaje != null){
        var body = JSON.parse(error._body);
        this.errorMessage = body.message;
        console.log(error);
      }
    });
  }

  onSubmitRegister(){
    console.log(this.user_register);
    this._userService.register(this.user_register).subscribe(
      response => {
        let user = response.user;
        this.user_register = user;
        let message = response.message;

        if (!message){
          if(!user._id){
            this.alertRegister = 'Error al registrarse';
          }else{
            this.alertRegister = 'El registro se ha realizado correctamente, identificate con '+ this.user_register.email;
            this.user_register = new User('','','','','','ROLE_USER','');
          }
        }else{
          this.alertRegister = message;
        }

    }, error =>{
      var errorMensaje = <any>error;
      if(errorMensaje != null){
        var body = JSON.parse(error._body);
        this.alertRegister = body.message;
        console.log(error);
      }
    }
    );
  }

  logOut(){
    localStorage.removeItem('identity');
    localStorage.removeItem('token');
    localStorage.clear();
    this.identity = null;
    this.token = null;
    this._router.navigate(['/']);
    window.location.reload();
  }

}
