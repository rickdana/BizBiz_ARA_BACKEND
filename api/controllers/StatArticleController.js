/**
 * StatArticleController
 *
 * @description :: Server-side logic for managing statarticles
 * @help        :: See http://links.sailsjs.org/docs/controllers
 */

module.exports = {


    saveStat:function(req,res)
    {
        var statArticle=req.body;
        var nombreDeVue=0;
        var nombreDeVueArticle=statArticle.nombreDeVue;
        console.log("statarticle=> "+JSON.stringify(statArticle));
        StatArticle.findOne({article:statArticle.article}).exec(function(err,result){

            if(result !=undefined)
            {

                console.log("Nombre de vue de l'article "+result.article+ " : "+statArticle.nombreDeVue);
                console.log(result.uuid +" "+statArticle.uuid);
                console.log(result.article +" "+statArticle.article);
                if((result.uuid ==statArticle.uuid) &&  (result.article==statArticle.article))
                {
                    result.nombreDeVue=result.nombreDeVue +1;
                    console.log("L'utilisateur est présent dans StatArticle mise à jour");
                    console.log("Nombre de vue "+statArticle.nombreDeVue);
                    result.save(function (err, success) {
                        console.log("erreur update "+err);
                        console.log("update success "+success);
                        if(success)
                        {
                            console.log("stat mise à jour "+success);
                            res.send({success:true,nombreDeVue:success.nombreDeVue});
                        }
                        if(err)
                        {
                            console.error("Erreur rencontrée lors de la creation des stats==>"+err);
                            res.send({success:false});
                        }
                    }) ;
                }
                else
                {
                    statArticle.nombreDeVue=1;
                    StatArticle.create(statArticle).exec(function(err,success){
                        if(success)
                        {
                            Article.findOne({idArticle:statArticle.article}).exec(function(err,article){
                                if(article)
                                {
                                    article.nombreDeVue=article.nombreDeVue+1;
                                    article.save(function (err, success) {
                                        if(success) {
                                            console.log("Nombre de vue Article mis à jour")
                                        }
                                        if(err)
                                        {
                                            console.log("Une erreur a été rencontrée lors de la mise à jour du Nombre de vue Article=>"+err);

                                        }

                                    })
                                }
                            });
                            console.log("StatCree avec success");
                           // res.send({success:true,nombreDeVue:success.nombreDeVue});
                        }
                        if(err)
                        {
                            console.error("Erreur rencontrée lors de la creation des stats==>"+err);
                            //res.send({success:false});
                        }
                    }) ;
                }
            }
            else
            {
                statArticle.nombreDeVue=1;
                StatArticle.create(statArticle).exec(function(err,success){
                    if(success)
                    {
                        console.log("Premiere creationStat Article avec success");
                        Article.findOne({idArticle:statArticle.article}).exec(function(err,article){
                            if(article)
                            {
                                article.nombreDeVue=article.nombreDeVue+1;
                                article.save(function (err, success) {
                                    if(success) {
                                        console.log("Nombre de vue Article mis à jour")
                                    }
                                    if(err)
                                    {
                                        console.log("Une erreur a été rencontrée lors de la mise à jour du Nombre de vue Article=>"+err);

                                    }

                                })
                            }
                        });
                        //return {success:true,nombreDeVue:success.nombreDeVue}
                    }
                    if(err)
                    {
                        console.error("Erreur rencontrée lors de la creation des stats==>"+err)
                        //return false;
                    }
                });


            }




            /*ArticleService.updateNombreDeVue({idArticle:statArticle.article,nombreDeVue:statArticle.nombreDeVue},function(err,article){
                if(article)
                {
                    console.log("Nombre de vue mis à jour dans la table article");
                }

                if(err)
                {
                    console.error("Une erreur a été rencontrée lors de la mise à jour du nombre de vue dans la table article ==>"+err);
                }
            })*/
        })

    },
    createStat:function(stat)
    {
        StatArticle.create(stat).exec(function(err,success){
            if(success)
            {
                console.log("StatCree avec success");
                //return {success:true,nombreDeVue:success.nombreDeVue}
            }
            if(err)
            {
                console.error("Erreur rencontrée lors de la creation des stats==>"+err)
                //return false;
            }
        })
    }
};

