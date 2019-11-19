'use strict'

var path = require('path');
var fs = require('fs');

var mongoosePagination = require('mongoose-pagination');
var Artist = require('../models/artist');
var Album = require('../models/album');
var Song = require('../models/song');

function getArtist(req, res){
    var artistId = req.params.id;
    Artist.findById(artistId,(err, artist)=>{
        if (err){
            res.status(500).send({message: "No se pudo buscar el artista"});
        }else{
            if(!artist){
                res.status(404).send({message: "No existe el artista"});
            }else{
                res.status(200).send({artist});
            }
        }
    });
    
}

function getArtists(req, res){
    
    if(req.params.page){
        var page = req.params.page;
    }else{
        var page = 1;
    }

    
    var itemsPage = 3;

    Artist.find().sort('name').paginate(page, itemsPage, function(err, artists, total){
        if(err){
            res.status(500).send({message: "Error en la peticion"});
        }else{
            if(!artists){
                res.status(404).send({message: "No hay Artistas"});
            }else{
                return res.status(200).send({
                    total: total,
                    artists: artists
                });
            }
        }
    });
}

function saveArtist(req,res){
    var artist = new Artist();
    var params = req.body;

    artist.name = params.name;
    artist.description = params.description;
    artist.image = 'null';

    artist.save((err, artistStored) => {
        if(err){
            res.status(500).send({message: 'Error al guardar el Artista'});
        }else{
            if(!artistStored){
                res.status(404).send({message: 'El artista no ha sido guardado'});
            }else{
                res.status(200).send({artist: artistStored});
            }
        }
    });

}

function updateArtist(req, res){
    var artistId = req.params.id;
    var update = req.body;

    Artist.findByIdAndUpdate(artistId, update, (err, artistUpdated) => {
        if(err){
            res.status(500).send({message: 'Error al actualizar el artista'});
        }else{
            if(!artistUpdated){
                res.status(404).send({message: 'El artista no ha sido actualizado'});
            }else{
                res.status(200).send({artist: artistUpdated});
            }
        }
    })

}

function deleteArtist(req, res){
    var artistId = req.params.id;
    Artist.findByIdAndRemove(artistId,(err,artistRemoved) => {
        if(err){
            res.status(500).send({message: 'Error al eliminar el artista'});
        }else{
            if(!artistRemoved){
                res.status(404).send({message: 'El artista no ha sido eliminado'});
            }else{
                //res.status(200).send({artist: artistRemoved});
                Album.find({artist: artistRemoved._id}).remove((err, albumRemoved)=>{
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
                                        res.status(200).send({artist: artistRemoved});//Devuelvo el artista eliminado luego de haber eliminado
                                                                                    //Todos sus albums y canciones
                                    }
                                }
                            });
                        }
                    }
                }); 
            }
        }
    });
}

function uploadImage(req, res){
    var artistId = req.params.id;
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
            Artist.findByIdAndUpdate(artistId, {image: file_name}, (err,artistUpdated) => {
                if(err){
                    res.status(500).send({message: 'Error al actualizar la imagen de usuario'});//error de server
                }else{
                    if(!artistUpdated){
                        res.status(404).send({message: 'No se ha podido actualizar la imagen'});//error de server
                    }else{
                        res.status(200).send({artist: artistUpdated});//Devuelvo el usuario con los datos actualizados
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
    var pathFile = './uploads/artists/' + imageFile;
    
    fs.exists(pathFile, function(exists){
        if (exists){
            res.sendFile(path.resolve(pathFile));
        }else{
            res.status(200).send({message: 'No existe la imagen'});//error de server
        }
    });
}

module.exports={
    getArtist,
    saveArtist,
    getArtists,
    updateArtist,
    deleteArtist,
    uploadImage, 
    getImageFile
};