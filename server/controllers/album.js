'use strict'

var path = require('path');
var fs = require('fs');

var mongoosePagination = require('mongoose-pagination');
var Artist = require('../models/artist');
var Album = require('../models/album');
var Song = require('../models/song');

function saveAlbum(req, res){
    var album = new Album();
    var params = req.body;

    album.title = params.title;
    album.description = params.description;
    album.year = params.year;
    album.image  = 'null';
    album.artist = params.artist;

    album.save(album, (err, albumStored) =>{
        if (err){
            res.status(500).send({message: "Error en el servidor"});
        }else{
            if(!albumStored){
                res.status(404).send({message: "No se pudo guardar el album"});
            }else{
                res.status(200).send({album:albumStored});
            }
        }
    });
}

function getAlbum(req, res){
    var albumId = req.params.id;
    Album.findById(albumId).populate({path:'artist'}).exec((err, album)=>{
        if (err){
            res.status(500).send({message: "Error en la petición"});
        }else{
            if(!album){
                res.status(404).send({message: "No existe el album"});
            }else{
                res.status(200).send({album: album});
            }
        }
    });
    
}

function getAlbums(req, res){

    if(req.params.page){
        var page = req.params.page;
    }else{
        var page = 1;
    }

    var itemsPage = 3;

    var artistId = req.params.artist;
    var find;
    if(!artistId){
        //Sacar todos los albums de la bdd
        find = Album.find().populate({path: 'artist'}).sort('title').paginate(page, itemsPage, function(err, albums, total){
            if(err){
                res.status(500).send({message: "Error en la peticion"});
            }else{
                if(!albums){
                    res.status(404).send({message: "No hay Artistas"});
                }else{
                    res.status(200).send({
                        total: total,
                        albums: albums
                    });
                }
            }
        });
    }else{
        //Sacar los albums de un artista concreto de la bdd
        find = Album.find({artist: artistId}).populate({path: 'artist'}).sort('year').paginate(page, itemsPage, function(err, albums, total){
            if(err){
                res.status(500).send({message: "Error en la peticion"});
            }else{
                if(!albums){
                    res.status(404).send({message: "No hay Artistas"});
                }else{
                    res.status(200).send({
                        total: total,
                        albums: albums
                    });
                }
            }
        });
    }
/*
    find.populate({path: 'artist'}).exec((err,albums) =>{
        if (err){
            res.status(500).send({message: "Error en la petición"});
        }else{
            if(!albums){
                res.status(404).send({message: "No hay albums"});
            }else{
                res.status(200).send({albums:albums});
            }
        }
    });
*/

}

function getAlbums1(req, res){
    var artistId = req.params.artist;
    if(!artistId){
        //Sacar todos los albums de la bdd
        var find = Album.find().sort('title');
    }else{
        //Sacar los albums de un artista concreto de la bdd
        var find = Album.find({artist: artistId}).sort('year');
    }

    find.populate({path: 'artist'}).exec((err,albums) =>{
        if (err){
            res.status(500).send({message: "Error en la petición"});
        }else{
            if(!albums){
                res.status(404).send({message: "No hay albums"});
            }else{
                res.status(200).send({albums:albums});
            }
        }
    });

    
}

function updateAlbum(req,res){
    var albumId = req.params.id;
    var update = req.body;

    Album.findByIdAndUpdate(albumId,update,(err,albumUpdated)=>{
        if (err){
            res.status(500).send({message: "Error en la petición"});
        }else{
            if(!albumUpdated){
                res.status(404).send({message: "No se pudo actualizar el album"});
            }else{
                res.status(200).send({album: albumUpdated});
            }
        }
    });

}

function deleteAlbum(req,res){
    var albumId = req.params.id;

    Album.findByIdAndRemove(albumId,(err, albumRemoved)=>{
        if(err){
            res.status(500).send({message: 'Error al eliminar el Album'});
        }else{
            if(!albumRemoved){
                res.status(404).send({message: 'El album no ha sido eliminado'});
            }else{
                //res.status(200).send({album: albumRemoved});
                Song.find({artist: albumRemoved._id}).remove((err, songRemoved)=>{
                    if(err){
                        res.status(500).send({message: 'Error al eliminar las canciones'});
                    }else{
                        if(!songRemoved){
                            res.status(404).send({message: 'Las canciones no han sido eliminadas'});
                        }else{
                            res.status(200).send({album: albumRemoved});//Devuelvo el artista eliminado luego de haber eliminado
                                                                        //Todos sus albums y canciones
                        }
                    }
                });
            }
        }
    }); 

}


function uploadImage(req, res){
    var albumId = req.params.id;
    var file_name = 'No subida';

    if(req.files){
        var file_path = req.files.image.path;
        var file_split = file_path.split('\\');
        file_name = file_split[2];
        var ext_split = file_name.split('\.');
        var extension_file = ext_split[1];
        console.log(ext_split);

        if (extension_file ==  'jpg' || extension_file ==  'gif' || extension_file ==  'png')
        {
            Album.findByIdAndUpdate(albumId, {image: file_name}, (err,albumUpdated) => {
                if(err){
                    res.status(500).send({message: 'Error al actualizar la imagen del album'});//error de server
                }else{
                    if(!albumUpdated){
                        res.status(404).send({message: 'No se ha podido actualizar la imagen'});//error de server
                    }else{
                        res.status(200).send({album: albumUpdated});//Devuelvo el usuario con los datos actualizados
                    }
                }
            });
        }else{
            res.status(200).send({message: 'La extension del archivo a subir no es valida'});//Devuelvo el usuario con los datos actualizados
        }
    }else{
        res.status(404).send({message: 'No se ha subido ninguna imagen'});//error de server
    }
    
}

function getImageFile(req, res){
    var imageFile = req.params.imageFile;
    var pathFile = './uploads/albums/' + imageFile;
    
    fs.exists(pathFile, function(exists){
        if (exists){
            res.sendFile(path.resolve(pathFile));
        }else{
            res.status(200).send({message: 'No existe la imagen'});//error de server
        }
    });
}


module.exports={
    getAlbum,
    saveAlbum,
    getAlbums,
    updateAlbum,
    deleteAlbum,
    uploadImage,
    getImageFile

};