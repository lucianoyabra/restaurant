import { Injectable } from '@angular/core';
import { Http, Response, Headers, RequestOptions } from '@angular/http';
import 'rxjs/add/operator/map';
import { Observable } from 'rxjs/Observable';
import { GLOBAL } from './global';
import { jsonpFactory } from '@angular/http/src/http_module';
import { Album } from 'app/models/album';

@Injectable()
export class AlbumService{

  public url: string;

  constructor(private _http: Http){
    this.url = GLOBAL.url;
  }

  getAlbum(token, id:string){
    let headers = new Headers({
      'content-type':'application/json',
      'authorization': token
    });
    let options = new RequestOptions({headers:headers});
    return this._http.get(this.url + 'album/' + id, options).map(res=> res.json());
  }

  deleteAlbum(token, id:string){
    let headers = new Headers({
      'content-type':'application/json',
      'authorization': token
    });
    let options = new RequestOptions({headers:headers});
    return this._http.delete(this.url + 'AlbumDelete/' + id, options).map(res=> res.json());
  }


  getAlbums(token, artistId = null, pagina){
    let headers = new Headers({
      'content-type':'application/json',
      'authorization': token
    });
    let options = new RequestOptions({headers:headers});

    if (artistId == null) {
      return this._http.get(this.url + 'albums/' , options).map(res=> res.json());
    } else {
      return this._http.get(this.url + 'albums/'+ artistId + '/' + pagina , options).map(res=> res.json());
    }


  }

  addAlbum(token, album:Album){
    let params = JSON.stringify(album);
    let headers = new Headers({
      'content-type':'application/json',
      'authorization': token
    });
    return this._http.post(this.url + 'album', params, {headers:headers}).map(res=>res.json());
  }

  editAlbum(token, id:string ,album:Album){
    let params = JSON.stringify(album);
    let headers = new Headers({
      'content-type':'application/json',
      'authorization': token
    });
    return this._http.put(this.url + 'albumUpdate/' + id, params, {headers:headers}).map(res=>res.json());
  }

}
