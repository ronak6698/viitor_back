const adminMaster = require('../models/admin').adminMaster;
const config = require('../config');
const CustomError = require('../customError');
const jwt = require('jsonwebtoken');
var crypto = require('crypto');

const login = params => {
	return adminMaster.findOne({
		where: {
			email_id: params.email_id,
			is_delete: 0
		},
		raw: true
	}).then(user => {
		if (!user)
			throw new CustomError('Account not Found!');

		const password = crypto.createHmac('sha256', config.jwtSecret).update(params.password).digest('hex');
		if (user.password !== password)
			throw new CustomError('Invalid Password.')

		const payload = {
			email_id: user.email_id,
			id: user.admin_id,
			time: new Date()
		};

		var token = jwt.sign(payload, config.jwtSecret, {
			expiresIn: config.tokenExpireTime
		});

		return token;
	});
}

const checkEmailExist = email_id => adminMaster.findOne({
    where: { email_id, is_delete: 0 }
});

const registerUser = data => adminMaster.create({
    ...data
}).then((result) => {
    var response = { status: true, message: "Success! User added successfully!", data: result }
    return response;
}).catch((error) => {
    var response = { status: false, message: "Error! Invalid data found", error }
    return response;
});

module.exports = {
	login,
	checkEmailExist,
	registerUser
}
