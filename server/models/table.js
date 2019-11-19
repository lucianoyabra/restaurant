'use strict'

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var TableSchema = Schema({
    number: String,
    capacity: Number,
    descripcion: String
});

module.exports = mongoose.model('Table', TableSchema);