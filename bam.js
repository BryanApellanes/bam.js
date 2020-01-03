#!/usr/local/bin/node

var bam = (function(){
    var options = {},
        _ = require('lodash'),
        xhrCtor = require("xmlhttprequest").XMLHttpRequest;

    var proxies = {};
    
    return function(opts) {
        options = _.extend({}, opts);
    
        return _.extend({}, {
            cli: function(){
                var cli = require('./cli/cli.js'),
                    namedArgs = cli.namedArgs();
                var config = {                        
                        appName: namedArgs['app'],
                        type: namedArgs['type'],
                        toBeCreated: namedArgs['create'],
                        toBeRetrieved: namedArgs['retrieve'],
                        toBeUpdated: namedArgs['update'],
                        toBeDeleted: namedArgs['delete'],
                        toBeAdded: namedArgs['add']                        
                    };

                var action = 'retrieve'; // a sane default
                var actionKind = 'app-host-binding'; // the only one so far
                
                if(config.toBeCreated){
                    action = 'create';
                    actionKind = config.toBeCreated;
                }
                if(config.toBeRetrieved){
                    action = 'retrieve';
                    actionKind = config.toBeRetrieved;
                }
                if(config.toBeUpdated){
                    action = 'update';
                    actionKind = config.toBeUpdated;
                }
                if(config.toBeDeleted){
                    action = 'delete';
                    actionKind = config.toBeDeleted;
                }
                if(config.toBeAdded){
                    action = 'add';
                    actionKind = config.toBeAdded;
                }
                cli.execute(action, actionKind);
            },
            proxy: function(name, protocolInfo) {
                proxies[name] = protocolInfo;
            },
            xhr: function(opts) {
                var xhrObj = require('./system/xhr.js')(_.extend({lodash: _, XMLHttpRequest: xhrCtor}, opts));
                if(!_.isUndefined(opts)){
                    var { data, headers, url, verb } = opts;
                    verb = verb || 'get';
                    return new Promise((resolve, reject) => {
                        if(verb === 'get' || verb === 'delete') {
                            xhrObj[verb](headers, url)
                                .then(result => resolve(result))
                                .catch(reject);
                        } else {
                            xhrObj[verb](data, headers, url)
                                .then(result => resolve(result))
                                .catch(reject);
                        }
                    });
                }
                return xhrObj;
            }
        });
    }
})()
bam.instance = bam();
module.exports = bam;

if(typeof(window) !== "undefined"){
    window.bam = bam;
}

var args = Array.from(process.argv);

if(bam.instance[args[2]]){
    bam.instance[args[2]](args);
}