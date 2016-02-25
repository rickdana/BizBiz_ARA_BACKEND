/**
* Message.js
*
* @description :: TODO: You might write a short summary of how this model works and what it represents here.
* @docs        :: http://sailsjs.org/#!documentation/models
*/

module.exports = {
    autoPK: false,
    autoCreatedAt: false,
    autoUpdatedAt: false,
    tableName:'message',
    attributes: {
        contenu:{
            columnName:'CONTENU',
            required:true,
            type:'text',
            notNull:true
        },
       /* lu:{
           columnName:'LU',
           required:true,
           type:'boolean',
           notNull:true
        },*/
        idMessage:{
            columnName:'IDMESSAGE',
            primaryKey:true,
            autoIncrement:true,
            unique:true,
            type:'integer'
        },
        dateMessage:{
            type:'datetime',
            columnName:'DATEMESSAGE',
            required:'true',
            index:'true',
            notNull:true
        },
        utilisateur:{
            model:'utilisateur',
            columnName:'IDUTILISATEUR',
            notNull:true
        },
        idConversation:{
            model:'conversation',
            columnName:'IDCONVERSATION',
            notNull:true
        },

    }
};

