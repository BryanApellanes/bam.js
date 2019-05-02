const path = require('path');
console.log(__dirname);
module.exports = {
    entry: './main.js',
    mode: 'development',
    output: {
        filename: "[name].bundle.js",
        path: path.resolve(__dirname, '../../../wwwroot/js/tests')
    }
}