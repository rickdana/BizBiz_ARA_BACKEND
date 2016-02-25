/**
 * Created by fleundeu on 19/04/2015.
 */
module.exports={
    getAllCategorie:function(cb)
    {
        Categorie.find({where:{statut:'A'}}).exec(function(err,categories)
        {
            if(categories)
            {
               cb(null, categories);
            }
            else {
                cb(err, null);
            }
        })
    }
};