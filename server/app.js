'use strict'

var express = require('express');
var bodyparser = require('body-parser');

var app = express();

//Cargar Rutas
var table_routes = require('./routes/table');
var reserve_routes = require('./routes/reserve');
var event_routes = require('./routes/event');
var user_routes = require('./routes/user');


app.use(bodyparser.urlencoded({extended:false}));
app.use(bodyparser.json());

//Configurar Cabeceras http
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Authorization, X-API-KEY, Origin, X-Requested-With, Content-Type, Accept, Access-Control-Allow-Request-Method');
    res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, DELETE');
    res.header('Allow', 'GET, POST, OPTIONS, PUT, DELETE');
    next();
});



// rutas base
app.use('/api',user_routes);
app.use('/api',table_routes);
app.use('/api',reserve_routes);
app.use('/api',event_routes);

/*app.get('/pruebas', function(req,res){
    res.status(200).send({message: 'bienvenido al curso spotify'});
})
*/


module.exports = app;