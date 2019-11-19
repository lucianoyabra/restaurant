import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { UserService } from '../../services/user.service';
import { ArtistService } from '../../services/artist.service';
import { Artist } from '../../models/artist';
import { GLOBAL } from '../../services/global';
import { UploadService } from '../../services/upload.service';
import { globalAgent } from 'https';

@Component({
  selector: 'app-artist-edit',
  templateUrl: '../artist-add/artist-add.component.html',
  providers: [UserService,ArtistService,UploadService]
})
export class ArtistEditComponent implements OnInit {
  public titulo: string;
  public identity;
  public token;
  public url:string;
  public artist: Artist;
  public alertMessage:string;
  public isEdit ;
  public filesToUpload:Array<File>;


  constructor(
    private _route: ActivatedRoute,
    private _router: Router,
    private _userService: UserService,
    private _artistService: ArtistService,
    private _uploadService: UploadService){
      this.titulo = "Editar Artista";
      this.identity = this._userService.getIdentity();
      this.token = this._userService.getToken();
      this.url = GLOBAL.url;
      this.artist = new Artist('','','');
      this.isEdit = true;
   }

  ngOnInit() {
    console.log('artist-edit.component.ts cargado');
    //llamar metodo api para sacar un artista en base a su ID
    this.getArtist();
  }

  getArtist(){
    this._route.params.forEach((params: Params)=>{
      let id = params['id'];
      this._artistService.getArtist(this.token, id).subscribe(
        response => {
          if (!response.message){
            if(!response.artist){
              this.alertMessage = 'Error en la consulta' ;
              this._router.navigate(['/']);
            }else{
              this.artist = response.artist;
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
  });
}


onSubmit(){
  this._route.params.forEach((params: Params)=>{
  let id = params['id'];
    this._artistService.editArtist(this.token,id ,this.artist).subscribe(
      response=>{
        if (!response.message){
          if(!response.artist){
            this.alertMessage = 'Error en el servidor' ;
          }else{
            this.alertMessage = 'Artista editado satisfactoriamente';
            //Subir la imagen del artista
            if (!this.filesToUpload) {
              this._router.navigate(['/artista',response.artist._id]);
            } else {
              this._uploadService.makeFileRequest(this.url + 'upload-image-artist/' + id,
              [],this.filesToUpload,this.token,'image').then(
                (result) => {
                  this._router.navigate(['/artistas', 1]);
                },(error) => {
                  console.log(error);
                }
              );
            }

          }
        }else{
          this.alertMessage = response.message;
          }

      },
      error =>{
        var errorMensaje = <any>error;
        if(errorMensaje != null){
          var body = JSON.parse(error._body);
          this.alertMessage = body.message;
          console.log(error);
        }
      }
    );
  });
}

fileSaveEvent(fileInput:any){
  this.filesToUpload = <Array<File>>fileInput.target.files;
}
}
