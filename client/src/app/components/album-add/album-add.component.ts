import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { UserService } from '../../services/user.service';
import { ArtistService } from '../../services/artist.service';
import { Artist } from '../../models/artist';
import { Album } from '../../models/album';
import { GLOBAL } from '../../services/global';

import { AlbumService } from '../../services/album.service';
import { globalAgent } from 'https';

@Component({
  selector: 'app-album-add',
  templateUrl: '../album-add/album-add.component.html',
  providers: [UserService,ArtistService,AlbumService]
})
export class AlbumAddComponent implements OnInit {
  public titulo: string;
  public identity;
  public token;
  public url:string;
  public artist: Artist;
  public alertMessage:string;
  public isEdit ;
  public filesToUpload:Array<File>;
  public album: Album;


  constructor(
    private _route: ActivatedRoute,
    private _router: Router,
    private _userService: UserService,
    private _artistService: ArtistService,
    private _albumService: AlbumService){
      this.titulo = "Crear nuevo Album ";
      this.identity = this._userService.getIdentity();
      this.token = this._userService.getToken();
      this.url = GLOBAL.url;
      this.album = new Album('','',2019,'','');

   }

  ngOnInit() {
    console.log('album-add.component.ts cargado');
    //llamar metodo api para sacar un artista en base a su ID
    this.getArtist();
  }

  getArtist(){
    this._route.params.forEach((params: Params)=>{
      let id = params['artist'];
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
    this._route.params.forEach((params:Params)=>{
      let artist_id = params['artist'];
      this.album.artist = artist_id;
      this._albumService.addAlbum(this.token, this.album).subscribe(
        response=>{
          if (!response.message){
            if(!response.album){
              this.alertMessage = 'Error en el servidor' ;
            }else{
              this.album = response.album;
              this.alertMessage = 'Album creado satisfactoriamente';
              this._router.navigate(['editar-album', response.album._id]);
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

}
