const Store = require('../models/store');
const Plant = require ('../models/plant')
const Review = require('../models/review')

module.exports.get = (query, projection) => {
    return Store.find(query, projection);
}

module.exports.getSchedule = (storeId, day) => {
    return Store.findOne({_id: storeId},{ schedule: {$elemMatch: {day: day}}})
}

module.exports.getStore = (id) => {
    return Store.findOne({_id: id});
}

module.exports.getCategoryRatings = (cat) => {
    return Store.find({category: cat}).sort({rating: -1}).exec();
}

module.exports.getCategoriesResults = () => {
    return Store.aggregate([
        {
            '$group': {
                '_id': '$category',
                'count': {
                    '$sum': 1
                }
            }
        }, {
            '$addFields': {
                'title': '$_id'
            }
        }, {
            '$project': {
                '_id': false
            }
        }
    ])
}

module.exports.getResults = (query,term) => {

    query["$or"] = [
        { name: { '$regex': term, '$options': 'i' } },
        { description: { '$regex': term, '$options': 'i' } },
    ]
    return Store.find(query)
}

module.exports.getCategories = async () => {
    return await Store.schema.path('category').enumValues
    
}

module.exports.getCalendar = async () => {
    return await Store.schema.path('schedule').schema.path('day').enumValues
}

module.exports.getRecommended = async () => {
    return Store.find().sort({category: -1})   
    
}

module.exports.insertSchedule = (id, s) => {    
    return Store.updateOne({_id: id, 'schedule.day': {$ne: s.day}},{$push: {schedule: s}})
    
}

module.exports.editDescription = (id, des) => {
    return Store.updateOne({_id: id},{$set: {description: des}})
}

module.exports.editPhone = (phone, id) => {
    return Store.updateOne({_id: id},{$set: {phone: phone}})
}

module.exports.editLogo = (id, l) => {
    return Store.updateOne({_id: id},{$set: {logo: l}})
}

module.exports.removeStore = async (id) => {
    await Review.remove({storeID: id})
    await Plant.remove({storeID: id})
    return Store.remove({_id: id})
}
module.exports.editPicture = (id, pic) => {
    return Store.updateOne({_id: id},{$set: {picture: pic}})
}

module.exports.addPhoto = (id, photos) => {
    return Store.updateOne({_id: id},{$push: {photos: photos}})
}

module.exports.setCoordinates = (lat, long, id) => {
    return Store.updateOne({_id: id},{$set: {latitude: lat, longitude: long}})
}

module.exports.removeStorePhoto = (id, pId) => {
    return Store.updateOne({_id: id},{$pull: {photos: {'_id': pId}}})
}


module.exports.create = (store) => {
    const newStore = new Store(store);
    return newStore.save();
}
