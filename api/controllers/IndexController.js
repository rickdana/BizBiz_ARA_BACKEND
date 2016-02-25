/**
 * IndexController
 *
 * @description :: Server-side logic for managing indices
 * @help        :: See http://links.sailsjs.org/docs/controllers
 */

module.exports = {

    home:function(req,res)
    {
        var title=req.__('home.title');
        res.view('homepage',{title:title,page_name:'home'});
    }
	
};

