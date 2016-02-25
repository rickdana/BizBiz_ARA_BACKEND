/**
 * ImageController
 *
 * @description :: Server-side logic for managing Images
 * @help        :: See http://links.sailsjs.org/docs/controllers
 */
var uuid = require('node-uuid'),
    path = require('path');
module.exports = {
    addImageToArticle:function(req,res)
    {
        Article.findOne({idArticle:req.idarticle}).exec(function(err,article)
        {
            if(article)
            {
                Image.count({idArticle:req.idarticle}).exec(function(err,nombre)
                {
                    console.log('nombre d\'images pour l\'article' +nombre);
                    if(nombre<5)
                    {
                        var results = [],
                            streamOptions = {
                                dirname: sails.config.appPath + "/public/article/",
                                saveAs: function(file) {
                                    var filename = file.filename,
                                        newName = uuid.v4() + path.extname(filename);
                                    return newName;
                                },
                                completed: function(fileData, next) {
                                    Document.create(fileData).exec(function(err, savedFile){
                                        if (err) {
                                            next(err);
                                        } else {
                                            results.push({
                                                id: savedFile.id,
                                                url: '/article/' + savedFile.localName
                                            });
                                            next();
                                        }
                                    });
                                }
                            };

                        req.file('images').upload(uploadService.documentReceiverStream(streamOptions),
                            function (err, files) {
                                if (err) return res.serverError(err);

                                res.json({
                                    message: files.length + ' file(s) uploaded successfully!',
                                    files: results
                                });
                            }
                        );
                    }
                    else
                    {
                        res.send({message:'Le nombre d\'images maximal autorisé par article est atteint',success:false,nombreimage:nombre})

                    }
                    if(err)
                    {
                        res.send({message:'L\'erreur suivante est survenue',success:false,err:err})
                    }
                });
            }
            else
            {
                res.send({message:'L\'article n\'existe pas',success:false});
            }
            if(err)
            {
                res.send({message:'Une erreur est survenue lors de la recherche de l\'article',err:err,success:false});
            }
        })
    },
    deleteImageArticle:function(req,res)
    {

    },
    updateImageArticle:function(req,res)
    {

    }
	
};


