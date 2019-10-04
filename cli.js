var cli = (function(){
    var templateRoot = '../../Templates/';

    var _ = require('lodash'),
        handlebars = require('handlebars'),
        bam = require('./bam.js');

    return _.extend({}, bam, {
        add: function(){

        }
    });
})()

module.exports = cli;