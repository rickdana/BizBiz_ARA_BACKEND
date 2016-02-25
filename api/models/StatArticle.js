/**
* StatArticle.js
*
* @description :: TODO: You might write a short summary of how this model works and what it represents here.
* @docs        :: http://sailsjs.org/#!documentation/models
*/
module.exports = {
  autoCreatedAt: false,
  autoUpdatedAt: false,
  tableName:'statarticle',
  attributes: {
      id: {
          type: 'integer',
          unique: true,
          columnName: 'ID',
          autoIncrement: true,
          primaryKey: true
      },
      article:{
          model:'article',
          columnName:'IDARTICLE',
          notNull:true,
          dominant:true
      },
      adresseIp: {
          columnName: 'ADRESSEIP',
          type: "string"
      },
      phoneNumber:
      {
        columnName:'TELEPHONE',
        type:"string"
      },
      operateur:
      {
          columnName: 'OPERATEURTELEPHONIQUE',
          type: "string"
      },
      device: {
          columnName: 'DEVICE',
          type: "string"
      },
      os: {
          columnName: 'OS',
          type: "string"
      },
      uuid:{
        columnName:'UUID',
        type:"string"
      },
      dateVue: {
          type: 'datetime',
          columnName: 'DATEVUE',
          notNull: true,
          defaultsTo: new Date()
      },
      codePays:
      {
          type:'string',
          columnName:'CODEPAYS'
      },
      nombreDeVue:
      {
          type: "integer",
          columnName: 'NOMBREDEVUE',
          size: 50
      }
  }
};

