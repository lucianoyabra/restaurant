import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { UserService } from '../../services/user.service';
import { Album } from '../../models/album';
import { Artist } from '../../models/artist';
import { GLOBAL } from '../../services/global';

import { ArtistService } from '../../services/artist.service';
import { AlbumService } from '../../services/album.service';
import { UploadService } from '../../services/upload.service';
import { globalAgent } from 'https';

@Component({
  selector: 'app-album-edit',
  templateUrl: '../album-add/album-add.component.html',
  providers: [UserService,AlbumService,UploadService,ArtistService]
})
export class AlbumEditComponent implements OnInit {
  public titulo: string;
  public identity;
  public token;
  public url:string;
  public alertMessage:string;
  public isEdit;
  public filesToUpload:Array<File>;
  public album: Album;
  public artist:Artist;


  constructor(
    private _route: ActivatedRoute,
    private _router: Router,
    private _userService: UserService,
    private _albumService: AlbumService,
    private _uploadService: UploadService,
    private _artistService: ArtistService){
      this.titulo = "Editar Album ";
      this.identity = this._userService.getIdentity();
      this.token = this._userService.getToken();
      this.url = GLOBAL.url;
      this.album = new Album('','',2019,'','');
      this.isEdit = true;

   }

  ngOnInit() {
    //conseguir el album
    this.getAlbum();
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
  getAlbum(){
    this._route.params.forEach((params:Params)=>{
      let id = params['id'];
      //this.album.artist = id;
      this._albumService.getAlbum(this.token, id).subscribe(
        response=>{
          if (!response.message){
            if(!response.album){
              this.alertMessage = 'Error en el servidor' ;
              this._router.navigate(['/']);
            }else{
              this.album = response.album;
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
    console.log(this.album);

  }
  onSubmit(){
    this._route.params.forEach((params:Params)=>{
      let id = params['id'];
      //this.album.artist = id;
      this._albumService.editAlbum(this.token, id ,this.album).subscribe(
        response=>{
          if (!response.message){
            if(!response.album){
              this.alertMessage = 'Error en el servidor';
            }else{
              this.alertMessage = 'Album editado satisfactoriamente';
              //Subir la imagen
              if (!this.filesToUpload) {
                this._router.navigate(['/artista', response.album.artist]);
              } else {
                this._uploadService.makeFileRequest(this.url + 'upload-image-album/' + id,
                [],this.filesToUpload,this.token,'image').then(
                  (result) => {
                    this._router.navigate(['/artista', response.album.artist]);
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
    console.log(this.album);
  }

  fileSaveEvent(fileInput:any){
    this.filesToUpload = <Array<File>>fileInput.target.files;
  }

}
