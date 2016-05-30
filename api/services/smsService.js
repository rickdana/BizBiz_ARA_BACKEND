var nexmo	= require('nexmoapi').Nexmo,
    api_key ="5d5b244e",
    api_secret ="d46a08bf";
var s = new nexmo(api_key, api_secret,true);


module.exports = {

    /***************************************************************
     *
     *     Envoi du code de verification
     *
     * **************************************************************/

     sendSMS:function(code,telephone)
    {
        var s = new nexmo(api_key, api_secret,true);

        var phone=telephone.replace("+", "");
        var message="Message d'OccazStreet : Votre code de vérification "+code;
        console.log("Message "+message);
        s.send("OccazStreet",phone,message,function(err,success){
            if (err) {
                console.log(err);
            } else {
                console.log(success);
            }
        })
    }

};
