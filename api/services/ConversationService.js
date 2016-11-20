/**
 * Created by fleundeu on 14/08/2015.
 */

var moment = require('moment');
moment.locale('fr');
module.exports={
  getConversationByUser:function(cb,val)
  {
    Conversation.find().populate('article').populate('utilisateur1').populate('utilisateur2').populate('messages').where({
      or : [
        { utilisateur1: cb.iduser },
        { utilisateur2: cb.iduser }
      ]})
      .then(function( conversations) {
        var i=0;
        conversations.forEach(function(element,index){
          Utilisateur.findOne({
            id:element.utilisateur2.id
          }).populate('photo').then(function(utilisateur){
            element.utilisateur2=utilisateur;
            element.dateDebutConversation=moment(new Date(element.dateDebutConversation)).format("DD MMMM YYYY");
            i++;
            if(i==conversations.length){
              val(null, conversations);
            }
          })
        });
      })
  }
};
