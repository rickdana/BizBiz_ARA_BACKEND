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
    , nodemailer     = require('nodemailer');
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
                    confirmEmailUrl:sails.myconf.serverUrl+sails.myconf.serverPort+'/v/verifEmail?verif='+utilisateur.confirmEmail,
                    infoContact:'info@occazstreet.com',
                    baseUrl:sails.getBaseurl()
                };
                console.log(sails.getBaseurl());
                template('confirm-email',{confirmEmailUrl:sails.myconf.serverUrl+sails.myconf.serverPort+'/v/verifEmail?verif='+utilisateur.confirmEmail, infoContact:'info@occazstreet.com',baseUrl:sails.getBaseurl(),urlSite:'www.occazstreet.com', nom:utilisateur.prenom +' '+utilisateur.nom
                }, function(err, html) {
                    if (err) {
                        console.log(err);
                    } else {

                        transport.sendMail({
                            from: 'info@occazstreet.com',
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
    }

};
