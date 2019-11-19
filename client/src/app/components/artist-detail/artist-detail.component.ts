import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { UserService } from '../../services/user.service';
import { ArtistService } from '../../services/artist.service';
import { AlbumService } from '../../services/album.service';
import { Artist } from '../../models/artist';
import { Album } from '../../models/album';

import { GLOBAL } from '../../services/global';
import { UploadService } from '../../services/upload.service';
import { globalAgent } from 'https';

@Component({
  selector: 'app-detail-edit',
  templateUrl: '../artist-detail/artist-detail.component.html',
  providers: [UserService,ArtistService,AlbumService]
})
export class ArtistDetailComponent implements OnInit {
  public titulo: string;
  public identity;
  public token;
  public url:string;
  public artist: Artist;
  public albums: Album[];
  public alertMessage:string;
  public isEdit ;
  public filesToUpload:Array<File>;
  public confirmado;
  public nextPage;
  public prevPage;
  public itemsPage = 3;


  constructor(
    private _route: ActivatedRoute,
    private _router: Router,
    private _userService: UserService,
    private _artistService: ArtistService,
    private _albumService: AlbumService){

      this.identity = this._userService.getIdentity();
      this.token = this._userService.getToken();
      this.url = GLOBAL.url;
      this.isEdit = true;
      this.nextPage = 1;
      this.prevPage = 1;
   }

  ngOnInit() {
    console.log('artist-edit.component.ts cargado');
    //llamar metodo api para sacar un artista en base a su ID
    this.getArtist();
  }
/*
  right(id){
    let page  = Number.parseInt(this.prevPage) + 1;

    this._router.navigate(['/artista', id, page]);
  }
  left(id){
    let page  = Number.parseInt(this.prevPage) - 1;
    if(page == 0){page = 1};
    this._router.navigate(['/artista', id, page]);
  }
  */
  getArtist(){
    this._route.params.forEach((params: Params)=>{
      let page = params['page'];

      if(!page){
        page = 1;
      }else{
        this.nextPage = Number.parseInt(page) + 1;

        this.prevPage = Number.parseInt(page) - 1;
        if(this.prevPage == 0){
          this.prevPage = 1;
        }
      }

      let id = params['id'];
      this._artistService.getArtist(this.token, id).subscribe(
        response => {
          if (!response.message){
            if(!response.artist){
              this.alertMessage = 'Error en la consulta' ;
              this._router.navigate(['/']);
            }else{
              this.artist = response.artist;
              //Albums del artista
              this._albumService.getAlbums(this.token, response.artist._id, page).subscribe(
                response => {
                  if (!response.message){
                    if(!response.albums){
                      this.alertMessage = 'Error en la consulta';
                    }else{
                      this.albums = response.albums;
                      console.log(this.albums);
                      if(response.total){
                        let paginas = Math.ceil(response.total/this.itemsPage);
                        if(Number.parseInt(this.nextPage) > paginas){
                          this.nextPage = 1;
                        }
                      }
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

onDeleteConfirm(id){
  this.confirmado = id;

}

onCancelAlbum(){
  this.confirmado = null;

}

onDeleteAlbum(id){

  this._albumService.deleteAlbum(this.token, id).subscribe(
    response => {
      if (!response.message){
        if(!response.album){
          this.alertMessage = 'Error en el servidor';
        }else{
          this.getArtist();
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

}
