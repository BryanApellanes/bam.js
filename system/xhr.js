let xhr = (function(){
    var _ = _,
        xhrCtor = {};

    var _settings = {
        headers: {
            "Content-Type": "application/json"
        },
        getHeaders: function(combineWith) {
            return _.extend(this.headers, combineWith);
        }
    }

    function createXhr(verb, headers, path){
        var xhr = new xhrCtor();
        xhr.open(verb, path);
        for(var header in headers){
            xhr.setRequestHeader(header, headers[header]);
        }
        xhr.withCrednetials = true;
        return xhr;
    }

    function getHeaders(headers, path) {
        if(_.isString(headers) && _.isUndefined(path)){
            path = headers;
            headers = _settings.headers;
        }
        if(_.isFunction(_settings.getHeaders)) {
            headers = _settings.getHeaders(headers);
        } else {            
            headers = _.extend(_settings.headers, headers);
        }
        return headers;
    }

    function doBodyVerb(verb, data, headers, path){
        headers = getHeaders(headers, path);    
        return new Promise((resolve, reject) => {
            var xhr = createXhr(verb, headers, path);
            
            xhr.onreadystatechange = function() {
                if(this.readyState == 4) {
                    if(this.status >= 200 && this.status <= 299){
                        resolve(xhr);
                    }else {
                        reject(xhr);
                    }
                }
            },
            xhr.send(data);
        })
    }

    function doVerb(verb, headers, path) {
        headers = getHeaders(headers, path);
        return new Promise((resolve, reject) => {
            var xhr = createXhr(verb, headers, path);
            xhr.onreadystatechange = function() {
                if(this.readyState === 4) {
                    if(this.status >= 200 && this.status <= 299) {
                        resolve(xhr);
                    } else {
                        reject(xhr);
                    }
                }
            },
            xhr.send();
        })
    }

    return function(settings){        
        if(settings.lodash){
            _ = settings.lodash;
        }
        if(typeof XMLHttpRequest !== 'undefined'){
            xhrCtor = XMLHttpRequest;
        }
        if(settings.XMLHttpRequest){
            xhrCtor = settings.XMLHttpRequest;
        }
        if(xhrCtor === null || !_.isFunction(xhrCtor)) {
            xhrCtor = require("xmlhttprequest").XMLHttpRequest;
        }
        
        return {
            get: (headers, path) => {
                return doVerb("GET", headers, path);
            },
            delete: (headers, path) => {
                return doVerb("DELETE", headers, path);   
            },
            post: (data, headers, path) => {
                return doBodyVerb("POST", data, headers, path);
            },
            put: (data, headers, path) => {
                return doBodyVerb("PUT", data, headers, path);
            },
            patch: (data, headers, path) => {
                return doBodyVerb("PATCH", data, headers, path);
            },
            receiveJson: (verb, data, headers, path) => {
                return new Promise((resolve, reject) => {
                    this[verb.toLowerCase()](data, headers, path)
                            .then(x => resolve(JSON.parse(x.responseText)))
                            .catch(reject);
                });
            },
            receiveJsonFromGet: (headers, path) => {
                return this.receiveJson("GET", headers, path);
            },
            receiveJsonFromPost: (data, headers, path) => {
                return this.receiveJson("POST", data, headers, path);
            }
        }
    } 
})()

module.exports = xhr;