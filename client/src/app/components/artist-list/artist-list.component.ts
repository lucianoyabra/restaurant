import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { UserService } from '../../services/user.service';
import { Artist } from '../../models/artist';
import { GLOBAL } from '../../services/global';
import { ArtistService } from '../../services/artist.service';
import { globalAgent } from 'https';

@Component({
  selector: 'app-artist-list',
  templateUrl: './artist-list.component.html',
  styleUrls: ['./artist-list.component.css'],
  providers: [UserService, ArtistService]
})
export class ArtistListComponent implements OnInit {
  public titulo: string;
  public artists: Artist[];
  public identity;
  public token;
  public url:string;
  public nextPage;
  public prevPage;
  private alertMessage;
  public confirmado;
  public itemsPage = 3;


  constructor(
    private _route: ActivatedRoute,
    private _router: Router,
    private _userService: UserService,
    private _artistService: ArtistService
  ) {
    this.titulo = "Artistas";
    this.identity = this._userService.getIdentity();
    this.token = this._userService.getToken();
    this.url = GLOBAL.url;
    this.nextPage = 1;
    this.prevPage = 1;
   }

  ngOnInit() {
    console.log('artist-list.component.ts cargado');
    this.getArtists();
  }



getArtists(){
  this._route.params.forEach((params: Params)=>{
    let page = +params['page'];
    if(!page){
      page = 1;
    }else{
      this.nextPage = page + 1;
      this.prevPage = page - 1;
      if(this.prevPage == 0){
        this.prevPage = 1;
      }
    }
    this._artistService.getArtists(this.token, page).subscribe(
      response => {
        if (!response.message){
          if(!response.artists){
            this.alertMessage = 'Error en el servidor' ;
            this._router.navigate(['/']);
          }else{
            this.artists = response.artists;
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

onCancelArtist(){
  this.confirmado = null;
}

onDeleteArtist(id){
  this._artistService.deleteArtist(this.token,id).subscribe(
    response=>{
      if (!response.message){
        if(!response.artist){
          this.alertMessage = 'Error en el servidor' ;
        }else{
          this.getArtists();
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

}
