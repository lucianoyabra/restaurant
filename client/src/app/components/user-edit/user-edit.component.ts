import { Component, OnInit } from '@angular/core';
import { UserService } from '../../services/user.service';
import { User } from '../../models/user';
import { resolve } from 'url';
import { GLOBAL } from '../../services/global';

@Component({
  selector: 'app-user-edit',
  templateUrl: './user-edit.component.html',
  providers: [ UserService ]
})
export class UserEditComponent implements OnInit {
  public titulo: string;
  public user: User;
  public identity;
  public token;
  public alertMessage;
  public fileToUpload: Array<File>;
  public url: string;

  constructor(private _userService: UserService) {
    this.titulo = 'Actualizar mis datos';
    this.identity = this._userService.getIdentity();
    this.token = this._userService.getToken();
    this.user = this.identity;
    this.url = GLOBAL.url;
  }

  ngOnInit() {

    console.log('usert-edit.component.ts cargado');
  }

   onSubmit(){
    this._userService.updateUser(this.user).subscribe(
      response => {
        if (!response.message){
          if(!response.user){
            this.alertMessage = 'Los datos no han sido actualizados' ;
          }else{
            //this.user = response.user;
            localStorage.setItem('identity', JSON.stringify(this.user));
            document.getElementById("identity_name").innerHTML = this.user.name + ' ' + this.user.surname;
            if(!this.fileToUpload){
              //redireccion
            }else{
              this.makeFileRequest(this.url + 'upload-image-user/' + this.user._id, [], this.fileToUpload).then(
                (result:any) => {
                  this.user.image = result.image;
                  localStorage.setItem('identity', JSON.stringify(this.user));
                  let imagePath = this.url + 'get-image-user/' + this.user.image;
                  document.getElementById('image-logged').setAttribute('src',imagePath)
                }
              );
            }


            this.alertMessage = 'Datos actualizados correctamente' ;
          }
        }else{
        this.alertMessage = response.message;
      }
    },
      error => {
        var errorMensaje = <any>error;
        if(errorMensaje != null){
          var body = JSON.parse(error._body);
          this.alertMessage = body.message;
          console.log(error);
        }
      }
    );
  }

  fileChangeEvent(fileInput: any){
    this.fileToUpload = <Array<File>>fileInput.target.files;

  }

  makeFileRequest(url: string, params: Array<string>, files: Array<File>){
    var token = this.token;
    return new Promise(function(resolve, reject){
      var formData:any = new FormData();
      var xhr = new XMLHttpRequest();

      for(var i = 0; i< files.length; i++){
        formData.append('image', files[i], files[i].name);
        xhr.onreadystatechange = function(){
          if(xhr.readyState == 4){
            if(xhr.status == 200){
              resolve(JSON.parse(xhr.response));
            }else{
              reject(xhr.response);
            }
          }
        }
      }
      xhr.open('POST',url, true);
      xhr.setRequestHeader('Authorization',token);
      xhr.send(formData);
    });
  }
}
