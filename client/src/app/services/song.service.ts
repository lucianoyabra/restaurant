import { Injectable } from '@angular/core';
import { Http, Response, Headers, RequestOptions } from '@angular/http';
import 'rxjs/add/operator/map';
import { Observable } from 'rxjs/Observable';
import { GLOBAL } from './global';
import { jsonpFactory } from '@angular/http/src/http_module';
import { Album } from 'app/models/album';
import { Song } from 'app/models/song';


@Injectable()
export class SongService{

  public url: string;

  constructor(private _http: Http){
    this.url = GLOBAL.url;
  }

  getSong(token, id){

    let headers = new Headers({
      'content-type':'application/json',
      'authorization': token
    });

    let options = new RequestOptions( {headers:headers});

    return this._http.get(this.url + 'song/'+ id, options).map(res=>res.json());
  }

  deleteSong(token, id){

    let headers = new Headers({
      'content-type':'application/json',
      'authorization': token
    });

    let options = new RequestOptions( {headers:headers});

    return this._http.delete(this.url + 'song/'+ id, options).map(res=>res.json());
  }

  getSongs(token, albumId = null){

    let headers = new Headers({
      'content-type':'application/json',
      'authorization': token
    });

    let options = new RequestOptions( {headers:headers});

    if (albumId == null) {
      return this._http.get(this.url + 'songs', options).map(res=>res.json());
    } else {
      return this._http.get(this.url + 'songs/' + albumId, options).map(res=>res.json());
    }

  }

  editSong(token, id, song:Song){

    let headers = new Headers({
      'content-type':'application/json',
      'authorization': token
    });

    let options = new RequestOptions({headers:headers});

    return this._http.put(this.url + 'song/'+ id, song ,options).map(res=>res.json());
  }

  addSong(token, song:Song){
    let params = JSON.stringify(song);
    let headers = new Headers({
      'content-type':'application/json',
      'authorization': token
    });
    return this._http.post(this.url + 'song', params, {headers:headers}).map(res=>res.json());
  }

}
