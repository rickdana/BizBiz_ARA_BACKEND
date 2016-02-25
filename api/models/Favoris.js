/**
* Favoris.js
*
* @description :: TODO: You might write a short summary of how this model works and what it represents here.
* @docs        :: http://sailsjs.org/#!documentation/models
*/

module.exports = {

    autoCreatedAt: false,
    autoUpdatedAt: false,
    autoPK: false,
    tableName:'favoris',
    attributes: {
        idFavoris:{
            type:'integer',
            unique:true,
            columnName:'IDFAVORIS',
            autoIncrement:true,
            primaryKey:true
        },
        utilisateur:{
            model:'utilisateur',
            columnName:'IDUTILISATEUR',
            notNull:true
        },
        article:{
            model:'article',
            columnName:'IDARTICLE',
            notNull:true
        }
    }
};

