/**
* Pays.js
*
* @description :: TODO: You might write a short summary of how this model works and what it represents here.
* @docs        :: http://sailsjs.org/#!documentation/models
*/

module.exports = {
    autoPK: false,
    autoCreatedAt: false,
    autoUpdatedAt: false,
    tableName:'pays',
    attributes: {
        idPays:{
            type:'integer',
            unique:true,
            columnName:'IDPAYS',
            autoIncrement:true,
            primaryKey:true
        },
        nompays:{
            type:'string',
            columName:'NOMPAYS',
            index:true,
            notNull:true
        },
        villes:{
            collection:'ville',
            via:'idPays'
        }
    }
};

