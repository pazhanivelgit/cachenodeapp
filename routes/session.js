exports.login = function(req,res,next) {
    
    req.session.key = req.body.user_name;
    res.status(200).json({ 'message': 'Login Success' });
    //if (!req.session.key) {
    //    req.session.key = req.body.user_name;
    //    res.status(200).json({ 'message': 'Login Success' });
    //}
    //else { 
    
    //    res.status(200).json({ 'message': 'Login Success' });
    //}
}

exports.dashboard = function (req, res, next) {
    
    if (!req.session.key) {
        //req.session.key = req.body.user_name;
        res.status(200).json({ 'message': 'No access.. Please login!' });
    }
    else { 
        res.status(200).json({ 'message': 'Hi '+ req.session.key+',Welcome to dashboard!'});
    }
}

exports.logout = function (req, res, next) {
    
    req.session.destroy(function (err) {
        if (err) { 
            res.status(200).json({ 'message': 'Error when logout!' });
        }

        else { 
            res.status(200).json({ 'message': 'Logout Successfully!' });
        }
    });

   
}

