//Email service
var nodemailer = require('nodemailer');
// create reusable transporter object using SMTP transport
var options={
    port:465,
    secureConnection: true,
    host:'ssl0.ovh.net',
    auth: {
        user: 'kukkea@kukkea.com',
        pass: 'kukkea1#'
    }
};
var transport = nodemailer.createTransport("SMTP",options);
var path =require('path');
var templatesDir   = path.join(__dirname, '../../views/templates/emails')
    , emailTemplates = require('email-templates')
    , nodemailer     = require('nodemailer')
    ,templatesForgotPassword=path.join(__dirname, '../../views/templates/password');
module.exports = {

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
    }
};
