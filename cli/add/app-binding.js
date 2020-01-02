(function(){
    var args = require('../cli-args.js'),
        binding = {
            HostName: null,
            Port: 80,
            Ssl: false
        }
    if(!args["app"]){
        console.log("app not specified, specify argument -app:<appName>");
        return;
    }
    if(!args["hostName"]){
        console.log("hostName not specified");
        return;
    }
    binding.HostName = args["hostName"];

    if(args["port"]){
        binding.Port = args["port"];
    }

    if(args["ssl"]){
        binding.Ssl = args["ssl"] === "true" || args["ssl"] === "1";
    }

    console.log(`adding host binding for app '${args["app"]}'`)
    console.log(JSON.stringify(binding, null, 2));
})()
