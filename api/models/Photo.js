/**
* Photo.js
*
* @description :: TODO: You might write a short summary of how this model works and what it represents here.
* @docs        :: http://sailsjs.org/#!documentation/models
*/

module.exports = {
    autoCreatedAt: false,
    autoUpdatedAt: false,
    tableName:'photo',
    attributes: {
        idPhoto:{
            columnName:'IDPHOTO',
            primaryKey:true,
            autoIncrement:true,
            unique:true,
            type:'integer'
        },
        cheminPhoto:{
            columnName:'CHEMINPHOTO',
            required:true,
            type:'string',
            notNull:true
        },
        typePhoto: {
            columnName: 'TYPEPHOTO',
            type: 'string'
        }

    }
};

