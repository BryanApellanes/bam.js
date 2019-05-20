var obj = (function(){

    return {
        toArray: function(obj) {
            debugger;
            var result = [];
            for(var prop in obj) {
                result.push(obj[prop]);
            }
            return result;
        }
    }
})()

console.log('objToArray.js loaded');
module.exports = obj;