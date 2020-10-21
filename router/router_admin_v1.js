/*********************************************************************************************************** */
//                                  This is API Router for Admin APP                                       //
/********************************************************************************************************* */

const validations = require('../validation/index');
const authController = require('./../controllers/auth');
const itemController = require('../controllers/item')
const apiEndpint = "/api/admin/v1";
const authMiddleware = require('./../middlewares/auth');

var validate = require('express-validation');
validate.options({
	errors: [],
	status: 422,
	statusText: 'Invalid Parameter..!'
});

module.exports.set = (app) => {
	app.post(apiEndpint + '/login', authController.login);
	app.post(apiEndpint + '/register', authController.registerUser);

	
	app.post(apiEndpint + '/items', authMiddleware.checkAdminAuth, itemController.addItem);
	app.get(apiEndpint + '/items/:itemId', authMiddleware.checkAdminAuth, itemController.getItemById);
	app.get(apiEndpint + '/items', authMiddleware.checkAdminAuth, itemController.getAllItems);
	app.put(apiEndpint + '/items',authMiddleware.checkAdminAuth,  itemController.updateItemById);

}
