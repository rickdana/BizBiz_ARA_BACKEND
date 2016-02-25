/**
* Alerte.js
*
* @description :: TODO: You might write a short summary of how this model works and what it represents here.
* @docs        :: http://sailsjs.org/#!documentation/models
*/

module.exports = {

    identity:'Alerte',
    autoPK: false,
    autoCreatedAt: false,
    autoUpdatedAt: false,
    tableName:'alerte',
    attributes: {
        idAlerte:{
            type:'integer',
            unique:true,
            primaryKey:true,
            columnName:'IDALERTE',
            autoIncrement:true
        },
        dateCreation:{
            type:'datetime',
            columnName:'DATECREATION',
            required:'true',
            index:'true',
            notNull:true
        },
        idVille:{
            model:'ville',
            columnName:'IDVILLE'
        },
        utilisateur:{
            model:'utilisateur',
            columnName:'IDUTILISATEUR'
        }
    }
};

