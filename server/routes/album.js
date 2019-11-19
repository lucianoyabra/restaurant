'use strict'

var express = require('express');
var AlbumController = require('../controllers/album');
var md_auth = require('../middlewares/authenticate');

var api = express.Router();

var multipart = require('connect-multiparty'); //Subir ficheros para peticiones http
var md_upload = multipart({uploadDir: './uploads/albums'});


api.get('/album/:id', md_auth.ensureAuth  , AlbumController.getAlbum);
api.get('/albums/:artist?/:page?', md_auth.ensureAuth  , AlbumController.getAlbums);
api.post('/album', md_auth.ensureAuth  , AlbumController.saveAlbum);
api.put('/albumUpdate/:id', md_auth.ensureAuth  , AlbumController.updateAlbum);
api.delete('/albumDelete/:id', md_auth.ensureAuth, AlbumController.deleteAlbum);
api.post('/upload-image-album/:id', [md_auth.ensureAuth, md_upload] , AlbumController.uploadImage);
api.get('/get-image-album/:imageFile' , AlbumController.getImageFile);

module.exports = api;