/**
 * UtilisateurController
 *
 * @description :: Server-side logic for managing Utilisateurs
 * @help        :: See http://links.sailsjs.org/docs/controllers
 */
var moment = require('moment');
moment.locale('fr');
var fs = require('fs');
var path =require('path');
var jwt = require('jsonwebtoken');
var bcrypt=require('bcrypt');
var trim =require('trim');
var pathPhoto='./assets/photoUtilisateur/';
var pathFromView='/photoUtilisateur/';
var pathPhotoUpload='../../assets/photoUtilisateur';
var token_secret ='OccazStreet';
var passwordHash = require('password-hash');

module.exports = {
    indexUtilisateur:function(req,res)
    {
        var title=req.__('gestiondesutilisateurs.title');
        console.log('success '+req.query.success);
        if(req.query.err)
        {
            res.view('addUtilisateur',{title:title,err:req.query.err,message:req.query.message});
        }
        else
        {
            UtilisateurService.getAllUtilisateurActif(function(err, utilisateurs) {
                if (utilisateurs) {
                    utilisateurs.forEach(function(utilisateur){
                        utilisateur.dateInscription=moment(Date.parse(utilisateur.dateInscription)).format("DD/MM/YYYY");
                        utilisateur.dateDerniereConnexion=moment(Date.parse(utilisateur.dateDerniereConnexion)).format("DD/MM/YYYY");
                    });
                    res.view('utilisateur', {title: title, utilisateurs: utilisateurs,success:req.query.success});
                }
                if (err) {
                    res.view('utilisateur', {title: title, err: err});
                }
            })
        }
    },
    indexUtilisateurInactif:function(req,res){
        var title=req.__('gestiondesutilisateurs.title');
        console.log('success '+req.query.success);
        if(req.query.err)
        {
            res.view('addUtilisateur',{title:title,err:req.query.err,message:req.query.message});
        }
        else
        {
            UtilisateurService.getAllUtilisateurInactif(function(err, utilisateurs) {
                if (utilisateurs) {
                    utilisateurs.forEach(function(utilisateur){
                        utilisateur.dateInscription=moment(utilisateur.dateInscription).format("DD/MM/YYYY");
                        utilisateur.dateDerniereConnexion=moment(utilisateur.dateDerniereConnexion).format("DD/MM/YYYY");
                    });
                    res.view('utilisateurInactif', {title: title, utilisateurs: utilisateurs,success:req.query.success});
                }
                if (err) {
                    res.view('utilisateurInactif', {title: title, err: err});
                }
            })
        }
    },

    addUtilisateur:function(req,res)
    {
        var title=req.__('gestiondesutilisateurs.title');
        res.view('addUtilisateur',{title:title});
    },

    createUtilisateur:function(req,res) {

        if(req.method=='GET')
        {
            res.redirect ('/utilisateur');
        }
        req.file('photo')
            .upload({ dirname: pathPhotoUpload},function whenDone(err, uploadedFiles) {

                if (err) return res.serverError(err);
                else
                {
                    var chemin='';
                    var type='';
                    var cheminComplet='';
                        uploadedFiles.forEach(function(file){
                        cheminComplet=file.fd;
                        chemin=path.basename(file.fd);
                        console.log('NomFichier '+chemin +file.fd);
                        type=file.type;
                    });
                    Photo.create({cheminPhoto:chemin,typePhoto:type}).exec(function(err,photo)
                    {
                        if(err)
                        {
                            console.log('err ' +err);
                            console.log('cheminPhoto '+uploadedFiles.fd);
                            console.log('typePhoto '+uploadedFiles.type);

                            //res.view('utilisateur',{title:req.__('gestiondesutilisateurs.title'),message:req.__('utilisateur.erreur.inscription'),err:err,success:false});
                            res.redirect('/utilisateur?succces=false&err='+err+'&message='+req.__('utilisateur.erreur.inscription'));
                        }
                        else
                        {
                            console.log("Photo user enregistrée");
                            var utilisateur=req.body;
                            utilisateur.photo=photo.idPhoto;
                            console.log("Téléphone user "+utilisateur.telephone);
                            Utilisateur.create(utilisateur).exec(function(errU,utilisateur)
                            {
                                if(errU)
                                {
                                    //Si l'enregistrementde l'utilisateur echou on supprime la photo de la base et le fichier associé
                                    console.log("erreur enregistrement user "+errU);
                                   // res.view('utilisateur',{title:req.__('gestiondesutilisateurs.title'),message:req.__('utilisateur.erreur.inscription'),err:err,success:false,utilisateurs:null});
                                    Photo.destroy({idPhoto:photo.idPhoto}).exec(function(err,photo){
                                        if(err)
                                        {

                                        }else
                                        {
                                            fs.unlink(cheminComplet, function (err) {
                                                if (err) throw err;
                                                console.log('successfully deleted '+cheminComplet);
                                            });
                                            res.redirect('/utilisateur?succces=false&err='+errU+'&message='+req.__('utilisateur.erreur.inscription'));
                                        }
                                     })
                                }
                                else
                                {
                                    console.log("User enregistrée");

                                    res.redirect('/utilisateur?success=true&message='+req.__('utilisateur.success.inscription'));

                                }
                            })
                        }

                    })

                }
            });
    },

    /*fonction qui charge la vue de modification d'un utilisateur*/
    editUtilisateur:function(req,res)
    {
        Utilisateur.findOne({id:req.query.idutilisateur}).populate('photo').exec(function(err,utilisateur) {
            if (utilisateur) {
                var title=req.__('Modifier-un-utilisateur');
                res.view('editUtilisateur',{utilisateur:utilisateur,title:title,path:pathFromView});
            }
        })
    },

    /*Process de mise à jour d'un utilisateur*/
    updateUtilisateur:function(req,res)
    {
        console.log(req.body.id);
        Utilisateur.findOne({id:req.body.id}).exec(function(err,utilisateur){
            if(utilisateur)
            {
                console.log('utilisateur trouvé');
               Utilisateur.update({id:req.body.id},req.body).exec(function(err,utilisateur){
                   if(utilisateur)
                   {
                       console.log('utilisateur . nom ' +utilisateur.nom);
                       res.redirect('/utilisateur?success=true&update=true&message='+req.__('utilisateur.success.miseajour'));
                   }
                   if(err)
                   {
                       res.redirect('/utilisateur?success=false&update=false&message='+req.__('utilisateur.erreur.miseajour'));

                   }
               })
            }
        })
    },
    /*mise à jour de l'utilisateur depuis le phone(P)*/
    updateUtilisateurP:function(req,res)
    {
        var emailHasChange=false;
        //On verifie que l'utilisateur existe
        Utilisateur.findOne({id:req.body.id}).populate('photo').exec(function(err,utilisateur){
            if(utilisateur)
            {
                console.log("update "+req.body.email+ " "+req.body.id);
                console.log("utilisateur.email "+utilisateur.email);


                //L'utilisateur existe on check si l'email de l'utilisateur a changé
                if(utilisateur.email !=req.body.email)
                {

                    Utilisateur.findOne({email:req.body.email}).exec(function(err,utilisateur2){
                        if(utilisateur2)
                        {
                            emailHasChange=false;
                            req.body.confirmEmail="";
                            res.send({success: false,utilisateur:utilisateur,emailAlreadyExist:true});

                        }else
                        {
                            //L'email ayant changé on encode la nouvelle email en base 64 et l'on set confirEmail par la valeur obtenu
                            req.body.confirmEmail=new Buffer(req.body.email).toString("base64");
                            utilisateur.newEmail=req.body.email;
                            req.body.email=utilisateur.email;
                            utilisateur.confirmEmail=req.body.confirmEmail;
                            emailHasChange=true;
                            //Envoi de l'email à la nouvelle adresse renseignée par l'utilisateur
                            emailService.ConfirmEmail(utilisateur);
                            Utilisateur.update({id:req.body.id},req.body).exec(function(err,utilisateur){
                                if(utilisateur)
                                {
                                    Utilisateur.find({id:req.body.id}).populate('photo').exec(function(err,user)
                                    {
                                        console.log("utilisateur "+JSON.stringify(user));
                                        user[0].dateDeNaissance=moment(new Date(user[0].dateDeNaissance),"DD MMMM YYYY");
                                        if(user[0].confirmEmail=="")
                                        {
                                            user[0].emailVerifie=true;
                                        }
                                        if(user[0].confirmTel=="")
                                        {
                                            user[0].telephoneVerifie=true;
                                        }
                                        res.send({success: true,utilisateur:user[0],emailHasChange:emailHasChange,emailAlreadyExist:false});
                                    })
                                }
                                if(err)
                                {
                                    console.log("error "+err);
                                    res.send({success: false,err:err});
                                }
                            })
                        }

                    });

                }else
                {
                    //L'email n'a pas changé null
                    emailHasChange=false;
                    req.body.confirmEmail="";
                    Utilisateur.update({id:req.body.id},req.body).exec(function(err,utilisateur){
                        if(utilisateur)
                        {
                            Utilisateur.find({id:req.body.id}).populate('photo').exec(function(err,user)
                            {
                                console.log("utilisateur "+JSON.stringify(user));
                                user[0].dateDeNaissance=moment(new Date(user[0].dateDeNaissance),"DD MMMM YYYY");
                                if(user[0].confirmEmail=="")
                                {
                                    user[0].emailVerifie=true;
                                }
                                if(user[0].confirmTel=="")
                                {
                                    user[0].telephoneVerifie=true;
                                }
                                res.send({success: true,utilisateur:user[0],emailHasChange:emailHasChange,emailAlreadyExist:false});
                            })
                        }
                        if(err)
                        {
                            console.log("error "+err);
                            res.send({success: false,err:err});
                        }
                    })
                }

           }
        })
    },

    verifEmail:function(req,res)
    {
        Utilisateur.findOne({confirmEmail:req.query.verif}).exec(function(err,utilisateur){
            if(utilisateur)
            {
                var email=new Buffer(req.query.verif, 'base64');
                console.log("Nouvel Email "+email.toString());
                utilisateur.email=email.toString();
                utilisateur.confirmEmail=null;

                Utilisateur.update({id:utilisateur.id},{email:utilisateur.email,confirmEmail:utilisateur.confirmEmail}).exec(function(err,user){
                    if(user)
                    {
                        res.redirect(sails.config.myconf.siteUrl+"/success.html");
                       // res.view('verifEmail',{baseUrl:sails.getBaseurl(),infoContact:"info@occastreet.com",siteUrl:"www.occazstreet.com"});
                    }
                    if(err)
                    {
                        console.log("error update "+JSON.stringify(err));
                        res.notFound()
                    }
                })
            }
            else
            {
                res.view("404");

            }
            if(err)
            {
                console.log(err);
                res.view("404");
            }
        });
    },

    validerPhone:function(req,res)
    {

        //Génération du code de verification à envoyer à l'utilisateur
         var code= Math.floor(1000 + Math.random() * 9000);

        Utilisateur.findOne({id:req.query.idutilisateur}).exec(function(err,utilisateur){
            if(utilisateur) {
                utilisateur.confirmTel = code;
                utilisateur.telephone=req.query.telephone;
                Utilisateur.update({id: utilisateur.id},{confirmTel:utilisateur.confirmTel,telephone:utilisateur.telephone}).exec(function (err, uti) {
                    if(uti)
                    {
                        smsService.sendSMS(code,req.query.telephone);
                        res.send({codeVerificationEnvoye:'true'});
                    }
                    else
                    {
                        console.log(err);
                        res.send({codeVerificationEnvoye:'false'});
                    }
                    if(err)
                    {
                        console.log(err);
                    }
                })
            }
            if(err)
            {
                console.log(err);
            }
        })

    },

    validerCode:function(req,res)
    {
        Utilisateur.find()
            .where({ id: req.query.idutilisateur})
            .where({confirmTel:req.query.code}).exec(function(err,utilisateur) {
            if(typeof utilisateur !== 'undefined' && utilisateur.length > 0)
            {

                console.log("find"+JSON.stringify(utilisateur));
                utilisateur[0].confirmTel="";
                console.log(utilisateur[0].id);
                Utilisateur.update({id: utilisateur[0].id}, {confirmTel:utilisateur[0].confirmTel}).exec(function (err, uti) {
                    if (uti) {
                        console.log("uti"+JSON.stringify(uti));

                        res.send({codeCorrecte: 'true'});
                    }
                    else {
                        res.send({codeCorrecte: 'false'});
                    }
                    if (err) {
                        console.log(err);
                    }
                })
            }
            else
            {
                console.log("codeCorrecte: 'false'");
                res.send({codeCorrecte: 'false'});

            }
            if(err)
            {
                console.log(err);
            }

        })
    },
    /*Suppression d'un utilisateur et retour view*/
    deleteUtilisateur:function(req,res) {
        Utilisateur.findOne({id: req.body.idutilisateur}).exec(function (err, utilisateur) {
            if (utilisateur) {
                Photo.findOne({idPhoto: utilisateur.idPhoto}).exec(function (err, photo) {
                    if (photo) {
                        console.log("resolv path "+pathPhoto+photo.cheminPhoto);
                        fs.unlink(pathPhoto+photo.cheminPhoto, function (err) {
                            if (err) throw err;
                            console.log('successfully deleted ' + path.normalize(photo.cheminCompletPhoto));
                            Photo.destroy({idPhoto: photo.idPhoto}).exec(function (err, photo) {
                                if (photo) {
                                    Utilisateur.destroy({id: req.body.idutilisateur}).exec(function (err, utilisateur) {
                                        res.redirect('/utilisateur?success=true&destroy=true&message=' + req.__('utilisateur.success.inscription'));
                                    })
                                }
                            })
                        });

                    }
                })
            }
        })
    },
    /*Suppression dun utilisateur et return flux json*/
    deleteUtilisateurP:function(req,res)
    {
            console.log('Id utilisateur '+req.body.idutilisateur);
            Utilisateur.findOne({id:req.body.idutilisateur}).populate('photo').exec(function(err,utilisateur){
                if(utilisateur)
                {
                    console.log('utilisateur trouvé '+utilisateur);
                    photo='';

                    console.log('idphoto associé au user '+utilisateur.photo.idPhoto);

                    Photo.findOne({idPhoto:utilisateur.photo.idPhoto}).exec(function(err,photo){
                        if(photo)
                        {
                            console.log("photo trouvé");
                            console.log("chemin photo à supprimer"+pathPhoto+photo.cheminPhoto);
                            fs.unlink(pathPhoto+photo.cheminPhoto, function (err1) {
                                if (err1) res.send({success:false,err:err1});
                                console.log("erreur suppresion"+err1);
                                console.log('successfully deleted '+pathPhoto+photo.cheminPhoto);
                                Photo.destroy({idPhoto:photo.idPhoto}).exec(function(err,photo)
                                {
                                    if(photo)
                                    {
                                        Utilisateur.destroy({id:req.body.idutilisateur}).exec(function(err,utilisateur){
                                            res.send({success:'true',destroy:'true',message:req.__('utilisateur.success.suppresion')});
                                        })
                                    }
                                })
                            });

                        }
                       if(err)
                       {
                           res.send({success:false,err:err1});
                       }
                    })
                }
                if(err)
                {
                    res.send({success:false,err:err});
                }
            })
    },
    /*desactivation d'un utilisateur*/
    disableUtilisateur:function(req,res)
    {
        Utilisateur.findOne({id:req.body.idutilisateur}).populate('photo').exec(function(err,utilisateur) {
            if (utilisateur) {
                console.log("Utilisateur "+utilisateur.statut);
                utilisateur.statut='I';
                utilisateur.save(function (err, utilisateur) {
                    if(utilisateur)
                    {
                        console.log("Utilisateur "+utilisateur.statut);
                        res.send({success:'true',utilisateur:utilisateur,message:req.__('utilisateur.success.desactivation')})
                    }
                    if(err)
                    {
                        res.send({success:'false',message:req.__('utilisateur.erreur.desactivation')})
                    }
                })
            }
        })
    },

    /*Activation d'un utilisateur*/
    enableUtilisateur:function(req,res)
    {
        Utilisateur.findOne({id:req.body.idutilisateur}).exec(function(err,utilisateur) {
            if (utilisateur) {
                console.log("Utilisateur "+utilisateur.statut);
                utilisateur.statut='A';
                utilisateur.save(function (err, utilisateur) {
                    if(utilisateur)
                    {
                        console.log("Utilisateur "+utilisateur.statut);
                        res.send({success:'true',utilisateur:utilisateur,message:req.__('utilisateur.success.activation')})
                    }
                    if(err)
                    {
                        res.send({success:'false',message:req.__('utilisateur.erreur.activation')})
                    }
                })
            }
        })
    },

    getUtilisateurById:function(req,res)
    {
        UtilisateurService.getUtilisateurById({idutilisateur:req.query.idutilisateur},function(err,utilisateur){

            if(utilisateur)
            {
                if(utilisateur.confirmEmail=="")
                {
                    utilisateur.emailVerifie=true;
                }
                if(utilisateur.confirmTel=="")
                {
                    utilisateur.telephoneVerifie=true;
                }
                res.send({utilisateur:utilisateur});
            }
            if(err)
            {
                res.send({err:err});
            }
        })
    },

    authenticate:function(req,res)
    {
        console.log("UtilisateurController.authenticate");
        console.log("mot de passe recu "+req.body.password);
        UtilisateurService.getUtilisateurByEmailAndPassword({email:req.body.email,password:req.body.password},function(err,utilisateur){
            if (err) {
                console.log("L'erreur suivante est survenue lors de l'inscription ==> "+err);
                res.json({
                    success: false,
                    data: "Error occured: " + err
                });
            }
            if (utilisateur) {
                console.log("Authentification reussi");
                console.log("Utilisateur authentifié ==>"+utilisateur.nom);
                utilisateur.token = jwt.sign(utilisateur, token_secret);
                utilisateur.dateDerniereConnexion=new Date();
                utilisateur.save(function(err, utilisateur1) {
                  if(err)
                  {
                    console.log("erreur update user"+err);
                  }else{
                    utilisateur1.dateDeNaissance=moment(new Date(utilisateur1.dateDeNaissance),"DD MMMM YYYY");
                    res.json({
                      success: true,
                      data: utilisateur1
                    });
                  }

                });

            } else {
                console.log("Authentification echoué");
                res.json({
                    success: false,
                    data: "Incorrect email/password"
                });
           }


        })

    },

    signup:function(req,res)
    {
        var utilisateur={};
        utilisateur.email = req.body.email;
        utilisateur.nom = req.body.nom;
        utilisateur.prenom=req.body.prenom;
        utilisateur.password=req.body.password;
        utilisateur.dateDeNaissance=new Date(req.body.dateDeNaissance);
        utilisateur.dateInscription=new Date();
        utilisateur.dateDerniereConnexion=new Date();
        utilisateur.telephone=req.body.telephone;
        utilisateur.sexe=req.body.sexe;
        utilisateur.device=req.body.device;
        utilisateur.os=req.body.os;
        utilisateur.provider='Normal';
        Utilisateur.findOne({email:req.body.email,
            or : [
                { provider: 'Facebook' },
                { provider: 'Google' }
            ]}).exec(function(err,ut){
            if(ut)
            {
                Utilisateur.update({id:ut.id},utilisateur).exec(function(err,utilisateur1){
                    if(err)
                    {
                        console.log("Erreur mise à jour de l'utilisateur "+err);
                    }
                    if(utilisateur1)
                    {
                        Utilisateur.findOne({id:utilisateur1[0].id}).populate('photo').exec(function(err,u2){
                            console.log("valeur retournée à l'appli==>"+JSON.stringify(u2));
                            u2.dateDeNaissance=moment(new Date(u2.dateDeNaissance),"DD MMMM YYYY");
                            if(u2){
                                res.json({
                                    success: true,
                                    data: u2
                                });
                            }
                        })
                    }
                });
            }
            else
            {
                console.log("utilisateur n'existe pas pour google ou facebook");
                Utilisateur.findOne({email:req.body.email,provider:'Normal'}).exec(function(err,u3){
                    if(u3)
                    {
                        console.log("utilisateur trouvéééééééé=> "+JSON.stringify(u3));
                        res.json({
                            success:false,
                            existant:true,
                            message:req.__('utilisateur.deja.existant')
                        })
                    }else
                    {
                        console.log("Utilisateur Inscription "+JSON.stringify(utilisateur));
                        Utilisateur.create(utilisateur).exec(function(err,uti)
                        {
                            if(err)
                            {
                                console.log(err);
                                res.json({
                                    success: false,
                                    message: req.__( "inscritpion.erreur"),
                                    err:err
                                });
                            }
                            if(uti)
                            {
                                console.log("Utilisateur crée");
                                uti.token = jwTokenService.issue({id: uti});
                                Utilisateur.update({id:uti.id},{token:uti.token}).exec(function(err,utilisateur1){
                                    if(err)
                                    {
                                        console.log("Erreur update token user "+err);
                                    }
                                    if(utilisateur1)
                                    {
                                        Utilisateur.findOne({id:utilisateur1[0].id}).populate('photo').exec(function(err,u2){
                                            console.log("valeur retournée à l'appli==>"+JSON.stringify(u2));
                                            u2.dateDeNaissance=moment(new Date(u2.dateDeNaissance),"DD MMMM YYYY");
                                            u2.dateDeNaissance=moment(new Date(u2.dateDeNaissance),"DD MMMM YYYY");
                                            if(u2){
                                                res.json({
                                                    success: true,
                                                    data: u2
                                                });
                                            }

                                        })
                                    }
                                });
                            }
                        })
                    }
                })
            }
        })
    },

    isLogged:function(req,res)
    {
        var bearerToken;
        var bearerHeader = req.headers["authorization"];
        if (typeof bearerHeader !== 'undefined') {
            var bearer = bearerHeader.split(" ");
            bearerToken = bearer[1];
            req.token = bearerToken;
            Utilisateur.findOne({token: req.token}, function(err, utilisateur) {
                if (err) {
                    res.json({
                        success: false,
                        data: "Error occured: " + err
                    });
                } else {
                    utilisateur.dateDeNaissance=moment(new Date(utilisateur.dateDeNaissance),"DD MMMM YYYY");
                    res.json({
                        success: true,
                        data: utilisateur
                    });
                }
            });        } else {
            res.send(403);
        }

    },

    isTokenExpired:function(req,res)
    {
        Utilisateur.findOne({token: req.query.token}).exec(function(err, utilisateur) {
            if (err) {
                console.log("isTokenExpired ==>"+err);
                res.json({
                    err:err,
                    success: true
                });
            }
            if(utilisateur){
                console.log("isTokenExpired : Utilisateur connecté"+utilisateur);
                utilisateur.dateDeNaissance=moment(new Date(utilisateur.dateDeNaissance),"DD MMMM YYYY");
                res.json({
                    success: false,
                    utilisateur:utilisateur
                });
            }
            else
            {
                console.log("isTokenExpired ==>"+err);

                res.json({
                    success: true
                });
            }
        });
    },

    oauth:function(req,res)
    {
        console.log(JSON.stringify(req.body));
        var https = require('https');
        var user={};
        if(req.body.provider==='Facebook')
        {
            console.log("token "+req.body.token);
            var optionsGet = {
                host : 'graph.facebook.com',
                port : 443,
                path : '/v2.5/me?access_token='+req.body.token+'&fields=birthday,email,location,gender,first_name,last_name,picture{url}'
            };
            var userData=req.body;
            var reqGet = https.get(optionsGet, function(result) {
                result.on('data', function (d) {
                    var dataInfoUser=JSON.parse(d);
                    user.nom=dataInfoUser.first_name;
                    user.prenom=dataInfoUser.last_name;
                    user.email=dataInfoUser.email;
                    user.dateDeNaissance=dataInfoUser.birthday;
                    var location=dataInfoUser.location.name.split(", ");
                    user.os=userData.os;
                    user.device=userData.device;
                    user.telephone=userData.telephone;
                    user.nomVille=location[0];
                    user.nomPays=location[1];
                    user.provider='Facebook';
                    user.oauthUserId=dataInfoUser.id;
                    user.password="";
                    if(dataInfoUser.gender==='male')
                    {
                        user.sexe=1;
                    }else
                    {
                        user.sexe=2;
                    }
                    imageService.download_file(dataInfoUser.picture.data.url,pathPhoto,'Facebook',function(err, cheminPhoto) {

                        if(cheminPhoto)
                        {
                            console.log("cheminPhoto "+cheminPhoto);
                            Photo.findOrCreate({cheminPhoto:cheminPhoto},{cheminPhoto:cheminPhoto}).exec(function(err,photo)
                            {
                                console.log(JSON.stringify(photo));
                                if(photo)
                                {
                                    user.photo=photo.idPhoto;
                                }
                                if(err)
                                {
                                    console.log(err);
                                    user.photo=1;
                                }
                                console.log("Info User"+JSON.stringify(user));
                                Utilisateur.findOne({email:user.email,
                                    or : [
                                        { provider: 'Normal' },
                                        { provider: req.body.provider },
                                        {provider: 'Google'}

                                    ]}).populate('photo').exec(function(err,u){
                                    if(u)
                                    {
                                        console.log("Mise à jour de l'utilisateur ");
                                        Utilisateur.update({email:u.email},{photo:user.photo}).exec(function(err,u1){
                                            if(u1){
                                                Utilisateur.findOne({id:u1[0].id}).populate('photo').exec(function(err,u2){
                                                    console.log("valeur retournée à l'appli==>"+JSON.stringify(u2));
                                                    u2.dateDeNaissance=moment(new Date(u2.dateDeNaissance),"DD MMMM YYYY");

                                                    if(u2){
                                                        res.json({
                                                            success: true,
                                                            data: u2
                                                        });
                                                    }

                                                })
                                            }
                                            if(err)
                                            {
                                                console.log(err);
                                                res.json({
                                                    success: false,
                                                    message: req.__( "inscritpion.erreur"),
                                                    err:err
                                                });
                                            }
                                        })
                                    }else
                                    {
                                        console.log("Création de l'user ");
                                        console.log("user a crée"+JSON.stringify(user));
                                        Utilisateur.create(user).exec(function(err,u1){
                                            if(err)
                                            {
                                                if(err)
                                                {
                                                    console.log(err);
                                                    res.json({
                                                        success: false,
                                                        message: req.__( "inscritpion.erreur"),
                                                        err:err
                                                    });
                                                }

                                            }
                                            if(u1)
                                            {
                                                Utilisateur.findOne({id:u1.id}).populate('photo').exec(function(err,u2){
                                                    u2.dateDeNaissance=moment(new Date(u2.dateDeNaissance),"DD MMMM YYYY");
                                                    if(u2){
                                                        res.json({
                                                            success: true,
                                                            data: u2
                                                        });
                                                    }

                                                })
                                            }

                                        })
                                    }
                                    if(err)
                                    {
                                        console.log(err);
                                        res.json({
                                            success: false,
                                            message: req.__( "inscritpion.erreur"),
                                            err:err
                                        });
                                    }
                                })
                            });
                        }
                        if (err)
                        {
                            console.log("Erreur recupération photo ==> "+err);
                            console.log("Tout de meme on poursuit l'inscription en lui allouant la photo de profil par defaut");
                            user.photo=1;

                        }

                    })
                }).on('error',function(e){
                  console.log("error==>"+e);
                  res.json({
                    success: false,
                    message: req.__( "inscritpion.erreur"),
                    err:e
                  });
                });
            });
        }
        if(req.body.provider==='Google'){

            var userData=req.body;

            user.email=userData.email;
            user.provider='Google';
            user.os=userData.os;
            user.device=userData.device;
            user.telephone=userData.telephone;
            user.token=userData.token;
            user.password="";
            user.nom=userData.nom;
            user.prenom=userData.prenom;
            user.sexe=userData.sexe;
            imageService.download_file(userData.imgUrl,pathPhoto,'Google',function(err, cheminPhoto) {
                if(cheminPhoto)
                {
                    Photo.findOrCreate({cheminPhoto:cheminPhoto},{cheminPhoto:cheminPhoto}).exec(function(err,photo)
                    {
                        console.log(JSON.stringify(photo));
                        if(photo)
                        {
                            user.photo=photo.idPhoto;
                        }
                        if(err)
                        {
                            console.log(err);
                            user.photo=1;
                        }
                        console.log("Info User"+JSON.stringify(user));
                        Utilisateur.findOne({email:user.email,
                            or : [
                                { provider: 'Normal' },
                                { provider: req.body.provider },
                                {provider: 'Facebook'}
                            ]}).exec(function(err,u){
                            if(u)
                            {
                                console.log("Mise à jour de l'utilisateur ");
                                console.log("utilisateur trouvé==>"+JSON.stringify(u));
                                Utilisateur.update({email:u.email},{photo:user.photo}).exec(function(err,u1){
                                    if(u1){
                                        console.log("user after update"+JSON.stringify(u1));
                                        Utilisateur.findOne({id:u1[0].id}).populate('photo').exec(function(err,u2){
                                            console.log("valeur retournée à l'appli==>"+JSON.stringify(u2));
                                            u2.dateDeNaissance=moment(new Date(u2.dateDeNaissance),"DD MMMM YYYY");
                                            if(u2){
                                                res.json({
                                                    success: true,
                                                    data: u2
                                                });
                                            }
                                        })
                                    }
                                    if(err)
                                    {
                                        console.log(err);
                                        res.json({
                                            success: false,
                                            message: req.__( "inscritpion.erreur"),
                                            err:err
                                        });
                                    }
                                })
                            }else
                            {
                                console.log("Création de l'user ");
                                Utilisateur.create(user).exec(function(err,u1){
                                    if(err)
                                    {
                                        if(err)
                                        {
                                            console.log(err);
                                            res.json({
                                                success: false,
                                                message: req.__( "inscritpion.erreur"),
                                                err:err
                                            });
                                        }

                                    }
                                    if(u1)
                                    {
                                        Utilisateur.findOne({id:u1.id}).populate('photo').exec(function(err,u2){
                                            console.log("utilisateur crée"+JSON.stringify(u2));
                                            u2.dateDeNaissance=moment(new Date(u2.dateDeNaissance),"DD MMMM YYYY");
                                            if(u2){
                                                res.json({
                                                    success: true,
                                                    data: u2
                                                });
                                            }

                                        })
                                    }
                                })
                            }
                            if(err)
                            {
                                console.log(err);
                                res.json({
                                    success: false,
                                    message: req.__( "inscritpion.erreur"),
                                    err:err
                                });
                            }
                        })
                    });
                }
                if (err)
                {
                    console.log("Erreur recupération photo ==> "+err);
                    console.log("Tout de meme on poursuit l'inscription en lui allouant la photo de profil par defaut");
                    user.photo=1;
                }
            });

        }

    },
    changePassword:function(req,res)
    {
        UtilisateurService.changePassword({email:req.body.email,oldPassword:req.body.oldPassword,newPassword:req.body.newPassword},function(err,utilisateur,passwordVerif){
            if(utilisateur)
            {
                console.log('ta');
                if(passwordVerif)
                {
                    res.json({
                        success:true,
                        passwordVerif:true
                    });
                }else {
                    console.log("tatata");
                    res.json({
                        success: false,
                        passwordVerif: false
                    });
                }
            }else
            {
                res.json({
                    success:false
                });
            }

        })
    },
    getActiviteUser:function(req,res) {
        var iduser = req.query.idutilisateur;
        console.log("dans la fonction getActiviteUser");

        var activiteUser = {};
        Utilisateur.findOne({id: iduser}, {select: ['dateInscription', 'dateDerniereConnexion']}).exec(function (err, u) {
            activiteUser.dateInscription = moment(new Date(u.dateInscription)).format("DD MMMM YYYY à HH:mm ");
            activiteUser.dateDerniereConnexion = moment(new Date(u.dateDerniereConnexion)).format("DD MMMM YYYY à HH:mm ");

            Article.count().where({utilisateur: iduser, etat: 'Vendu'}).exec(function (err, result) {
                if (err) {
                    activiteUser.nombreArticleVendu = 0;
                    res.json({
                        success: true,
                        activiteUser: activiteUser
                    });
                    console.log("une erreur est survenue lors de la recupération du nombre d'article vendu par l'utilisateur " + iduser + "==>" + err);
                }
                if (result != null) {

                    activiteUser.nombreArticleVendu = result;
                    Article.count().where({utilisateur: iduser, etat: 'Normal'}).exec(function (err2, result2) {
                        if (err2) {
                            console.log("une erreur est survenue lors de la recupération du nombre d'article publié par l'utilisateur " + iduser + "==>" + err);

                            res.json({
                                success: false,
                                activiteUser: activiteUser
                            });
                        }
                        activiteUser.nombreArticlePublie = result2;
                        res.json({
                            success: true,
                            activiteUser: activiteUser
                        });

                    })
                }

            })
        })
    },
    uploadPhoto:function(req,res)
    {
        console.info("utilisateur.UploadPhoto: Debut de l'upload de l'image");

        req.file('file')
            .upload({ dirname: '../../assets/photoUtilisateur'},function (err, uploadedFiles) {

                if (err) return res.serverError(err);
                else {
                    var chemin = '';
                    var type = '';
                    uploadedFiles.forEach(function (file) {
                        chemin = require('path').basename(file.fd);
                        type = file.type;
                        console.log("le chemin du fichier importé "+chemin);

                        Utilisateur.findOne({id:req.body.idUtilisateur}).exec(function(err,utilisateur) {
                            if(utilisateur.photo !=1)
                            {
                                Photo.findOne({idPhoto:utilisateur.photo}).exec(function(err, p){
                                    Photo.destroy({idPhoto:utilisateur.photo}).exec(function(err,ph){
                                        console.log("detroyed photo "+JSON.stringify(p));
                                        fs.unlink(sails.config.paths.public+pathFromView+p.cheminPhoto, function (err) {
                                            if (err)
                                            {
                                                res.send({success:false});
                                                throw err;
                                            }
                                            console.info('successfully deleted ol photo '+sails.config.paths.public+pathFromView+p.cheminPhoto);
                                            Photo.create({cheminPhoto:chemin, typePhoto:type}).exec(function(err,photo){
                                                if (err)
                                                {
                                                    console.log("erreur upload photo "+err);
                                                    res.send({success:false});
                                                }
                                                console.log("idUtilisateur "+req.body.idUtilisateur);

                                                if(photo)
                                                {
                                                    Utilisateur.findOne({id:req.body.idUtilisateur}).exec(function(err,u) {
                                                        if (u)
                                                        {
                                                            u.photo=photo.idPhoto;
                                                            console.log("photo" +JSON.stringify(photo));
                                                            Utilisateur.update({id:u.id,email: u.email},{photo:photo.idPhoto}).exec(function(err,u1) {
                                                                console.log('u1'+JSON.stringify(u1));
                                                                if (u1) {
                                                                    res.send({success:true,utilisateur:u1});
                                                                }else
                                                                {
                                                                    console.log("destroyy photo");
                                                                    Photo.destroy({idPhoto:u1.photo}).exec(function(err,p){
                                                                        fs.unlink(sails.config.path+pathPhoto+p.cheminPhoto, function (err) {
                                                                            if (err) throw err;
                                                                            console.info('successfully deleted '+sails.config.path+pathPhoto+p.cheminPhoto);
                                                                        });
                                                                    });
                                                                    res.send({success:false});
                                                                }
                                                            });
                                                        }else
                                                        {
                                                            console.log("photo "+photo.idPhoto);
                                                            Photo.destroy({idPhoto:photo.idPhoto}).exec(function(err,p){
                                                                console.log(JSON.stringify(p));
                                                                fs.unlink(sails.config.paths.public+pathFromView+photo.cheminPhoto, function (err) {
                                                                    if (err) throw err;
                                                                    console.info('successfully deleted '+sails.config.paths.public+pathFromView+pathPhoto+photo.cheminPhoto);
                                                                });
                                                            });
                                                            res.send({success:false});
                                                        }
                                                    });
                                                }
                                            })
                                        });
                                    });

                                });

                            }else
                            {
                                Photo.create({cheminPhoto:chemin, typePhoto:type}).exec(function(err,photo){
                                    if (err)
                                    {
                                        console.log("erreur upload photo "+err);
                                        res.send({success:false});
                                    }
                                    console.log("idUtilisateur "+req.body.idUtilisateur);

                                    if(photo)
                                    {
                                        Utilisateur.findOne({id:req.body.idUtilisateur}).exec(function(err,u) {
                                            if (u)
                                            {
                                                u.photo=photo.idPhoto;
                                                Utilisateur.update({id:u.id},{photo:photo.idPhoto}).exec(function(err,u1) {
                                                    if (u1) {
                                                        res.send({success:true,utilisateur:u1});
                                                    }else
                                                    {
                                                        Photo.destroy({idPhoto:u1.photo}).exec(function(err,p){
                                                            fs.unlink(sails.config.path+pathPhoto+p.cheminPhoto, function (err) {
                                                                if (err) throw err;
                                                                console.info('successfully deleted '+sails.config.path+pathPhoto+p.cheminPhoto);
                                                            });
                                                        });
                                                        res.send({success:false});
                                                    }
                                                });
                                            }else
                                            {
                                                console.log("photo "+photo.idPhoto);
                                                Photo.destroy({idPhoto:photo.idPhoto}).exec(function(err,p){
                                                    console.log(JSON.stringify(p));
                                                    fs.unlink(sails.config.paths.public+pathFromView+photo.cheminPhoto, function (err) {
                                                        if (err) throw err;
                                                        console.info('successfully deleted '+sails.config.paths.public+pathFromView+pathPhoto+photo.cheminPhoto);
                                                    });
                                                });
                                                res.send({success:false});
                                            }
                                        });
                                    }
                                })
                            }

                        })

                    });

                }
            });
    },

    temporaryPasswordGen:function (len)
    {
        var text="";
        var charset="ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";

        for(var i=0;i<len;i++)
        {
            text +=charset.charAt(Math.floor(Math.random()*charset.length));
        }
        return text;
    },

    reInitPassword:function(req,res)
    {
        console.log("UtilisateurController.reinitPassword  "+req.body.email);
        Utilisateur.findOne({email:req.body.email}).exec(function(err,user){
           if(user)
           {
               var tempPassword="";
               var charset="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
               for(var i=0;i<8;i++)
               {
                   tempPassword +=charset.charAt(Math.floor(Math.random()*charset.length));
               }
               sails.log("utilisateur trouvé" +user.email);
               //Génération du mot de passe temporaire  à envoyer à l'utilisateur
              // var code= Math.floor(1000 + Math.random() * 9000);
               emailService.sendMailReInitPassword(user,tempPassword);
               sails.log("code "+tempPassword);

               Utilisateur.update({email:user.email},{password: passwordHash.generate(tempPassword)}).exec(function(err,user){
                    res.send({success:true,user:user});
               })

           }else
           {
               sails.log(user);
               res.send({success:false});
           }
        })
    }

};
