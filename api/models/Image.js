/**
* Image.js
*
* @description :: TODO: You might write a short summary of how this model works and what it represents here.
* @docs        :: http://sailsjs.org/#!documentation/models
*/

module.exports = {
    autoCreatedAt: false,
    autoUpdatedAt: false,
    tableName:'image',
    attributes: {
        idImage:{
            columnName:'IDIMAGE',
            primaryKey:true,
            autoIncrement:true,
            unique:true,
            type:'integer'
        },
        cheminImage:{
            columnName:'CHEMINIMAGE',
            required:true,
            type:'string',
            notNull:true
        },
        typeImage: {
            columnName: 'TYPEIMAGE',
            required: true,
            type: 'string',
            notNull:true
        },
        article:{
            model:'article',
            columnName:'IDARTICLE',
            notNull:true,
            dominant:true

        }
    }
};

