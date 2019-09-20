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
            addPage: (pageName) => {
                
            }
        });
    }
})()

module.exports = bam;

if(undefined !== window){
    window.bam = bam;
}