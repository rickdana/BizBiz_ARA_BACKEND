/**
* Article.js
*
* @description :: TODO: You might write a short summary of how this model works and what it represents here.
* @docs        :: http://sailsjs.org/#!documentation/models
*/
var repertoireImage='/imagesArticle/';
var fs = require('fs');
module.exports = {
    autoPK: false,
    autoCreatedAt: false,
    autoUpdatedAt: false,
    tableName:'article',
    attributes: {
        idArticle:{
            type:'integer',
            unique:true,
            columnName:'IDARTICLE',
            autoIncrement:true,
            primaryKey:true
        },
        titre:{
            type:'string',
            required:true,
            columnName:'TITRE',
            index:true,
            notNull:true
        },
        details:{
            type:'text',
            required:true,
            columnName:'DETAILS',
            size:100,
            notNull:true
        },
        etat:{
            type:'string',
            columnName:'ETAT',
            enum:['Normal','Vendu','Réservé'],
            defaultsTo:'Normal',
            index:true,
            notNull:true
        },
        statut:{
            type:'String',
            required:'true',
            columnName:'STATUT',
            defaultsTo:'A',
            enum:['A','I'],
            notNull:true
        },
        prix:{
            type:'float',
            columnName:'PRIX',
            index:true,
            required:true,
            notNull:true
        },
        dateAjout:{
            type:'datetime',
            columnName:'DATEAJOUT',
            index:true,
            required:true,
            notNull:true,
            defaultsTo:Date.now()
        },
        /*idVille:{
            model:'ville',
            columnName:'IDVILLE'
        },*/
        nomVille:{
            type:'String',
            columnName:'NOMVILLE',
            index:true
        },
        nomDepartement:{
          type:'String',
          columnName:'NOMDEPARTEMENT',
          index:true
        },
        nompays:{
            type:'String',
            columnName:'NOMPAYS',
            index:true
        },
        categorie:{
            model:'categorie',
            columnName:'IDCATEGORIE',
            notNull:true,
            index:true

        },
        utilisateur:{
            model:'utilisateur',
            columnName:'IDUTILISATEUR',
            required:true,
            notNull:true,
            dominant:true
        },
        images:{
            collection:'image',
            via:'article'
        },
        vue:{
            collection:'statArticle',
            via:'article'
        },
        favoris:{
            collection:'favoris',
            via:'article'
        },
        latitude:{
            columnName:'LATITUDE',
            type:"float",
            index:true

        },
        longitude:{
            columnName:'LONGITUDE',
            type:"float",
            index:true
        },
        devise:
        {
            model:'devise',
            columnName:'DEVISE'
        },
        nombreDeVue:
        {
            columnName:'NOMBREDEVUE',
            type:'integer'
        },
        conversation:{
          collection:'conversation',
          via:'article'
        }
    },
    beforeCreate: function(article, cb) {
        article.password = passwordHash.generate(utilisateur.password);
        console.log("password hashé " + utilisateur.password);
        cb(null, utilisateur);
    }
};

