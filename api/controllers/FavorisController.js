/**
 * FavorisController
 *
 * @description :: Server-side logic for managing favoris
 * @help        :: See http://links.sailsjs.org/docs/controllers
 */

module.exports = {

    /*On remonte tous les favoris*/
    getAllFavoris:function(req,res)
    {
      Favoris.find().exec(function(err,favoris)
      {
        if(favoris)
        {
            res.send({message:'La liste des favoris',success:true,favoris:favoris})
        }
        else
        {
            res.send({messsage:'Aucun favoris existant',success:true,favoris:false})
        }
        if(err)
        {
            res.send({message:'Une erreur est survenue lors de la recupération de la liste des favoris',success:false,err:err})
        }
      })
    },

    /*On remonte les favoris d'un utilisateur*/
   getFavorisByUser:function(req,res)
    {
        var idUtilisateur=req.query.idutilisateur;
        Favoris.findOne({idUtilisateur:idUtilisateur}).exec(function(err,favoris){

            if(favoris)
            {
                res.send({message:'La liste des favoris',success:true,favoris:favoris});
            }else
            {
                res.send({message:'Aucun favoris trouvé pour cet utilisateur',success:true,favoris:favoris});
            }
            if(err)
            {

                res.send({message:'Une erreur est survenu lors de lors du traitement',success:false});
            }
        });

    },

    /*Ajout d'un article comme favoris par un utilisateur*/
    ajouterFavoris:function(req,res)
    {
        Favoris.findOne({idArticle:req.query.idarticle}).exec(function(err,favoris){
            console.log("article "+req.query.idarticle);
            if(favoris)
            {
                res.send({message:'Cette article est déjà comme favoris',success:false,favoris:favoris})
            }
            else
            {
                Utilisateur.findOne({id:req.query.idutilisateur}).exec(function(err,utilisateur)
                {
                    if(utilisateur)
                    {
                        Article.findOne({idArticle:req.query.idarticle}).exec(function(err,article){

                            if(article)
                            {
                                Favoris.create(req.query).exec(function(err,favoris)
                                {
                                    if(favoris)
                                    {
                                        res.send({message:'Article ajouté en favoris avec succces',success:true,favoris:favoris});
                                    }

                                    if(err)
                                    {
                                        res.send({message:'Une erreur est survenue lors de l\'ajout de l\'article comme favoris',success:false,err:err});
                                    }
                                })
                            }
                            else
                            {
                                res.send({message:'L\'article que vous essayez d\'ajouter en favoris n\'existe pas',success:false});
                            }
                            if(err)
                            {
                                res.send({message:'Une erreur est survenue lors de la recherche de l\'article en base',success:false,err:err});
                            }
                        })
                    }
                    else
                    {
                        res.send({message:'Utilisateur inexistant',success:false});

                    }

                    if(err)
                    {
                        res.send({message:'Erreur rencontré lors de la recherche de l\'utilisateur',success:false,err:err});

                    }
                });

            }

            if(err)
            {
                res.send({message:'Une erreur est survenu lors de la vérification que l\'article ne soit pas déjà en favoris pour l\'utilisateur',success:false,err:err});
            }
        })
    }

};

