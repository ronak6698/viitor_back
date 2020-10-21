const itemMaster = require('../models/item_master').itemMaster;
const sequelize = require('../db');

const addItem = data => itemMaster.create({
    ...data
}).then((result) => {
    var response = { status: true, message: "Success! item added successfully!" }
    return response;
}).catch((error) => {
    var response = { status: false, message: "Error! Invalid data found", error }
    return response;
});
const checkItemExist = item_name => itemMaster.findOne({
    where: { item_name, is_delete: 0 }
});

const getAllItems = (pageNo, dataLimit) => {
    var query = {
        where: {
            is_delete: 0
        },
        // order: [['item_id', 'ASC']]
    };
    return itemMaster.findAndCountAll(query).then(sequelize.getValues)
}

const getItemById = (id) => {
    var query = {
        where: {
            item_id: id
        },
    };
    return itemMaster.findOne(query).then(sequelize.getValues)
}


const updateItemById = (data, query) => {
    return itemMaster.update(data, query).then(function ([rowsUpdate, [updateditem]]) {
        return updateditem;
    })
}



module.exports = {
    addItem,
    getAllItems,
    getItemById,
    updateItemById,
    checkItemExist
}