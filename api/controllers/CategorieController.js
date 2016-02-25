/**
 * CategorieController
 *
 * @description :: Server-side logic for managing Categories
 * @help        :: See http://links.sailsjs.org/docs/controllers
 */
"use stricts"
module.exports = {

    /*Creation d'une nouvelle categorie*/
    createCategorie:function (req, res)
    {
        Categorie.findOne({libelle:req.body.libelle}).exec(function(err,categorie)
        {
            if(!categorie && !err)
            {
                Categorie.create(req.body).exec(function(err,categorie)
                {
                    if(categorie)
                    {
                        res.send({message:'Categorie crée avec success',success:true})
                    }

                    if(err)
                    {
                        res.send({message:'Une erreur est survenue pendant la creation de la categorie',success:false, err:err})

                    }
                });
            }

            if(categorie)
            {
                res.send({message:'Cette catégorie existe déjà en base de donnée',success:false, err:err})

            }

            if(err)
            {
                res.send({message:'Une erreur est survenue pendant la création de la categorie',success:false, err:err})

            }
        })

    },

    /*Modification de la catégorie dont l'ID est passé en paramètre*/
    editCategorie:function(req,res)
    {
        Categorie.findOne({idcategorie:req.body.idcategorie}).exec(function(err,categorie)
        {
             if(categorie)
             {

                 if(categorie.libelle==req.body.libelle)
                 {
                     res.send({message:'Cette catégorie existe déjà en base de donnée',success:false})

                 }
                 else
                 {
                     categorie.libelle=req.body.libelle;
                     Categorie.update({idcategorie:req.body.idcategorie},{libelle:categorie.libelle}).exec(function(err){

                         if(err)
                         {
                             res.send({message:'Un problème est survenue lors de la mise à jour de la categorie',success:false,err:err,categorie:categorie});

                         }
                         else
                         {
                             res.send({message:'La categorie a été mise à jour avec success',success:true});
                         }
                     })
                 }
             }
            else
             {
                 res.send({messaege:'Cette categorie n\'existe pas en base',success:false});

             }
            if(err)
            {
                res.send({messaege:'Une erreur est survenue lors de la recherche de la categorie en base',success:false,err:err});
            }
        })
    },

    /*Suppression catégorie dont l'ID est passé en paramètre*/
    deleteCategorie:function (req,res)
    {
        Categorie.findOne({idcategorie:req.body.idcategorie}).exec(function(err,categorie)
        {
            if(categorie)
            {
                console.log('categorie => '+categorie.libelle);
                Categorie.destroy({idcategorie:categorie.idcategorie}).exec(function(err,categorie)
                {
                    if(categorie)
                    {
                        res.send({message:'Categorie supprimée',success:true});
                    }
                    if(err)
                    {
                        res.send({message:'Un problème est survenue lors de la suppression de la categorie',success:false,err:err,categorie:categorie});
                    }
                })
            }

            if(err)
            {
                res.send({message:'La categorie n\'existe pas',success:false,err:err});
            }
        })
    },

    /*On remonte toutes les catégories existante*/
    getAllCategorie:function (req,res)
    {
        CategorieService.getAllCategorie(function(err, categories){
            if(categories)
            {
                console.log(categories);
                res.send({categories: categories});
            }

            if(err)
            {

            }
        })

    }
	
};

