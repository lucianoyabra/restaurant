'use strict'

var path = require('path');
var fs = require('fs');

var mongoosePagination = require('mongoose-pagination');
var Artist = require('../models/artist');
var Album = require('../models/album');
var Song = require('../models/song');

function getSong(req,res){
    var songId = req.params.id;
    Song.findById(songId).populate({path: 'album'}).exec((err,song)=>{
        if(err){
            res.status(500).send({message: 'Error en el servidor'});
        }else{
            if(!song){
                res.status(404).send({message: 'No existe la cancion'});
            }else{
                res.status(200).send({song});
            }
        }
    });
}

function saveSong(req,res){
    var song = new Song();
    var params = req.body;

    song.number = params.number;
    song.name = params.name;
    song.duration = params.duration;
    song.file = 'null';
    song.album = params.album;

    song.save((err,songStored)=>{
        if(err){
            res.status(500).send({message: 'Error en el servidor'});
        }else{
            if(!songStored){
                res.status(404).send({message: 'No se ha guardado la cancion'});
            }else{
                res.status(200).send({song: songStored});
            }
        }
    });
}

function getSongs(req,res){
    var albumId = req.params.album;

    if(!albumId){
        var find = Song.find({}).sort('number');
    }else{
        var find = Song.find({album: albumId}).sort('number');
    }

    find.populate({
       path: 'album',
       populate: {
           path: 'artist',
           model: 'Artist'
       }
    }).exec(function(err, songs){
        if(err){
            res.status(500).send({message: 'Error en el servidor'});
        }else{
            if(!songs){
                res.status(404).send({message: 'No hay canciones'});
            }else{
                res.status(200).send({songs:songs});
            }
        }
    });
}

function updateSong(req,res){
    var songId = req.params.id;
    var update = req.body;

    Song.findByIdAndUpdate(songId,update,(err,songUpdated)=>{
        if(err){
            res.status(500).send({message: 'Error en el servidor'});
        }else{
            if(!songUpdated){
                res.status(404).send({message: 'No se pudo actualizar la cancion'});
            }else{
                res.status(200).send({song: songUpdated});
            }
        }
    });
}

function deleteSong(req,res){
    var songId = req.params.id;
    
    Song.findByIdAndRemove(songId,(err,songRemoved)=>{
        if(err){
            res.status(500).send({message: 'Error en el servidor'});
        }else{
            if(!songRemoved){
                res.status(404).send({message: 'No se pudo eliminar la cancion'});
            }else{
                res.status(200).send({song: songRemoved});
            }
        }
    });
}


function uploadFile(req, res){
    var songId = req.params.id;
    var file_name = 'No subida';

    if(req.files){
        var file_path = req.files.file.path;
        var file_split = file_path.split('\\');
        file_name = file_split[2];
        var ext_split = file_name.split('\.');
        var extension_file = ext_split[1];
        console.log(ext_split);

        if (extension_file ==  'mp3' || extension_file ==  'wma')
        {
            Song.findByIdAndUpdate(songId, {file: file_name}, (err,songUpdated) => {
                if(err){
                    res.status(500).send({message: 'Error del servidor'});//error de server
                }else{
                    if(!songUpdated){
                        res.status(404).send({message: 'No se ha podido subir la cancion'});//error de server
                    }else{
                        res.status(200).send({song: songUpdated});//Devuelvo el usuario con los datos actualizados
                    }
                }
            });
        }else{
            res.status(200).send({message: 'La extension del archivo a subir no es valida'});//Devuelvo el usuario con los datos actualizados
        }
    }else{
        res.status(404).send({message: 'No se ha subido ninguna cancion'});//error de server
    }
    
}

function getSongFile(req, res){
    var songFile = req.params.songFile;
    var pathFile = './uploads/songs/' + songFile;
    
    fs.exists(pathFile, function(exists){
        if (exists){
            res.sendFile(path.resolve(pathFile));
        }else{
            res.status(200).send({message: 'No existe el fichero de audio'});//error de server
        }
    });
}


module.exports = {
    getSong,
    getSongs,
    saveSong,
    updateSong,
    deleteSong,
    uploadFile,
    getSongFile
};