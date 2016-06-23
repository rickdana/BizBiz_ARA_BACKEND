/**
 * DeviseController
 *
 * @description :: Server-side logic for managing devises
 * @help        :: See http://links.sailsjs.org/docs/controllers
 */

module.exports = {

    getActiveDevise:function(req,res)
    {
        Devise.find({where:{statut:'A'},sort:'libelle ASC'}).exec(function(err,devise)
        {
            if (devise) {
                res.send({devises: devise});
            }
            if (err) {
            }
        })
    }
};

