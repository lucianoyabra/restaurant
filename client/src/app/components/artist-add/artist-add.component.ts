import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { UserService } from '../../services/user.service';
import { ArtistService } from '../../services/artist.service';
import { Artist } from '../../models/artist';
import { GLOBAL } from '../../services/global';
import { globalAgent } from 'https';
import { ArtistEditComponent } from '../artist-edit/artist-edit.component';
import { UploadService } from '../../services/upload.service';

@Component({
  selector: 'app-artist-add',
  templateUrl: './artist-add.component.html',
  styleUrls: ['./artist-add.component.css'],
  providers: [UserService,ArtistService,UploadService]
})
export class ArtistAddComponent implements OnInit {
  public titulo: string;
  public identity;
  public token;
  public url:string;
  public artist: Artist;
  public alertMessage:string;
  public artistEdit: ArtistEditComponent;

  constructor(
    private _route: ActivatedRoute,
    private _router: Router,
    private _userService: UserService,
    private _artistService: ArtistService
  ) {
    this.titulo = "Crear nuevo Artista";
    this.identity = this._userService.getIdentity();
    this.token = this._userService.getToken();
    this.url = GLOBAL.url;
    this.artist = new Artist('','','');
   }

  ngOnInit() {
    console.log('artist-add.component.ts cargado');
  }

  onSubmit(){
    console.log(this.artist);
    this._artistService.addArtist(this.token,this.artist).subscribe(
      response=>{
        if (!response.message){
          if(!response.artist){
            this.alertMessage = 'Los datos no han sido actualizados' ;
          }else{
            this.artist = response.artist;
            this.alertMessage = 'Artista creado satisfactoriamente';
            this._router.navigate(['editar-artista', response.artist._id]);
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
  }
}
