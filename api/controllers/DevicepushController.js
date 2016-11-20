/**
 * DevicepushController
 *
 * @description :: Server-side logic for managing devicepushes
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {

    register:function(req,res)
    {
        var push=req.body;
        console.log("device token to register "+req.body);
        Devicepush.findOrCreate({deviceToken:push.deviceToken},{idUtilisateur:push.idUtilisateur,deviceToken:push.deviceToken}).exec(function(err,devicePush){
            console.log(err);
            console.log(devicePush);
            if(push.idUtilisateur && (devicePush.idUtilisateur=='' || devicePush.idUtilisateur ==null))
            {
                Devicepush.update({deviceToken:push.deviceToken},{idUtilisateur:push.idUtilisateur,deviceToken:push.deviceToken}).exec(function (err, updated){

                    if (err) {
                        // handle error here- e.g. `res.serverError(err);`
                        return;
                    }
                    res.send('ok');
                });
            }
            else
            {
                res.send('ok');
            }
        })
    }
};

