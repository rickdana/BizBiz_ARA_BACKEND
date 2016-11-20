/**Created by fleundeu on 19/04/2015.
 */
var bcrypt=require('bcrypt-nodejs');
var passwordHash = require('password-hash');
module.exports={
    getAllUtilisateurActif:function(cb)
    {
        Utilisateur.find({where:{statut:'A'},sort:'nom ASC'}).exec(function(err,utilisateurs)
        {
            if(utilisateurs)
            {
               cb(null, utilisateurs);
            }
            else {
                cb(err, null);
            }
        })
    },
    getAllUtilisateurInactif:function(cb)
    {
        Utilisateur.find({where:{statut:'I'},sort:'nom ASC'}).exec(function(err,utilisateurs)
        {
            if(utilisateurs)
            {
                cb(null, utilisateurs);
            }
            else {
                cb(err, null);
            }
        })
    },
    getAllUtilisateur:function(cb)
    {
        Utilisateur.find({sort:'nom ASC'}).exec(function(err,utilisateurs)
        {
            if(utilisateurs)
            {
                cb(null, utilisateurs);
            }
            else {
                cb(err, null);
            }
        })
    },
    getUtilisateurById:function(cb,val)
    {
        Utilisateur.findOne({id:cb.idutilisateur}).populate('photo').exec(function(err,utilisateur)
        {
            if(utilisateur)
            {
                val(null, utilisateur);
            }
            else {
                val(err, null);
            }
        })
    },
     getUtilisateurByEmailAndPassword:function(cb,val)
     {
         Utilisateur.findOne({email:cb.email}).populate('photo').exec(function(err,utilisateur){
             if(utilisateur)
             {
                 if(passwordHash.verify(cb.password, utilisateur.password))
                 {
                     console.log("password identique");
                     val(null,utilisateur);
                 }
                 else
                 {
                     val(err,null);
                 }
             }
             else
             {
                 val(err,null);
             }
         })
     },
    changePassword:function(cb,val)
    {
        console.log("changement du mot de passe de l'utilisateur "+cb.email);
        Utilisateur.findOne({email:cb.email}).exec(function(err,utilisateur){
            if(utilisateur)
            {
                if(passwordHash.verify(cb.oldPassword, utilisateur.password))
                {
                    console.log("ancien password verifié");
                   //  utilisateur.password=passwordHash.generate(cb.newPassword);
                    Utilisateur.update({id:utilisateur.id},{password:passwordHash.generate(cb.newPassword)}).exec(function(err,u2){
                        if(u2)
                        {
                            console.log("mise à jour effectué");
                            passwordVerif=true;
                            console.log("u2 "+JSON.stringify(u2));
                            val(null,u2,passwordVerif);
                        }
                        else
                        {
                            val(err,null,null);
                        }
                    });
                }
                else
                {
                    passwordVerif=false;
                    val(null,utilisateur,passwordVerif);
                }
            }
            else
            {
                val(err,null,null);
            }
        })
    },
    checkIfEmailExist:function(cb,val)
    {
        Utilisateur.findOne({email:cb.email}).exec(function(err,utilisateur){
            if(utilisateur)
            {
                val(null,utilisateur);
            }
            else
            {
                val(err,null);
            }
        })
    }

};

