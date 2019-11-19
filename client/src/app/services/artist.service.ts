import { Injectable } from '@angular/core';
import { Http, Response, Headers, RequestOptions } from '@angular/http';
import 'rxjs/add/operator/map';
import { Observable } from 'rxjs/Observable';
import { GLOBAL } from './global';
import { jsonpFactory } from '@angular/http/src/http_module';
import { Artist } from 'app/models/artist';

@Injectable()
export class ArtistService{

  public url: string;

  constructor(private _http: Http){
    this.url = GLOBAL.url;
  }

  addArtist(token, artist: Artist){
    let params = JSON.stringify(artist);
    let headers = new Headers({
      'content-type':'application/json',
      'authorization': token
    });
    return this._http.post(this.url + 'artist', params, {headers:headers}).map(res=>res.json());
  }

  getArtists(token, pagina){
    let headers = new Headers({
      'content-type':'application/json',
      'authorization': token
    });
    let options = new RequestOptions({headers:headers});
    return this._http.get(this.url + 'artists/' + pagina, options).map(res=> res.json());
  }

  getArtist(token, id:string){
    let headers = new Headers({
      'content-type':'application/json',
      'authorization': token
    });
    let options = new RequestOptions({headers:headers});
    return this._http.get(this.url + 'artist/' + id, options).map(res=> res.json());
  }

  editArtist(token, id:string ,artist: Artist){
    let params = JSON.stringify(artist);
    let headers = new Headers({
      'content-type':'application/json',
      'authorization': token
    });
    return this._http.put(this.url + 'artist/' + id, params, {headers:headers}).map(res=>res.json());
  }

  deleteArtist(token, id: string){
    let headers = new Headers({
      'content-type':'application/json',
      'authorization': token
    });
    let options = new RequestOptions({headers:headers});
    return this._http.delete(this.url + 'deleteArtist/' + id, options).map(res=> res.json());
  }

}
