/**
 * MessageController
 *
 * @description :: Server-side logic for managing messages
 * @help        :: See http://links.sailsjs.org/docs/controllers
 */

module.exports = {

  getMessagesByConversationN:function(req,res) {
      var idconversation = req.query.idconversation;
      console.log("socketttttttttttttt");
      Message.find({idConversation: idconversation}).populate('idConversation').exec(function (err, lesmessages) {
        if (err) {
          res.json({
            hasMessage: false
          });
        }
        if(lesmessages) {
          var hasMessage;
          if (lesmessages.length > 0) {
            hasMessage = true;
          } else {
            hasMessage = false;
          }
          var messages=[];
          var u1,u2;
          var compteur=0;
          lesmessages.forEach(function(item,index){
            Utilisateur.find({or : [
              { id: item.idConversation.utilisateur1 },
              { id: item.idConversation.utilisateur2 }
            ]}).populate('photo').exec(function(err,utilisateur){
              if(err){console.log(err)}
              compteur++;
              if(compteur===lesmessages.length)
              {
                res.json({
                  hasMessage: hasMessage,
                  messages: messages
                })
              }else
              {
                messages.push({_id: item.idMessage, contenu : item.contenu , userId:item.utilisateur,date:item.dateMessage,read:item.lu,utilisateur1:utilisateur[0].id,username1:utilisateur[0].prenom +' '+utilisateur[0].nom[0],photo1:utilisateur[0].photo.cheminPhoto,utilisateur2:utilisateur[1].id,username2:utilisateur[1].prenom +' '+utilisateur[1].nom[0],photo2:utilisateur[1].photo.cheminPhoto});

              }

            });
          })
        }
      })
  },
  getMessagesByConversation:function(req,res) {
    if (req.isSocket && req.method === 'GET') {
      var idconversation = req.query.idconversation;
      console.log("socketttttttttttttt");
      Message.find({idConversation: idconversation}).populate('idConversation').sort({dateMessage: 'asc'}).exec(function (err, lesmessages) {
        if (err) {
          res.json({
            hasMessage: false
          });
        }
        if(lesmessages) {
          console.log(lesmessages);
          var hasMessage;
          if (lesmessages.length > 0) {
            hasMessage = true;
          } else {
            hasMessage = false;
          }
          var messages=[];
          var compteur=0;
          lesmessages.forEach(function(item,index){
           console.log("utilisateur 1"+item.idConversation.utilisateur1);
            Utilisateur.find({or : [
              { id: item.idConversation.utilisateur2 },
              { id: item.idConversation.utilisateur1}
            ]}).populate('photo').exec(function(err,utilisateur){
              if(err){console.log(err)}
              compteur++;
              if(compteur===lesmessages.length)
              {
                console.log(messages);
                res.json({
                  hasMessage: hasMessage,
                  messages: messages
                })
              }else
              {
                messages.push({_id: item.idMessage, contenu : item.contenu , userId:item.utilisateur,date:item.dateMessage,read:item.lu,utilisateur2:utilisateur[0].id,username2:utilisateur[0].prenom +' '+utilisateur[0].nom[0],photo2:utilisateur[0].photo.cheminPhoto,utilisateur1:utilisateur[1].id,username1:utilisateur[1].prenom +' '+utilisateur[1].nom[0],photo1:utilisateur[1].photo.cheminPhoto});
              }

            });
          })
        }
      })

    }
  },
  addMessage:function (req,res) {

    var messageClient = req.body;
    console.log("message a ajouter"+JSON.stringify(messageClient));

    if(req.isSocket && req.method === 'POST'){

      // This is the message from connected client
      // So add new conversation
      Message.create(messageClient)
        .exec(function(err,message){
          if(err)
          {
            console.log("Une erreur est survenu lors de la création du message"+err);
          }
          if(message)
          {
            console.log("message crée",message);
            console.log("message envoyé à "+messageClient.toUser);
           // Message.subscribe(req.socket, [messageClient.utilisateur,messageClient.toUser]);
            Message.message(messageClient.toUser,{_id: message.idMessage, contenu : message.contenu, userId:message.utilisateur,date:message.dateMessage,read:message.lu});
            res.json({
              message:{_id: message.idMessage, contenu : message.contenu, userId:message.utilisateur,date:message.dateMessage,read:message.lu}
            });
          }

        });
    }
    else if(req.isSocket){
      // subscribe client to model changes
      Message.watch(req.socket);
      console.log( 'User subscribed to ' + req.socket.id );
    }
  }

};

