import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { UserService } from '../../services/user.service';
import { SongService } from '../../services/song.service';
import { Song } from '../../models/song';
import { Album } from '../../models/album';
import { GLOBAL } from '../../services/global';

import { AlbumService } from '../../services/album.service';
import { globalAgent } from 'https';

@Component({
  selector: 'app-song-add',
  templateUrl: '../song-add/song-add.component.html',
  providers: [UserService,SongService,AlbumService]
})
export class SongAddComponent implements OnInit {
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
    private _albumService: AlbumService){
      this.titulo = "Agregar Canción";
      this.identity = this._userService.getIdentity();
      this.token = this._userService.getToken();
      this.url = GLOBAL.url;
      this.song = new Song('','',null,'','');

   }

  ngOnInit() {
    console.log('song-add.component.ts cargado');
    this.getAlbum();
  }

  getAlbum(){
    this._route.params.forEach((params:Params)=>{
      let id = params['album'];
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
    console.log(this.song);

    this._route.params.forEach((params:Params)=>{
      let album_id = params['album'];
      this.song.album = album_id;
      this._songService.addSong(this.token, this.song).subscribe(
        response=>{
          if (!response.message){
            if(!response.song){
              this.alertMessage = 'Error en el servidor' ;
            }else{
              this.alertMessage = 'Cancion agregada satisfactoriamente';
              this._router.navigate(['editar-cancion', response.song._id]);
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

