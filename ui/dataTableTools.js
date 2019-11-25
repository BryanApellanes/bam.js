var dataTableTools = (function(){
    var props = {};


    return {
        rowToObj: function(columnNames, rowArray){
            var result = {};
            for(var i = 0; i < columnNames.length; i++){
                result[columnNames[i]] = rowArray[i];
            }
            return result;
        },
        setProp: function(name, val){
            props[name] = val;
        },
        getProp: function(name) {
            return props[name] || null;
        },
        prop: function(name, val){
            if(val){
                this.setProp(name, val);
                return this;
            }
            return this.getProp(name);
        },
        getDataTable: function(tableName){
            return this.prop(`${tableName}_table`);
        },
        onRowSelected: function(tableName, dataHandler) {
            var tblName = tableName;

            if(!_.isFunction(dataHandler)){
                dataHandler = (dataArray) => {};
            }
            this.getDataTable(tblName)
                .on("select", function(ev, dt, type, indexes) {
                    if(type === 'row') {
                        var data = dt.rows(indexes).data();
                        dataHandler(data);
                    }
                });
        },
        populateTable: function(tableId, dataPromise, columnProps){
            return new Promise((resolve, reject) =>
            {
                var _this = this;
                if(!_.isString(tableId)){
                    throw new Error("tableId must be a string");
                }
                if(!_.isFunction(dataPromise)){
                    throw new Error("dataPromise must be a function that returns a promise and resolves to data in the shape of the specified tableId");
                }
                if(!tableId.startsWith("#")){
                    tableId = `#${tableId}`;
                }
                dataPromise()
                    .then(function(data){
                        //debugger;
                        var tableName = tableId.substring(1),
                            columns = [];

                        if(data.length > 0){
                            for(var prop in data[0]){
                                if(columnProps[prop]){
                                    columns.push(_.extend({}, {title: prop}, columnProps[prop]));
                                } else {
                                    columns.push(_.extend({}, {title: prop}, columnProps));
                                }
                            }
                        
                            var arrayOfArrays = [];
                            _.each(data, item => arrayOfArrays.push(obj.toArray(item))); // obj is `require`d by main.js
                            _this.prop(`${tableName}_data`, data);
                            var existingTable = _this.prop(`${tableName}_table`);
                            if(existingTable){
                                existingTable.destroy();
                            }
                            
                            _this.prop(`${tableName}_table`, $(tableId).DataTable({
                                select: {
                                    style: 'single'
                                },
                                data: arrayOfArrays,
                                columns: columns
                            }));
                        }
                        resolve(data);
                    })
                    .catch(reject);
            });
        }
    }
})()

module.exports = dataTableTools;