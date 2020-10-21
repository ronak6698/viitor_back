var itemService = require('../services/item');
const config = require('../config');


function addItem(req, res) {
        console.log('+++++++',req.body)
        var itemDetails = {};
        itemDetails.item_name = (req.body.item_name) ? req.body.item_name : "";
        itemDetails.item_price = (req.body.item_price) ? (req.body.item_price) * 1 : 0;
        return itemService.checkItemExist(req.body.item_name || '')
        .then(async exists => {
            if (exists) {
                return res.status(200).send({
                    status: false,
                    message: 'Item already exsist!'
                });
            }
            return itemService.addItem(itemDetails).then(data => res.send(data));
        })
};

function getAllItems(req, res) {
    var pageNo = (req.query.page && req.query.page > 0) ? req.query.page : 1;
    var dataLimit = (req.query.limit) ? req.query.limit : config.dataLimit;

    return itemService.getAllItems(pageNo, dataLimit).then(result => {
       
if (result) {
            var response = { status: true, count: result.count, data: result.rows };
        } else {
            var response = { status: false, message: config.no_data_message };
        }
        res.send(response);
    });
};

function getItemById(req, res) {
    const { itemId } = req.params;
    if (itemId) {
        return itemService.getItemById(itemId).then(result => {
            var response = { status: true, data: result };
            res.send(response);
        })
    } else {
        var response = { status: false, message: config.no_data_message };
        res.send(response);
    }
};

function updateItemById(req, res) {
        const body = req.body;
        console.log(body)
        var itemId = body.id;
        return itemService.getItemById(body.id).then(result => {
            if (result) {
                var itemDetails = {};
                if (body.is_delete) {
                    itemDetails.is_delete = 1;
                }
                else {
                    return itemService.checkItemExist(req.body.item_name || '')
                        .then(async exists => {
                            if (exists) {
                                return res.status(200).send({
                                    status: false,
                                    message: 'Item already exsist!'
                                });
                            }
                   itemDetails.item_name = (req.body.item_name) ? req.body.item_name : "";
                    itemDetails.item_price = (req.body.item_price) ? (req.body.item_price) * 1 : 0;
                        })
                }
                return itemService.updateItemById(itemDetails, {
                    returning: true, where: { item_id: itemId }
                }).then(result => {
                    if (result) {
                        var response = { status: true, data: result }
                    } else {
                        var response = { status: false, message: "item not updated!" }
                    }
                    res.send(response)
                })
            } else {
                var response = { status: false, message: "No item found for update detail!" }
                res.send(response);
            }
        })
};


module.exports = {
    addItem,
    getAllItems,
    getItemById,
    updateItemById
}