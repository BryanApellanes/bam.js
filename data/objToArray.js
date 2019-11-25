var obj = (function(){

    return {
        toArray: function(obj) {
            var result = [];
            for(var prop in obj) {
                result.push(obj[prop]);
            }
            return result;
        }
    }
})()

module.exports = obj;

if(undefined !== window){
    window.obj = obj;
}