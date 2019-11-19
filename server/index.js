'use strict'

var mongoose = require('mongoose');
var app = require('./app');
var port = process.env.PORT || 3977;

mongoose.Promise = global.Promise;
mongoose.connect('mongodb://localhost:27017/spotify',(err,res)=>{
    if(err){
        throw err;
    }else{
        console.log('La conexion a la bd está funcionando correctamente');
        app.listen(port,function() {
            console.log('Servidor de la Api Rest de musica funcionando en puerto ' + port);
        });
    }
});

