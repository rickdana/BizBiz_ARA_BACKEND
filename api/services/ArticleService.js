/**
 * Created by fleundeu on 19/04/2015.
 */
module.exports={
    getAllArticleActif:function(cb)
    {
        console.log("ArticleService.getAllArticleActif");
        Article.find({where:{statut:'A'},sort:'dateAjout ASC'}).populate('utilisateur').populate('categorie').populate('images').populate('devise').exec(function(err,articles)
        {

            if(articles)
            {
                cb(null, articles);
            }
            else {
                cb(err, null);
            }
        })
    },
    getAllArticleActifLimitBy:function(cb)
    {
        console.log("ArticleService.getAllArticleActif");
        Article.find({where:{statut:'A'},limit:cb.numberResults, sort:'dateAjout ASC'}).populate('utilisateur').populate('categorie').populate('images').populate('devise').exec(function(err,articles)
        {

            if(articles)
            {
                cb(null, articles);
            }
            else {
                cb(err, null);
            }
        })
    },
    getAllArticleInactif:function(cb)
    {
        Article.find({where:{statut:'I'},sort:'dateAjout ASC'}).populate('utilisateur').populate('categorie').exec(function(err,articles)
        {
            if(articles)
            {
                cb(null, articles);
            }
            else {
                cb(err, null);
            }
        })
    },
    /*getArticleById:function(cb,val)
    {
        Article.findOne({idArticle:cb.idarticle}).populate('categorie').populate('images').populate('utilisateur').exec(function(err,article){
            if(article)
            {
                console.log('idphoto '+article.utilisateur.photo);
                Photo.findOne({idPhoto:article.utilisateur.photo}).exec(function(err,photo){
                    article.photo=photo;
                    console.log(article.titre);
                    val(null,article);
                })

            }
            else
            {
                val(err,null);
            }
        })
    },*/
    getArticleByCategorie:function(cb,val)
    {
        Article.find({idCategorie:cb.idcategorie}).populate('categorie').populate('images').populate('utilisateur').populate('devise').exec(function(err,articles) {

            if(articles)
            {
                val(null,articles);
            }
            if(err)
            {
                val(err,null);
            }
        })
    },
    getArticleById:function(cb,val)
    {
        console.log("idarticle =>"+cb.idarticle);
        Article.findOne({idArticle:cb.idarticle}).populate('utilisateur').populate('images').populate('categorie').populate('devise').exec(function(err,article){
            if(article)
            {

                Photo.findOne({idPhoto:article.utilisateur.photo}).exec(function(err,photo){
                    article.photo=photo;
                    val(null,article);
                })

            }
            if(err)
            {
                val(err,null);
            }
        })
    },

    getArticlesVenduByUser:function(cb,val)
    {
       console.log("tototo"+cb.iduser);
        Article.find().where({utilisateur: cb.iduser,etat:'Vendu'}).populate('images').populate('devise').exec(function(err,result){
            if(result)
            {
                val(null,result);
            }
            if(err)
            {
                val(err,null);
            }
        })
    },

    getArticlesByUser:function(cb,val)
    {
        Article.find().where({utilisateur: cb.iduser,etat:'Normal'}).populate('images').populate('devise').exec(function(err,result){
            if(result)
            {
                val(null,result);
            }
            if(err)
            {
                val(err,null);
            }
        })
    },

    getArticlesFavorisByUser:function(cb,val)
    {
      var images;
      var devise;
      Favoris.find({utilisateur: cb.iduser},{select: ['article']}).exec(function(err,result){
        if(result)
        {
           console.log(JSON.stringify(result));
          var article=[];
          for(var i=0;i<result.length;i++)
          {
            article[i]=result[i].article;
          }
          console.log(article);
          Article.find({idArticle:article}).populate('images').populate('devise').exec(function(err,res){
            if(res)
            {
              val(err,res);
            }
          });
        }
        if(err)
        {
          val(err,null);
        }
      })
    },

    updateNombreDeVue:function(cb,val)
    {
        Article.update({idArticle:cb.idArticle},{nombreDeVue:cb.nombreDeVue}).exec(function(err,article){
            if (article)
            {
                val(null,article);
            }
            if(err)
            {
                val(err,null);
            }
        })

    },

  updateArticle:function(cb,val)
  {
      Article.update({idArticle:cb.idArticle},article).exec(function(err,article){
        if(article)
        {
          val(null,article);
        }

        if(err)
        {
          val(err,null);
        }
      })
  },

  getArticleByParam:function(cb,val)
  {
    console.log("Categorie "+cb.parametre.categorie);
    console.log("Mots clef "+cb.parametre.motclef);

    console.log("sort by "+cb.parametre.filterBy);
    var prixmin=0;
    var prixmax=1000000000;
    var optionCategorie = optionCategorie || {};
    var optionLocalisation = optionLocalisation || {};
    var optionMotClef = optionMotClef || {};


    if (typeof cb.parametre.categorie !== "undefined")
    {
      optionCategorie.categorie=  cb.parametre.categorie;
    }
    if (typeof cb.parametre.localisation !== "undefined")
    {
      optionLocalisation.nomVille=cb.parametre.localisation.address_components[0].long_name;
    }
    if(typeof cb.parametre.motclef !== "undefined" )
    {
      console.log("dans parametre "+cb.parametre.motclef);
      optionMotClef.or = [
        { titre: { 'contains':cb.parametre.motclef} } ,
        { details:{ 'contains':cb.parametre.motclef} }
      ]
    }
    if (cb.parametre.prixmin)
    {
      prixmin=cb.parametre.prixmin;
    }
    if(cb.parametre.prixmax)
    {
      prixmax=cb.parametre.prixmax;
    }
    console.log("prix min "+prixmin);
    console.log("prix max "+prixmax);
    console.log(optionCategorie);
    console.log(optionLocalisation);
    console.log(optionMotClef);

    Article.find().where(optionCategorie)
                  .where(optionLocalisation)
                  .where(optionMotClef)
                  .where({prix:{'>':prixmin, '<':prixmax}})
      .sort(cb.parametre.filterBy)
      .populate('images').populate('devise').exec(function(err,result){
      if(result)
      {
        val(null,result);
      }
      if(err)
      {
        val(err,null);
      }
    })
  }

};
