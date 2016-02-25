/**
 * ConversationController
 *
 * @description :: Server-side logic for managing conversations
 * @help        :: See http://links.sailsjs.org/docs/controllers
 */

'use strict';
var moment = require('moment');
moment.locale('fr');
module.exports = {


  addConversation:function(req,res) {
    if(req.isSocket && req.method==='POST')
    {

    }
    else if(req.isSocket)
    {

    }
    console.log("ConversationController.addConversation()");
    var iduser1=req.body.utilisateur1;
    var iduser2=req.body.utilisateur2;
    var article=req.body.article;
    req.body.dateDebutConversation=new Date();

    console.log(JSON.stringify(req.body));
    Conversation.findOne().populate('article').populate('utilisateur1').populate('utilisateur2').where({or : [
      { utilisateur1: iduser1 },
      { utilisateur2: iduser2 },
      {utilisateur1:iduser2},
      {utilisateur2:iduser1}
    ]}).where({article:article}).exec(function(err,data){

      if(err)
      {

      }
      if(data)
      {
        console.log("une conversation existe déjà entre les deux utilisateurs par rapport à un article donnée")
        res.json({
          hasConversation:true,
          conversation:data
        });
      }else
      {
        console.log("aucune conversation n'existe entre les deux utilisateurs par rapport à l'article donnée. On en crée une nouvelle")
        Conversation.create(req.body).exec(function(err,data){
          if(data)
          {
            console.log("Creation de la conversation effectuée avec succès");
            res.json({
              hasConversation:true,
              conversation:data
            })
          }
        })
      }
    })
  },
  getConversationByUser:function(req,res)
  {
    console.log("MessageController.getConversation()");
    var getArticle = function(article) {
      return Article.findOne(article.idArticle).populate('images').populate('devise');
    };


    var iduser=req.query.iduser;
    console.log("iduser "+iduser);
    /*Conversation.find().populate('article').populate('utilisateur1').populate('utilisateur2').where({
      or : [
        { utilisateur1: iduser },
        { utilisateur2: iduser }
      ]})
      .then(function(conversation){
        if(conversation)
        {
          console.log(JSON.stringify(conversation));
          return [conversation, Promise.map(conversation.article, getArticle)];
        }
      }).spread(function(conversation, article){
        conversation.article = article;
        res.json({
          hasConversation:true,
          conversation:conversation
        });
      });*/
    ConversationService.getConversationByUser({iduser:iduser},function(err,conversations){
      console.log("Conversation==>"+JSON.stringify(conversations));
      res.json({
        hasConversation:true,
        conversations:conversations
      });
    })


  },

  deleteConversation:function(req,res)
  {
    var idconversation=req.query.idconversation;
    var iduser=req.query.iduser;
    console.log(idconversation);

      Conversation.destroy({idConversation:idconversation}).exec(function(err,conversation) {
        if (err) {
          res.json({
            success:false,
            err:err
          });
        }else
        {
          Message.find({idConversation:conversation.idConversation}).then(function(messages){
            var i=0;
            if(messages.length==0)
            {
              ConversationService.getConversationByUser({iduser:iduser},function(err,conversations){
                res.json({
                  success:true,
                  conversations:conversations
                });
              })

            }else
            {
              messages.forEach(function(element,index){
                i++;
                Message.destroy({idMessage: element.idMessage}).exec(function(err, messages) {
                  console.log("Message supprimé")
                });
                if(i==messages.length)
                {
                  ConversationService.getConversationByUser({iduser:iduser},function(err,conversations){
                    res.json({
                      success:true,
                      conversations:conversations
                    });
                  })
                }
              })
            }

          })
        }
      });
  },

  getConversationById:function(req,res){
    var idconversation=req.query.idconversation;
    Conversation.findOne({idConversation:idconversation}).exec(function(err,conversation){
      if(err)
      {
        console.log("Erreur 5"+err);
        res.json({
          success:false,
          err:'code erreur 5'
        })
      }
      if(conversation)
      {
        console.log("conversation "+conversation);
        console.log(conversation);
        res.json({
          success:true,
          conversation:conversation
        });
      }


    })
  }
};

