//Email service
var nodemailer = require('nodemailer');
// create reusable transporter object using SMTP transport
var options={
    port:465,
    secureConnection: true,
    host:'ssl0.ovh.net',
    auth: {
        user: 'occazstreet@occazstreet.com',
        pass: 'occazSTREET1#'
    }
};
var transport = nodemailer.createTransport("SMTP",options);
var path =require('path');
var templatesDir   = path.join(__dirname, '../../views/templates/emails')
    , emailTemplates = require('email-templates')
    , nodemailer     = require('nodemailer')
    ,templatesForgotPassword=path.join(__dirname, '../../views/templates/password')
    ,templatesSignalerArticle=path.join(__dirname, '../../views/templates/moderation'),
    templatesArticleAjoute=path.join(__dirname, '../../views/templates/moderation')
    ;

module.exports = {

    /***************************************************************
     *
     *     Email de confirmation inscriptionée
     *
     * **************************************************************/
    ConfirmEmail:function(utilisateur)
    {
        emailTemplates(templatesDir,function(err,template){
            if (err) {
                console.log(err);
            } else {

                var locals = {
                    email: utilisateur.newEmail,
                    nom:utilisateur.prenom +' '+utilisateur.nom,
                    confirmEmailUrl:sails.config.myconf.serverUrl+sails.config.myconf.serverPort+'/v/verifEmail?verif='+utilisateur.confirmEmail,
                    infoContact:'contact@occazstreet.com',
                    baseUrl:sails.getBaseurl()
                };
                console.log(sails.getBaseurl());
                template('confirm-email',{confirmEmailUrl:sails.config.myconf.serverUrl+sails.config.myconf.serverPort+'/v/verifEmail?verif='+utilisateur.confirmEmail, infoContact:'info@occazstreet.com',baseUrl:sails.getBaseurl(),urlSite:'www.occazstreet.com', nom:utilisateur.prenom +' '+utilisateur.nom
                }, function(err, html) {
                    if (err) {
                        console.log(err);
                    } else {

                        transport.sendMail({
                            from: 'contact@occazstreet.com',
                            to: locals.email,
                            subject: 'OccazStreet: Vérification e-mail',
                            html: html,
                            generateTextFromHTML: true
                            //text: text
                        }, function (err, responseStatus) {
                            if (err) {
                                console.log("err "+err);
                            } else {
                                console.log("responseStatus.message "+JSON.stringify(responseStatus));
                            }
                        });
                    }
                })
            }
        })
    },

    /***************************************************************
     *
     *     Email de confirmation de la nouvelle adresse email
     *
     * **************************************************************/
    ConfirmEmail:function(utilisateur)
    {
        emailTemplates(templatesDir,function(err,template){
            if (err) {
                console.log(err);
            } else {

                var locals = {
                    email: utilisateur.newEmail,
                    nom:utilisateur.prenom +' '+utilisateur.nom,
                    confirmEmailUrl:sails.config.myconf.serverUrl+sails.config.myconf.serverPort+'/v/verifEmail?verif='+utilisateur.confirmEmail,
                    infoContact:'contact@occazstreet.com',
                    baseUrl:sails.getBaseurl()
                };
                console.log(sails.getBaseurl());
                template('confirm-email',{confirmEmailUrl:sails.config.myconf.serverUrl+sails.config.myconf.serverPort+'/v/verifEmail?verif='+utilisateur.confirmEmail, infoContact:'info@occazstreet.com',baseUrl:sails.getBaseurl(),urlSite:'www.occazstreet.com', nom:utilisateur.prenom +' '+utilisateur.nom
                }, function(err, html) {
                    if (err) {
                        console.log(err);
                    } else {

                        transport.sendMail({
                            from: 'contact@occazstreet.com',
                            to: locals.email,
                            subject: 'OccazStreet: Vérification e-mail',
                            html: html,
                            generateTextFromHTML: true
                            //text: text
                        }, function (err, responseStatus) {
                            if (err) {
                                console.log("err "+err);
                            } else {
                                console.log("responseStatus.message "+JSON.stringify(responseStatus));
                            }
                        });
                    }
                })
            }
        })
    },


    /***************************************************************
     *
     *     Email de confirmation de la nouvelle adresse email
     *
     * **************************************************************/
    sendMailReInitPassword:function(utilisateur,code)
    {
        emailTemplates(templatesForgotPassword,function(err,template){
            if (err) {
                console.log(err);
            } else {

                var locals = {
                    email: utilisateur.email,
                    nom:utilisateur.prenom +' '+utilisateur.nom,
                    code:code,
                    infoContact:'contact@occazstreet.com'
                };
                template('forgot-password',{urlSite:'www.occazstreet.com', nom:utilisateur.prenom +' '+utilisateur.nom,code:code,infoContact:'contact@occazstreet.com'
                }, function(err, html) {
                    if (err) {
                        console.log(err);
                    } else {

                        transport.sendMail({
                            from: 'contact@occazstreet.com',
                            to: locals.email,
                            subject: 'OccazStreet: Réinitialisation du mot de passe',
                            html: html,
                            generateTextFromHTML: true
                            //text: text
                        }, function (err, responseStatus) {
                            if (err) {
                                console.log("err "+err);
                            } else {
                                console.log("responseStatus.message "+JSON.stringify(responseStatus));
                            }
                        });
                    }
                })
            }
        })
    },

    /***************************************************************
     *
     *     Email de signalement d'une annonce
     *
     * **************************************************************/
    sendMailSignalementAnnonce:function(signalement,article)
    {
        console.log(JSON.stringify(signalement));
        emailTemplates(templatesSignalerArticle,function(err,template){
            if (err) {
                console.log(err);
            } else {
                template('signaler-article',{infoContact:'contact@occazstreet.com',urlSite:'www.occazstreet.com',idArticle:article.idArticle,articleTitre:article.titre, messageAuteurSignalement:signalement.message, mailAuteurSignalement:signalement.email, nomAuteurSignalement:signalement.nom, auteurArticle:article.utilisateur.email, motifSignalement:signalement.motif
                }, function(err, html) {
                    if (err) {
                        console.log(err);
                    } else {

                        transport.sendMail({
                            from: signalement.email,
                            to: 'moderation@occazstreet.com',
                            subject: 'OccazStreet: Signalement article',
                            html: html,
                            generateTextFromHTML: true
                            //text: text
                        }, function (err, responseStatus) {
                            if (err) {
                                console.log("err "+err);
                            } else {
                                console.log("responseStatus.message "+JSON.stringify(responseStatus));
                            }
                        });
                    }
                })
            }
        })
    },

    /***************************************************************
     *
     *     Email de ajout d'une annonce
     *
     * **************************************************************/
    sendMailArticleAjoute:function(article)
    {
        emailTemplates(templatesArticleAjoute,function(err,template){
            if (err) {
                console.log(err);
            } else {
                template('ajout-article',{infoContact:'contact@occazstreet.com',urlSite:'www.occazstreet.com',idArticle:article.idArticle,articleTitre:article.titre,auteurArticle:article.utilisateur.email
                }, function(err, html) {
                    if (err) {
                        console.log(err);
                    } else {

                        transport.sendMail({
                            from: 'contact@occazstreet.com',
                            to: 'moderation@occazstreet.com',
                            subject: '[ARTICE A VALIDER]OccazStreet: Ajout d\'un nouvel article',
                            html: html,
                            generateTextFromHTML: true
                            //text: text
                        }, function (err, responseStatus) {
                            if (err) {
                                console.log("err "+err);
                            } else {
                                console.log("responseStatus.message "+JSON.stringify(responseStatus));
                            }
                        });
                    }
                })
            }
        })
    },
    /***************************************************************
     *
     *     Email de signalement d'une annonce
     *
     * **************************************************************/
    sendMessageContact:function(infoContact)
    {
        emailTemplates(templatesSignalerArticle,function(err,template){
            if (err) {
                console.log(err);
            } else {
                template('message-contact',{sujet:infoContact.sujet,infoContact:'contact@occazstreet.com',urlSite:'www.occazstreet.com',message:infoContact.message, email:infoContact.email, nom:infoContact.nom
                }, function(err, html) {
                    if (err) {
                        console.log(err);
                    } else {

                        transport.sendMail({
                            from: infoContact.email,
                            to: 'contact@occazstreet.com',
                            subject: 'OccazStreet: '+infoContact.sujet,
                            html: html,
                            generateTextFromHTML: true
                            //text: text
                        }, function (err, responseStatus) {
                            if (err) {
                                console.log("err "+err);
                            } else {
                                console.log("responseStatus.message "+JSON.stringify(responseStatus));
                            }
                        });
                    }
                })
            }
        })
    },

};
