/**
* Categorie.js
*
* @description :: TODO: You might write a short summary of how this model works and what it represents here.
* @docs        :: http://sailsjs.org/#!documentation/models
*/

module.exports = {

    autoPK: false,
    autoCreatedAt: false,
    autoUpdatedAt: false,
    tableName:'categorie',
    attributes: {
        idcategorie: {
            type: 'integer',
            unique: true,
            columnName: 'IDCATEGORIE',
            autoIncrement: true,
            primaryKey: true
        },
        libelle: {
            type: 'string',
            unique :true,
            required: true,
            columnName: 'LIBELLE',
            index: true,
            notNull:true
        },
        article: {
            collection: 'article',
            via: 'categorie'
        },
        statut:{
            type:'String',
            required:'true',
            columnName:'STATUT',
            enum:['A','I'],
            index:true,
            notNull:true,
            defaultsTo:'A'
        }

    }
};

