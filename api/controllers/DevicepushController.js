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
        console.log("device token to register "+JSON.stringify(req.body));
        Devicepush.findOne({deviceToken:push.deviceToken}).exec(function(err,devicePush){
            console.log(err);
            if(push.deviceToken == devicePush.deviceToken && push.idUtilisateur==devicePush.idUtilisateur)
            {

            }
            else
            {
                if(push.idUtilisateur && (devicePush.idUtilisateur=='' || devicePush.idUtilisateur ==null))
                {
                    Devicepush.destroy({deviceToken:push.deviceToken}).exec(function(err,des){
                        if(err)
                        {

                        }else
                        {
                            Devicepush.create({idUtilisateur:push.idUtilisateur,deviceToken:push.deviceToken}).exec(function (err, updated){
                                if (err) {
                                    console.log(err);
                                    // handle error here- e.g. `res.serverError(err);`
                                    return;
                                }
                                res.send('ok');
                            });
                        }
                    })

                }
                else
                {
                    Devicepush.create({idUtilisateur:push.idUtilisateur,deviceToken:push.deviceToken}).exec(function (err, updated){
                        console.log(JSON.stringify(updated));
                        if (err) {
                            console.log(err);
                            // handle error here- e.g. `res.serverError(err);`
                            return;
                        }
                        res.send('ok');
                    });
                }
            }

        })
    }
};

