var bam = (function(){
    var options = {},
        _ = require('lodash'),
        xhrCtor = require("xmlhttprequest").XMLHttpRequest;

    var proxies = {};
    
    return function(opts) {
        options = _.extend({}, opts);
    
        return _.extend({}, {
            cli: function(){

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

module.exports = bam;

if(typeof(window) !== "undefined"){
    window.bam = bam;
}

console.log(process.argv[2]);

if(bam()[process.argv[2]]){
    console.log("yes");
}