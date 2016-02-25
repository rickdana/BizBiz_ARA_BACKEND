/**
* Ville.js
*
* @description :: TODO: You might write a short summary of how this model works and what it represents here.
* @docs        :: http://sailsjs.org/#!documentation/models
*/

module.exports = {
    autoCreatedAt: false,
    autoUpdatedAt: false,
    tableName:'ville',
    attributes: {
    idVille:{
        type:'integer',
        unique:true,
        columnName:'IDVILLE',
        autoIncrement:true,
        primaryKey:true
    },
    nomVille:{
        type:'string',
        columName:'NOMVILLE',
        index:true,
        notNull:true
    },
    idPays:{
        model:'pays',
        columnName:'IDPAYS',
        notNull:true
    },
    alertes:{
        collection:'alerte',
        via:'idVille'
    }
        /* utilisateurs:{
         collection:'user'
         }*/
    }
};

