/**
 * Created by fleundeu on 25/05/2015.
 */

module.exports= {


    getDevise: function (cb) {
        Devise.find({where:{statut:'A'},sort:'libelle ASC'}).exec(function (err, devises) {
            cb(null, devises);
        })
    }
}
