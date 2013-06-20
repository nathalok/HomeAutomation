
/*
 * GET home page.
 */

exports.index = function(req, res){  
  res.render('index', { title: 'Temperature Monitor',
              domain: 'localhost'  });
};