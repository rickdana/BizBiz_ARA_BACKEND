/**
* Conversation.js
*
* @description :: TODO: You might write a short summary of how this model works and what it represents here.
* @docs        :: http://sailsjs.org/#!documentation/models
*/

module.exports = {

    autoCreatedAt: false,
    autoUpdatedAt: false,
    tableName:'conversation',
    attributes: {
        idConversation:{
            columnName:'IDCONVERSATION',
            primaryKey:true,
            autoIncrement:true,
            unique:true,
            type:'integer',
            index:true
        },
        dateDebutConversation:{
          columnName:'DATEDEBUT',
          type:'date',
          index:true
        },
        utilisateur1:{
            columnName:'IDUTILISATEUR1',
            model:'utilisateur',
            notNull:true
        },
        utilisateur2:{
            columnName:'IDUTILISATEUR2',
            model:'utilisateur',
            notNull:true
        },
        messages:{
            collection:'message',
            via:'idConversation'
        },
        article:
        {
          model:'article',
          columnName:'IDARTICLE',
          notNull:true
        }
    }
};

