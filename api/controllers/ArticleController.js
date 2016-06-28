/**
 * ArticleController
 *
 * @description :: Server-side logic for managing articles
 * @help        :: See http://links.sailsjs.org/docs/controllers
 */

var moment=require('moment');
var repertoireImage='/imagesArticle/';
module.exports = {

    /*view*/
    indexArticle:function(req,res)
    {
        var title=req.__('gestiondesarticles.title');
        CategorieService.getAllCategorie(function(err, categories){
            if(categories)
            {
                UtilisateurService.getAllUtilisateur(function(err,utilisateurs){
                    if(utilisateurs)
                    {
                        ArticleService.getAllArticleActif(function(err,articles) {
                            if (articles) {
                                articles.forEach(function(article){
                                    article.dateAjout=moment(article.dateAjout).format("DD/MM/YYYY");
                                })
                                res.view('article', {message: req.__('article.success.creation'), title:title, articles: articles, categories: categories, utilisateurs: utilisateurs});
                            }
                            if (err) {
                                res.view('article', {message: req.__('article.erreur.recuperation'), success: false, articles: articles, categories: categories, utilisateurs: utilisateurs});

                            }
                        })
                    }
                })
            }
        });
    },

    /*Chargement vue d'ajout d'un article*/
    addArticle:function(req,res){
        var title=req.__('gestiondesarticles.title');
        CategorieService.getAllCategorie(function(err, categories){
            if(categories)
            {
                UtilisateurService.getAllUtilisateur(function(err,utilisateurs){
                    if(utilisateurs)
                    {

                       res.view('addArticle', {message: req.__('article.success.creation'), title:title,  categories: categories, utilisateurs: utilisateurs});
                    }
                })
            }
        });

    },
    /*Chargement vue édition d'article*/
    editArticle:function(req,res){
        var title=req.__('gestiondesarticles.title');
        ArticleService.getArticleById({idarticle:req.query.idarticle},function(err,article){
            console.log(article.titre);
            if(article)
            {
                res.view('editArticle', {title:title,  article: article});
            }

            if(err)
            {
                console.log("error "+err);
            }
        })
       /* CategorieService.getAllCategorie(function(err, categories){
            if(categories)
            {
               res.view('editArticle', {message: req.__('article.success.creation'), title:title,  categories: categories});
            }
        });*/
    },

    /*Process Création d'un article by view*/
    createArticle: function (req, res) {
        var idArticle = req.body.idArticle;
        var article=req.body;
        /*article.titre = req.body.titre;
        article.details = req.body.details;
        article.prix = req.body.prix;
        article.etat = req.body.etat;*/
        //article.dateAjout=new Date();
        //article.statut='A';
        /*article.idutilisateur=req.body.idutilisateur;
        article.idcategorie=req.body.idcategorie;
        article.*/
        console.log("article.titre "+article.titre);
        console.log("article.details "+article.details);
        console.log("article.prix "+article.prix);
        console.log("article.dateAjout "+article.dateAjout);
        console.log("article.categorie "+article.categorie);
        console.log("article.statut "+article.statut);
        console.log("article.ville "+article.nomVille);
        console.log("article.pays "+article.nompays);


        if(req.method=='GET')
        {
            res.redirect ('/article');
        }

        Article.create(article).exec(function (err, article) {
            if (err) {
                CategorieService.getAllCategorie(function(err, categories){
                    if(categories)
                    {
                        UtilisateurService.getAllUtilisateur(function(err,utilisateurs) {
                            if (utilisateurs) {
                                res.view('article', {message: req.__('image.erreur.createarticle'), success: false, err: err, categories: categories, utilisateurs: utilisateurs})

                            }
                        })
                    }
                })
            }
            else
            {
                req.file('image')
                    .upload({ dirname: '../../assets/imagesArticle'},function whenDone(err, uploadedFiles) {

                        if (err) return res.serverError(err);
                        else {
                            var chemin = '';
                            var type = '';
                            uploadedFiles.forEach(function (file) {
                                chemin = require('path').basename(file.fd);
                                type = file.type;

                                Image.create({cheminImage:chemin, typeImage:type,idArticle:article.idArticle}).exec(function(err,photo){
                                     if (err)
                                     {
                                         CategorieService.getAllCategorie(function(err, categories){
                                             if(categories)
                                             {
                                                 UtilisateurService.getAllUtilisateur(function(err,utilisateurs) {
                                                     if (utilisateurs) {
                                                         res.view('article', {message: req.__('image.erreur.createarticle'), success: false, err: err, categories: categories, utilisateurs: utilisateurs})
                                                     }
                                                 })
                                             }
                                         })
                                     }

                                     else
                                     {
                                         CategorieService.getAllCategorie(function(err, categories){
                                             if(categories)
                                             {
                                                 UtilisateurService.getAllUtilisateur(function(err,utilisateurs) {
                                                     if (utilisateurs) {

                                                         ArticleService.getAllArticle(function(err,articles){
                                                             if(articles)
                                                             {
                                                                 res.view('article', {message: req.__('article.success.creation'), success: true, articles: articles, categories:categories, utilisateurs: utilisateurs});
                                                             }
                                                             if(err)
                                                             {
                                                                 res.view('article', {message: req.__('article.erreur.recuperation'), success: true, articles: articles, categories:categories, utilisateurs: utilisateurs});

                                                             }
                                                         })
                                                     }
                                                 })
                                             }
                                         })
                                     }
                                })
                            });

                        }
                    });
            }
            /*if (err) {
                return res.send({success: false, message: 'message-erreur-misajour',err:err});
            }*/
        });
    },

    /*Procees creation d'un article mobile*/
    createArticleP: function (req, res) {
        var article=req.body;
        if(article.utilisateur==0)
        {
            console.error("article.addArticleP=>Une erreur a été rencontrée lors de l'ajout de l'article: "+err);
            return res.send({success:false,err:err,erroCode:404});
        }else
        {
            Article.create(article).exec(function (err, article) {

                if(article)
                {
                    emailService.sendMailArticleAjoute(article);
                    return res.send({success:true,article:article});
                }

                if(err)
                {
                    console.error("article.addArticleP=>Une erreur a été rencontrée lors de l'ajout de l'article: "+err);
                    return res.send({success:false,err:err});

                }
            })
        }

    },

    uploadImage:function(req,res)
    {
        console.info("article.UploadImage: Debut de l'upload de l'image");
        console.log(JSON.stringify(req.body.options));
        req.file('file')
            .upload({ dirname: '../../assets/imagesArticle'},function (err, uploadedFiles) {

                if (err) return res.serverError(err);
                else {
                    var chemin = '';
                    var type = '';
                    uploadedFiles.forEach(function (file) {
                        chemin = require('path').basename(file.fd);
                        type = file.type;
                        console.log("le chemin du fichier importé "+chemin);

                        Image.create({cheminImage:chemin, typeImage:type,article:req.body.idArticle}).exec(function(err,image){
                            console.log("creation de l'image pour l'article "+req.body.idArticle);
                            if (err)
                            {
                                console.log("Une erreur a été rencontrée lors de la création de l'image "+err);
                                res.send({success:false});
                            }

                            if(image)
                            {
                               res.send({success:true});
                            }
                        })
                    });

                }
            });
    },

    rollbackArticle:function(req,res)
    {
        var idArticle=req.query.idarticle;
        console.info("article.rollbackArticle =>"+idArticle);

        Article.destroy({idArticle:idArticle}).exec(function(err,article)
        {
            if(err)
            {
                console.log("erreur lors du rollback de l'article "+err);
                return res.send({success: false});
            }
            if(article)
            {
                console.log(article);
                Image.destroy({idArticle:article.idArticle}).exec(function(err,images){
                    if(images)
                    {
                        images.forEach(function(image){
                            fs.unlink(sails.config.paths.public+repertoireImage+image.cheminImage, function (err) {
                                if (err) throw err;
                                console.info('successfully deleted '+sails.config.paths.public+repertoireImage+image.cheminImage);
                            });
                        })
                    }
                });
                return res.send({success: true});
            }
        })
    },

    /*proccess update article*/
    updateArticle: function (req, res) {
        var idArticle = req.body.idArticle;
        console.log('idArticle to edit: '+ idArticle);
        Article.findOne({idArticle:idArticle}).exec(function (err, article) {
            console.log('article '+ article + ' trouvé');

            if (article) {
                var dataarticle = req.body.article;
                article.titre = dataarticle.titre;
                article.details = dataarticle.details;
                article.prix = dataarticle.prix;
                article.etat = dataarticle.etat;
                article.dateAjout=new Date();

                article.save(function (err, success) {
                    if (success) {
                        return res.send({articleupdate: true, article: article,success:true,message:req.__('message-success-creation')});
                    }
                    if (err) {
                        return res.send({success: false, message: 'message-erreur-misajour'})
                    }
                });
                return res.send({articleupdate: true, article: articleFound,success:true,message:req.__('message-success-creation')});

            }
            else
            {
                console.log('article '+ idArticle + ' pas trouvé');

                return res.send({success: false, message: 'message-erreur-article-non-trouve',err:err})
            }

        });
    },


    /*Process suppression article*/
    deleteArticleP: function (req, res) {
        var idArticle=req.body.idarticle;

        console.log('idArticle to delete: '+ idArticle);
        ArticleService.getArticleById({idarticle:req.body.idarticle},function(err,article) {
            if (article) {
                Article.destroy({idArticle:idArticle}).populate('images').exec(function(err,article)
                {
                    if(err)
                    {
                        return res.send({success: false, message: req.__('message-erreur-suppression')})
                    }
                    if(article)
                    {
                        console.log(article);
                        Image.destroy({idArticle:article.idArticle}).exec(function(err,images){
                            if(images)
                            {
                                console.log(images)
                                images.forEach(function(image){
                                    console.log(image);
                                    fs.unlink(sails.config.path+repertoireImage+image.cheminImage, function (err) {
                                        if (err) throw err;
                                        console.log('successfully deleted '+sails.config.path+repertoireImage+image.cheminImage);
                                    });
                                })
                            }
                        })
                        return res.send({success: true, success: true,message:req.__('message-success-suppression')})
                    }
                })
            }
            if(err)
            {
                return res.serverError();
            }
        })
    },
    /*Chargement view article inactif*/
    articleInactif:function(req,res){
        var title=req.__('gestiondesarticle.title')+'|'+req.__('article-inactif');
        console.log('success '+req.query.success);
        if(req.query.err)
        {
            res.view('addArticle',{title:title,err:req.query.err,message:req.query.message});
        }
        else
        {
            ArticleService.getAllArticleInactif(function(err, articles) {
                if (articles) {
                    /*articles.forEach(function(article){
                        article.dateAjout=moment(article.dateAjout).format("DD/MM/YYYY");
                        article.dateAjout=moment(article.dateAjout).format("DD/MM/YYYY");
                    });*/
                    res.view('articleInactif', {title: title, articles: articles,success:req.query.success});
                }
                if (err) {
                    res.view('articleInactif', {title: title, err: err});
                }
            })
        }
    },
    disableArticle:function(req,res)
    {
        console.log("article à desactiver "+req.body.idarticle);
        ArticleService.getArticleById({idarticle:req.body.idarticle},function(err,article){
            if(article)
            {
                console.log(article);
                article.statut='I';
                article.save(function (err, article) {
                    if(article)
                    {
                        res.send({success:'true',article:article,message:req.__('article.success.desactivation')})
                    }
                    if(err)
                    {
                        res.send({success:'false',message:req.__('article.erreur.desactivation')})
                    }
                })
            }
            if(err)
            {
                console.log("error "+err);
            }
        })
    },
    enableArticle:function(req,res) {
        ArticleService.getArticleById({idarticle: req.body.idarticle}, function (err, article) {
            if(article)
            {
                console.log(article);
                article.statut='A';
                article.save(function (err, article) {
                    if(article)
                    {
                        res.send({success:'true',article:article,message:req.__('article.success.activation')})
                    }
                    if(err)
                    {
                        res.send({success:'false',message:req.__('article.erreur.activation')})
                    }
                })
            }
            if(err)
            {
                console.log("error "+err);
            }

        })
    },

    signalerArticle:function(req,res)
    {
        console.log(JSON.stringify(req.body));
        var article =req.body.idarticle;
        ArticleService.getArticleById({idarticle: req.body.signalement.idarticle}, function (err, article) {

            if(article)
            {
                emailService.sendMailSignalementAnnonce(req.body.signalement,article);

                res.send({success:true});
            }
            if(err)
            {
                console.log("error "+err);
            }

        })
    },
    sendMessageContact:function(req,res)
    {
        emailService.sendMessageContact(req.body.contact);
        res.send({success:true});
    },
    getArticlesByLimit:function(req,res)
    {
        console.log("ArticleController.getArticlesByLimit");

        var nombreArticle=0;
        Article.count({where:{statut:'A'}}).exec(function countCB(error, found) {
            nombreArticle=found;
            ArticleService.getAllArticleActifByLimit({limit:req.query.limit,skip:req.query.skip},function(err,articles) {
                if (articles) {
                    articles.forEach(function (article) {
                        //article.dateAjout = moment(article.dateAjout).format("DD/MM/YYYY");
                        Utilisateur.findOne({id:article.utilisateur.id}).populate('photo').exec(function(err,utilisateur){
                            article["photo"]=utilisateur.photo;
                        });
                       /* Photo.findOne({idPhoto:article.utilisateur.photo}).exec(function(err,photo){
                            console.log( "photo detail" +JSON.stringify(photo));
                            article["photo"]=photo;
                            console.log(JSON.stringify(article));

                        })*/
                    });
                    res.send({articles: articles,hasArticle:true,nombreArticles:articles.length,nombreArticleTotal:nombreArticle});
                }
                else
                {
                    res.send({articles: articles,hasArticle:false,nombreArticleTotal:nombreArticle});
                }
                if (err) {
                    console.log(err);
                    //res.send({success: false,err:err});
                }
            })
        });

    },
    getAllArticles:function(req,res)
    {
        console.log("ArticleController.getAllArticles");

        ArticleService.getAllArticles(function(err,articles) {
            if (articles) {
                /*articles.forEach(function (article) {
                    article.dateAjout = moment(article.dateAjout).format("DD/MM/YYYY");
                });*/
                res.send({articles: articles,hasArticle:true,nombreArticles:articles.length});
            }
            else
            {
                res.send({articles: articles,hasArticle:false});
            }
            if (err) {
                console.log(err);
                //res.send({success: false,err:err});
            }
        })
    },
    getArticleByCategorie:function(req,res)
    {

        ArticleService.getArticleByCategorie({idcategorie: req.query.idcategorie},function(err,articles) {
            if (articles !==null && typeof articles !=='undefined'&& Object.keys(articles).length) {
                /*articles.forEach(function(article){
                    article.dateAjout=moment(article.dateAjout).format("DD/MM/YYYY");
                });*/
                res.send({articles: articles,hasArticle:true});
            }
            else
            {
                res.send({articles: articles,hasArticle:false});
            }
            if (err) {
                console.log(err);
                res.send({success: false,err:err});

            }
        })
    },

    getArticleById:function(req,res){
        ArticleService.getArticleById({idarticle:req.query.idarticle},function(err,article){
            if (article !==null && typeof article !=='undefined'&& Object.keys(article).length) {
                    //article.dateAjout=moment(article.dateAjout).format("DD/MM/YYYY");
                    res.send({article: article,success:true});
            }

            if (err) {
                res.send({success: false,err:err});

            }
        })
    },

    getArticlesVenduByUser:function(req,res)
    {
        sails.log("ArticleController.getArticlesVendutByUser");
        ArticleService.getArticlesVenduByUser({iduser:req.query.iduser},function(err,articles){
            if (articles) {
                /*articles.forEach(function(article){
                    article.dateAjout=moment(article.dateAjout).format("DD/MM/YYYY");
                });*/
                res.send({articles: articles,success: true});
            }

            if (err) {
                res.send({success: false,err:err});

            }
        })
    },

    getArticlesByUser:function(req,res)
    {
        sails.log("ArticleController.getArticlesByUser");
        ArticleService.getArticlesByUser({iduser:req.query.iduser},function(err,articles){
            if (articles) {
               /* articles.forEach(function(article){
                    article.dateAjout=moment(article.dateAjout).format("DD/MM/YYYY");
                });*/
                res.send({articles: articles,success: true});
            }else if (err) {
                res.send({success: false,err:err});

            }
        })
    },
    getArticlesFavorisByUser:function(req,res)
    {
        sails.log("ArticleController.getArticlesFavorisByUser");

        ArticleService.getArticlesFavorisByUser({iduser:req.query.iduser},function(err,articles){
        if (articles) {
          /*articles.forEach(function(article){
            article.dateAjout=moment(article.dateAjout).format("DD/MM/YYYY");
          });*/
          res.send({articles: articles,success: true});
        }

        if (err) {
          res.send({success: false});

        }
      })
    },

    updateArticle:function(req,res)
    {
      console.log(req.body);
      Article.update({idArticle:req.body.idArticle},req.body).exec(function(err,article)
      {
         if(article)
         {
           console.log("article mis à jour id "+JSON.stringify(article[0]));
           ArticleService.getArticleById({idarticle:article[0].idArticle},function(err,article){
             console.log("article modifier"+JSON.stringify(article));
              res.send({success:true,article:article});

           })
         }

        if(err)
        {
          console.log("erreur "+err);
          res.send({success:false})
        }
      })
    },

  deleteArticle:function(req,res){
    console.log(req.query.idarticle);
    Article.destroy({idArticle:req.query.idarticle}).populate('images').exec(function(err,article) {
      if (err) {
        return res.send({success: false, message: req.__('message-erreur-suppression')})
      }
      if (article) {
        console.log(article);
        Image.destroy({idArticle: article.idArticle}).exec(function (err, images) {
          if (images) {
            console.log(images)
            images.forEach(function (image) {
              console.log(image);
              fs.unlink(sails.config.path + repertoireImage + image.cheminImage, function (err) {
                if (err) throw err;
                console.log('successfully deleted ' + sails.config.path + repertoireImage + image.cheminImage);
              });
            })
          }
        })
        return res.send({success: true});
      }
    })
  },

  getArticlesByParam:function(req,res)
  {
      sails.log("ArticleController.getArticleByParam");
    ArticleService.getArticleByParam({parametre:req.body},function(err,articles){
      console.log("articles trouvés: "+JSON.stringify(articles));
      res.send({success:true,articles:articles});

    })
  }

};

