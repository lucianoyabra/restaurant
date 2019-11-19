import { Component, OnInit } from '@angular/core';
import { Song } from '../../models/song';

import { GLOBAL } from '../../services/global';

@Component({
  selector: 'app-player',
  templateUrl: './player.component.html',
  styleUrls: ['./player.component.css']
})
export class PlayerComponent implements OnInit {
  public url:string;
  public song:Song;

  constructor() {
    this.url = GLOBAL.url;

   }

  ngOnInit() {
    console.log('Player-Cargado');
    var song = JSON.parse(localStorage.getItem('sound_song'));
    if(song){
      this.song = song;
    }else{
      this.song = new Song('','',null,'','');
    }

  }

}
