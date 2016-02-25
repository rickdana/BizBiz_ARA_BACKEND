/**Utilisateur.js
*
* @description :: TODO: You might write a short summary of how this model works and what it represents here.
* @docs        :: http://sailsjs.org/#!documentation/models
*/
var bcrypt=require('bcrypt');
var passwordHash = require('password-hash');
module.exports = {

    autoPK: false,
    autoCreatedAt: false,
    autoUpdatedAt: false,
    attributes: {
        id:{
            type:'integer',
            autoIncrement:true,
            unique:true,
            index:true,
            columnName:'IDUTILISATEUR',
            primaryKey:true
        },
        sexe:{
            type:"integer",
            columnName:"SEXE",
            notNull:true,
            enum:[1,2],
            index:true

        },
        nom:{
            type:'string',
            columnName:'NOM',
            index:true,
            required:true,
            maxLength:50,
            minLength:2,
            notNull:true
        },
        prenom:{
            type:'string',
            columnName:'PRENOM',
            required:true,
            maxLength:50,
            minLength:2,
            notNull:true
        },
        dateDeNaissance:
        {
            type:'date',
            columnName:'DATEDENAISSANCE',
            //required:true,
            //notNull:true
        },
        email:{
            columnName:'EMAIL',
            type:'email',
            required:true,
            unique:true,
            size:50,
            notNull:true
        },
        confirmEmail:
        {
            columnName:'CONFIRMEMAIL',
            type:'string',
            size:50
        },
        confirmTel:
        {
            columnName:'CONFIRMTEL',
            type:'string',
            size:50
        },
        password:{
            columnName:'PASSWORD',
            type:'string'
        },
        dateInscription:{
            columnName:'DATEINSCRIPTION',
            type:'datetime',
            index:true,
            required:true,
            notNull:true,
            defaultsTo:new Date()
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
        telephone:{
            type:'string',
            columnName:'TELEPHONE',
            size:20
        },
        dateDerniereConnexion:{
            type:'datetime',
            columnName:'DATEDERNIERECONNEXION',
            notNull:true,
            defaultsTo:new Date()
        },
        provider:{
            type:'string',
            columnName:'TYPEUSER',
            enum:['Normal','Google','Facebook'],
            index:true,
            defaultsTo:'Normal',
            notNull:true
        },
        oauthUserId:{
            type:'string',
            columnName:'OAUTHUSERID'
        },
        nomVille:{
            type:'string',
            columnName:'NOMVILLE',
            size:50,
            notNull:true

        },
        nomPays:{
            type:'string',
            columnName:'NOMPAYS',
            size:50,
            notNull:true
        },
        articles:{
            collection:'article',
            via:'utilisateur'
        },
        favoris:{
            collection:'favoris',
            via:'utilisateur'
        },
        alertes:{
            collection:'alerte',
            via:'utilisateur'
        },
        messages:{
            collection:'message',
            via:'utilisateur'
        },
        photo:
        {
            model:'photo',
            columnName:'PHOTO',
            defaultsTo:1
        },
        role:{
            columnName:'ROLE',
            type:"string",
            enum:['normal','admin'],
            defaultsTo:"normal",
            notNull:true
        },
        token:{
            columnName:'TOKEN',
            type:"string"
        },
        device:
        {
            columnName:'DEVICE',
            type:"string"
        },
        os:
        {
            columnName:'OS',
            type:"string"
        },
        // We don't wan't to send back encrypted password either
        toJSON: function () {
            var obj = this.toObject();
            delete obj.password;
            delete obj.device;
            delete obj.os;
            return obj
        }

    },
    beforeCreate: function(utilisateur, cb) {
      var salt = bcrypt.genSaltSync(10);
      var hash = bcrypt.hashSync(utilisateur.password, salt);
      utilisateur.password=passwordHash.generate(utilisateur.password);
      console.log("password hashé "+utilisateur.password);
      cb(null,utilisateur);
       /* bcrypt.genSalt(10, function(err, salt) {
            bcrypt.hash(utilisateur.password, salt, function(err, hash) {
                if(err) {
                    console.log(err);
                    cb(err);
                } else {
                    utilisateur.password = hash;
                    console.log(hash);
                    cb(null, utilisateur);
                }
            });
        });*/
    }/*,
    beforeUpdate:function(utilisateur,cb){
        console.log("mot de passe "+utilisateur.password);
       // var salt = bcrypt.genSaltSync(10);
       // var hash = bcrypt.hashSync(utilisateur.password, salt);
       // utilisateur.password=hash;
        utilisateur.password=passwordHash.generate(utilisateur.password);
        console.log("password hashé update "+utilisateur.password);
        cb(null,utilisateur);
        /*bcrypt.genSalt(10, function(err, salt) {
            bcrypt.hash(utilisateur.password, salt, function(err, hash) {
                if(err) {
                    console.log(err);
                    cb(err);
                } else {
                    utilisateur.password = hash;
                    console.log(hash);
                    cb(null, utilisateur);
                }
            });
        });*/
   //sssss }
};


