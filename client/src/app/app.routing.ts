import { ModuleWithProviders } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

//Import User
import {UserEditComponent} from './components/user-edit/user-edit.component';

//Import Artist
import {ArtistListComponent} from './components/artist-list/artist-list.component';

//Import Home
import {HomeComponent} from './components/home/home.component';

//Import Home
import {ArtistAddComponent} from './components/artist-add/artist-add.component';

//Import Artist Edit
import { ArtistEditComponent } from './components/artist-edit/artist-edit.component';

//Import Artist detail
import { ArtistDetailComponent } from './components/artist-detail/artist-detail.component';

//Import Album add
import { AlbumAddComponent } from './components/album-add/album-add.component';

//Import Album edit
import { AlbumEditComponent } from './components/album-edit/album-edit.component';

//Import Album detail
import { AlbumDetailComponent } from './components/album-detail/album-detail.component';

//Import Song Add
import { SongAddComponent } from './components/song-add/song-add.component';

//Import Song Edit
import {SongEditComponent} from './components/song-edit/song-edit.component';

const appRoutes: Routes = [
  {path: '', component: HomeComponent},
  {path: 'artistas/:page', component: ArtistListComponent},
  {path: 'crear-artistas', component: ArtistAddComponent},
  {path: 'editar-artista/:id', component: ArtistEditComponent},
  {path: 'editar-album/:id', component: AlbumEditComponent},
  {path: 'crear-album/:artist', component: AlbumAddComponent},
  {path: 'crear-cancion/:album', component: SongAddComponent},
  {path: 'editar-cancion/:song', component: SongEditComponent},
  {path: 'artista/:id/:page', component: ArtistDetailComponent},
  {path: 'album/:id', component: AlbumDetailComponent},
  {path: 'mis-datos', component: UserEditComponent},
  {path: '**', component: HomeComponent}
];

export const appRoutingProviders: any[] = [];
export const routing: ModuleWithProviders = RouterModule.forRoot(appRoutes);
