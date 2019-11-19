import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { UserService } from '../../services/user.service';
import { SongService } from '../../services/song.service';
import { Song } from '../../models/song';
import { Album } from '../../models/album';
import { GLOBAL } from '../../services/global';

import { AlbumService } from '../../services/album.service';
import { globalAgent } from 'https';
import { UploadService } from 'app/services/upload.service';

@Component({
  selector: 'app-song-edit',
  templateUrl: '../song-add/song-add.component.html',
  providers: [UserService,SongService,AlbumService,UploadService]
})
export class SongEditComponent implements OnInit {
  public titulo: string;
  public identity;
  public token;
  public url:string;
  public alertMessage:string;
  public isEdit ;
  public filesToUpload:Array<File>;
  public song: Song;
  public album: Album;


  constructor(
    private _route: ActivatedRoute,
    private _router: Router,
    private _userService: UserService,
    private _songService: SongService,
    private _albumService: AlbumService,
    private _uploadService: UploadService){
      this.titulo = "Editar Canción";
      this.identity = this._userService.getIdentity();
      this.token = this._userService.getToken();
      this.url = GLOBAL.url;
      this.song = new Song('','',null,'','');
      this.isEdit = true;

   }

  ngOnInit() {
    console.log('song-edit.component.ts cargado');
    this.getSong();

  }

  getAlbum(albumId){
    this._route.params.forEach((params:Params)=>{
      let id = albumId;
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

  getSong(){
    this._route.params.forEach((params:Params)=>{
      let id = params['song'];
      //this.album.artist = id;
      this._songService.getSong(this.token, id).subscribe(
        response=>{
          if (!response.message){
            if(!response.song){
              this.alertMessage = 'Error en el servidor' ;
              this._router.navigate(['/']);
            }else{
              this.song = response.song;
              this.getAlbum(response.song.album._id);
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
    console.log(this.song);

    this._route.params.forEach((params:Params)=>{
      let song_id = params['song'];

      this._songService.editSong(this.token, song_id ,this.song).subscribe(
        response=>{
          if (!response.message){
            if(!response.song){
              this.alertMessage = 'Error en el servidor' ;
            }else{
              this.alertMessage = 'Cancion editada satisfactoriamente';
              // SUBIR FICHERO DE AUDIO
              //Subir la imagen
              if (!this.filesToUpload) {
                this._router.navigate(['/album', this.song.album]);
              } else {
                this._uploadService.makeFileRequest(this.url + 'upload-song-file/' + song_id,
                [],this.filesToUpload,this.token,'file').then(
                  (result) => {
                    this._router.navigate(['/album', response.song.album]);
                  },(error) => {
                    console.log(error);
                  }
                );
              }
              //this._router.navigate(['editar-song', response.album._id]);
            }
          }else{
            this.song = response.song;
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

