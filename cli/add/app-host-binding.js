var appBinding = (function(){
    var args = require('../cli-args.js'),
        fs = require('fs'),
        path = require('path'),
        _ = require("lodash");
    
    function hasBinding(appBindingConfig, appConf){
        var appName = appBindingConfig.appName,
            binding = appBindingConfig.binding;
        var result = false;
        _.each(appConf.Bindings, (inConf) => {
            if(binding.HostName === inConf.HostName && binding.Port === inConf.Port && binding.Ssl === inConf.Ssl){
                result = true;
                return;
            }
        });
        return result;
    }

    return {
        add: function(){
            if(args["content"]){
                process.chdir(args["content"]);
            }
            if(!args["app"]){
                console.log("app not specified, specify argument -app:<appName>");
                return 1;
            }
            var appName = args['app'];
            if(!args["hostName"]){
                console.log("hostName not specified, specify argument -hostName:<hostName>");
                return 1;
            }
            var appBindingConfig = {
                appName: args['app'],
                binding: {
                    HostName: args['hostName'],
                    Port: args['port'] || 80,
                    Ssl: args["ssl"] === "true" || args["ssl"] === "1"
                }
            }

            // TODO:
            // get the appConf for the app
            var appConfPath = `${process.cwd()}/apps/${appName}/appConf.json`;
            if(!fs.existsSync(appConfPath)){
                console.log(`Configuration file for the application '${appName}' was not found: ${appConfPath}`);
                return 1;
            }
            // check if a binding for the specific host name, port and Ssl value exists
            var appConf = JSON.parse(fs.readFileSync(appConfPath, 'utf8'));
            var bindingJson = JSON.stringify(appBindingConfig.binding, null, 2);
            if(hasBinding(appBindingConfig, appConf)){
                console.log(`Specified application ${appName} already has the specified binding:\r\n${bindingJson}`.yellow);
                return 1;
            }
            var configJson = JSON.stringify(appConf, null, 2);
            console.log(`Adding the specified binding to '${appName}'\r\n${bindingJson}`.cyan);
            appConf.Bindings.push(appBindingConfig.binding);
            fs.writeFileSync(appConfPath, JSON.stringify(appConf, null, 2), 'utf8');
            console.log(`done`.cyan);
        }
    }
})()

module.exports = appBinding
