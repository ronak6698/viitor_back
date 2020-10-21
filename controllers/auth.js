const authService = require('../services/auth');
var crypto = require('crypto');
const config = require('../config');
function login(req, res) {
	return authService.login(req.body)
		.then(token => {
			res.send({
				status: true,
				data: { token }
			});
		})
		.catch(err => {
			if (err.type === 'custom') {
				return res.status(403).send({
					status: false,
					message: err.message
				});
			}
			return res.status(403).send({
				status: false,
				message: 'Invalid Email Id or Password!'
			});
		})
};

function registerUser(req, res) {
            req.body.email_id = req.body.email_id.toLowerCase()
            return authService.checkEmailExist(req.body.email_id || '')
                .then(async exists => {
                    var emailRegex = /^[-!#$%&'*+\/0-9=?A-Z^_a-z{|}~](\.?[-!#$%&'*+\/0-9=?A-Z^_a-z`{|}~])*@[a-zA-Z0-9](-*\.?[a-zA-Z0-9])*\.[a-zA-Z](-?[a-zA-Z0-9])+$/;
                    var valid = emailRegex.test(req.body.email_id);
                    if (!valid) {
                        return res.status(200).send({
                            status: false,
                            message: 'Please enter valid Email-id!'
                        });
                    }
                    if (exists) {
                        return res.status(200).send({
                            status: false,
                            message: 'Email Id already exsist!'
                        });
                    }

                    var appUserDetails = {};
                    const passwordHmac = crypto.createHmac('sha256', config.jwtSecret).update(req.body.password).digest('hex');
                    appUserDetails.email_id = (req.body.email_id) ? req.body.email_id.toLowerCase() : "";
                    appUserDetails.password = (req.body.password) ? passwordHmac : "";

                    return authService.registerUser(appUserDetails)
                        .then((data) => {
                                return  res.send({
                                            status: true,
                                            message: "You are successfully registered!"
                                        });
                        }).catch(err => {
								return res.status(200).send({
									status: false,
									message: err.message
								});
						})
                });
};

module.exports = {
	login,
	registerUser
}
