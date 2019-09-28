var bam = (function(){
    var options = {},
        _ = require('lodash'),
        util = require("./system/util");

    var proxies = {};
    
    return function(opts) {
        options = _.extend({}, opts);
    
        return _.extend({}, util, {
            proxy: function(name, protocolInfo) {
                proxies[name] = protocolInfo;
            },
            xhr: function(opts) {
                var xhrObj = require('../../js/bam/system/xhr.js')({lodash: _});
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

if(undefined !== window){
    window.bam = bam;
}