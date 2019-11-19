import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { UserService } from '../../services/user.service';
import { ArtistService } from '../../services/artist.service';
import { Artist } from '../../models/artist';
import { Album } from '../../models/album';
import { Song } from '../../models/song';
import { GLOBAL } from '../../services/global';
import { PlayerComponent } from '../player/player.component';
import { SongService } from '../../services/song.service';
import { AlbumService } from '../../services/album.service';
import { globalAgent } from 'https';

@Component({
  selector: 'app-album-detail',
  templateUrl: './album-detail.component.html',
  providers: [UserService,ArtistService,AlbumService,SongService]
})
export class AlbumDetailComponent implements OnInit {
  public titulo: string;
  public identity;
  public token;
  public url:string;
  public artist: Artist;
  public alertMessage:string;
  public isEdit ;
  public filesToUpload:Array<File>;
  public album: Album;
  public songs: Song[];
  public confirmado;
  public player:PlayerComponent;

  constructor(
    private _route: ActivatedRoute,
    private _router: Router,
    private _userService: UserService,
    private _albumService: AlbumService,
    private _songService: SongService){
      this.titulo = "Detalle Album ";
      this.identity = this._userService.getIdentity();
      this.token = this._userService.getToken();
      this.url = GLOBAL.url;
      this.album = new Album('','',2019,'','');

   }

  ngOnInit() {
    console.log('album-detail.component.ts cargado');
    //Sacar Album de la bdd
    this.getAlbum();
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

              this._songService.getSongs(this.token, id).subscribe(
                response => {
                  if (!response.message){
                    if(!response.songs){
                      this.alertMessage = 'Error en la consulta';
                    }else{
                      this.songs = response.songs;
                      console.log(this.songs);
                    }
                  }else{
                    this.alertMessage = response.message;
                    }
                },error => {
                    var errorMensaje = <any>error;
                    if(errorMensaje != null){
                      var body = JSON.parse(error._body);
                      this.alertMessage = body.message;
                      console.log(error);
                  }
                }
              );



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

  onDeleteConfirm(id){
    this.confirmado = id;
  }

  onCancelSong(){
    this.confirmado = null;
  }

  onDeleteSong(id){

    this._songService.deleteSong(this.token, id).subscribe(
      response => {
        if (!response.message){
          if(!response.song){
            this.alertMessage = 'Error en la consulta';
          }else{
            this.getAlbum();
          }
        }else{
          this.alertMessage = response.message;
          }
      }
      ,error =>{
        var errorMensaje = <any>error;
        if(errorMensaje != null){
          var body = JSON.parse(error._body);
          this.alertMessage = body.message;
          console.log(error);
        }
      }
    );
  }

startPlayer(song){
  //this.player.song = song;
  let songPlayer = JSON.stringify(song);
  let filePath = this.url + 'get-song-file/'+ song.file;
  let imagePath = this.url + 'get-image-album/'+ song.album.image;

  localStorage.setItem('sound_song', songPlayer);
  document.getElementById('mp3-source').setAttribute('src',filePath);
  (document.getElementById('player') as any).load();
  (document.getElementById('player') as any).play();

  document.getElementById('player-song-title').innerHTML = song.name + ' - ';
  document.getElementById('player-song-artist').innerHTML = song.album.artist.name;
  document.getElementById('player-image-album').setAttribute("src", imagePath);


}

}
