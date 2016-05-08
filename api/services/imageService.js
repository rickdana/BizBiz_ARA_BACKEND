/**
 * Created by fleundeu on 17/07/2015.
 */
var https = require('https');
var fs = require('fs');
var url = require('url');
var exec = require('child_process').exec;
var spawn = require('child_process').spawn;
var request = require('request');
module.exports = {
    // Function to download file using HTTP.get
     download_file : function(file_url,dest,provider,cb) {
         var options = {
             host: url.parse(file_url).host,
             port: 443,
             path: url.parse(file_url).pathname
         };

         var file_name="";
         if(provider=='Google')
         {
           var file=url.parse(file_url).pathname.split('/');
           file_name = file[4]+"_"+file.pop();
         }
         else
         {
           file_name=url.parse(file_url).pathname.split('/').pop();
         }

       Photo.findOne({cheminPhoto:file_name}).exec(function(err,photo){
             if(photo)
             {
                 cb(null, photo.cheminPhoto);
             }else
             {
                 if(provider=='Google')
                 {
                     var file = fs.createWriteStream(dest + file_name);
                     https.get(options, function (res) {
                         res.on('data', function (data) {
                             file.write(data);
                             console.log(file_name + ' downloaded to ' + dest);

                         }).on('end', function () {
                             file.end();
                             console.log(file_name + ' downloaded to ' + dest);
                             cb(null, file_name);
                         });
                     });

                 }else
                 {
                     request.head(file_url, function(err, res, body){
                         request(file_url).pipe(fs.createWriteStream(dest + file_name)).on('close', function(){
                             cb(null, file_name);
                         });
                     });
                 }


             }
         });

     }
 };
