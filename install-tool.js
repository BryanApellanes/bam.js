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
var os = require('os');
var homeDir = os.homedir();

var runtime = osRuntimes[os.platform()];
var toolName = process.argv[2] || 'bam';
var zipFileName = `bamtoolkit-${toolName}-${runtime}.zip`;

var tmpDir = path.resolve(homeDir, ".bam", "tmp");
var binDir = path.resolve(homeDir, ".bam", "toolkit", runtime, toolName);
var downloadPath = path.resolve(tmpDir, zipFileName);

shell.rm('-fr', binDir);

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

console.log(`downloading ${toolName}`.cyan);
download(`http://bamapps.net/download?fileName=${zipFileName}`, downloadPath, function(){
    console.log(`file downloaded to ${downloadPath}`.green);
    unzip(downloadPath, binDir);
    console.log(`unzip complete`.green);
    console.log(`deleting file ${downloadPath}`.cyan);
    shell.rm(downloadPath);
    console.log(`delete complete`.green);
    shell.cp('./set-tool-path.sh', binDir);
    console.log(`installed ${toolName} to ${binDir}`.blue);
    console.log(`set tool path with: 'source ${path.join(binDir, "set-tool-path.sh")} ${runtime} ${toolName}'`.yellow);
});