/**
* Devise.js
*
* @description :: TODO: You might write a short summary of how this model works and what it represents here.
* @docs        :: http://sailsjs.org/#!documentation/models
*/

module.exports = {
    autoCreatedAt: false,
    autoUpdatedAt: false,
    tablename:'devise',
  attributes: {

      id:{
          columnName:'ID',
          primaryKey:true,
          autoIncrement:true,
          unique:true,
          type:'integer'
      },
      libelle:{
          columnName:'LIBELLE',
          required:true,
          type:'string',
          notNull:true
      },
      symbole:
      {
          columnName:'SYMBOLE',
          required:true,
          type:'string',
          notNull:true
      },
      code:
      {
          columnName:'CODE',
          required:true,
          type:'string',
          notNull:true
      },
      statut:{
          type:'String',
          required:'true',
          columnName:'STATUT',
          enum:['A','I'],
          index:true,
          notNull:true,
          defaultsTo:'A'
      },
      articles:{
          collection:'article',
          via:'devise'
      }
  }


};

