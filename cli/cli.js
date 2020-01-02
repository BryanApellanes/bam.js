var cli = (function(){
    var templateRoot = '../../templates/';

    var _ = require('lodash'),
        handlebars = require('handlebars'),
        bam = require('../bam.js');

    return _.extend({}, bam, {
        add: function(kindToAdd, value){
            var addModule = require(`./add/${kindToAdd}`);
            addModule.add(value);
        }
    });
})()

module.exports = cli;