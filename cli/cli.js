var cli = (function(){
    var templateRoot = '../../templates/',
        colors = require('colors');

    var _ = require('lodash'),
        handlebars = require('handlebars'),
        bam = require('../bam.js');

    var _cli = _.extend({}, bam, {
        namedArgs: function(){
            return require("./cli-args.js");
        },
        execute: function(actionName, actionKind){
            console.log(`action: ${actionName}, kind: ${actionKind}`.cyan);
            var module = require(`./${actionName}/${actionKind}`);
            module[actionName]();
        }
    });
    return _cli;
})()

module.exports = cli;