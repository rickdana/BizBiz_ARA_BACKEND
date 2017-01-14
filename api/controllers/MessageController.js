/**
 * MessageController
 *
 * @description :: Server-side logic for managing messages
 * @help        :: See http://links.sailsjs.org/docs/controllers
 */
var async = require("async");
var FCM = require('fcm-node');
var serverKey = 'AIzaSyAGuqalxHgv7Uun-T29BYbNOeakWBuCO5g';
var fcm = new FCM(serverKey);

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
    //if (req.method === 'GET') {
      var idconversation = req.query.idconversation;
      console.log("socketttttttttttttt");
      Message.find({idConversation: idconversation}).populate('idConversation').sort({dateMessage: 'asc'}).exec(function (err, lesmessages) {
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
          async.forEach(lesmessages,function(item,callback){
                Utilisateur.find({or : [
                  { id: item.idConversation.utilisateur2 },
                  { id: item.idConversation.utilisateur1}
                ]}).populate('photo').exec(function(err,utilisateur){
                  if(err){console.log(err)}
                  messages.push({_id: item.idMessage, contenu : item.contenu , userId:item.utilisateur,date:item.dateMessage,read:item.lu,utilisateur2:utilisateur[0].id,utilisateur1:utilisateur[1].id});
                  callback()
                });
              },
              function(err){
                console.log("err ==>"+err);
                if(err)
                {
                  res.json({
                    hasMessage: hasMessage
                  })
                }else
                {
                  res.json({
                    hasMessage: hasMessage,
                    messages: messages
                  })
                }
              });
        }
      });

   // }
  },
  addMessage:function (req,res) {

    var messageClient = req.body;
    console.log("message a ajouter"+JSON.stringify(messageClient));

    /*if(req.isSocket && req.method === 'POST'){*/

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
            console.log("message client==>"+JSON.stringify(messageClient));
            Devicepush.findOne({idUtilisateur:messageClient.toUser}).exec(function(err,tokenData){
              if(tokenData)
              {
                var pushInfo={};
                pushInfo.type='newMessage';
                pushInfo.title='Messagerie OccazStreet';
                pushInfo.body='Vous avez recu un nouveau message sur Occazstreet';
                var pushMessage = { //this may vary according to the message type (single recipient, multicast, topic, et cetera)
                  to: tokenData.deviceToken,
                  priority:"high",
                  notification: {
                    title: 'Messagerie OccazStreet',
                    body: 'Vous avez recu un nouveau message sur Occazstreet',
                    sound:'default'
                  },
                  data: {  //you can send only notification or only data(or include both)
                    pushInfo:pushInfo
                  }
                };
                fcm.send(pushMessage, function(err, response){
                  if (err) {
                    console.log("Something has gone wrong!");
                    console.log(err);
                  } else {
                    console.log("Successfully sent with response: ", response);
                  }
                });
              }
            });
            message.toUser=messageClient.toUser;
            res.json({
              message:{_id: message.idMessage, contenu : message.contenu, userId:message.utilisateur,date:message.dateMessage,read:message.lu}
            });
          }
        });
    //}
   /* else if(req.isSocket){
      // subscribe client to model changes
      Message.watch(req.socket);
      console.log( 'User subscribed to ' + req.socket.id );
    }*/
  }

};

