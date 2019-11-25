var osRuntimes = {
  win32: "win10-x64", 
  linux: "ubuntu.16.10-x64",
  darwin: "osx-x64"
};

var http = require('http');
var fs = require('fs');
var colors = require('colors');
var path = require('path');
var shell = require('shelljs');
var AdmZip = require('adm-zip');
var homeDir = require('os').homedir();
var tmpDir = path.resolve(homeDir, ".bam", "tmp");
var binDir = path.resolve(homeDir, ".bam", "toolkit", "bin");
var downloadPath = path.resolve(tmpDir, "bamtoolkit.zip");
var targetOs = process.argv[2] || 'windows';

if(targetOs !== "windows" && targetOs !== "linux" && targetOs !== "mac"){
  console.log(`Invalid OS specified (${targetOs}), must be one of: windows, linux or mac`.red);
  process.exit(1);
}

if(!fs.existsSync(tmpDir)){
  shell.mkdir('-p', tmpDir);
}

if(!fs.existsSync(binDir)){
  shell.mkdir('-p', binDir);
}

var download = function(url, dest, cb) {
  var file = fs.createWriteStream(dest);
  var request = http.get(url, function(response) {
    response.pipe(file);
    file.on('finish', function() {
      file.close(cb);  // close() is async, call cb after close completes.
    });
  }).on('error', function(err) { // Handle errors
    fs.unlink(dest); // Delete the file async. (But we don't check the result)
    if (cb) cb(err.message);
  });
};

var unzip = function(path, extractTo){
  console.log(`unzipping ${path} to ${extractTo}`.cyan);
  var zip = new AdmZip(path);  
  zip.extractAllTo(extractTo, true);
}

console.log('downloading bamtoolkit.zip'.cyan);
download(`http://bamapps.net/download-${targetOs}-toolkit`, downloadPath, function(){
    console.log(`file downloaded to ${downloadPath}`.green);
    unzip(downloadPath, binDir);
    console.log(`unzip complete`.green);
    console.log(`deleting file ${downloadPath}`.cyan);
    shell.rm(downloadPath);
    console.log(`delete complete`.green);
    shell.cp('./set-toolkit-path.sh', binDir);
    console.log(`installed bam-toolkit to ${binDir}`.blue);
    console.log(`set toolkit path with: 'source ${path.join(binDir, "set-toolkit-path.sh")}'`.yellow);
});