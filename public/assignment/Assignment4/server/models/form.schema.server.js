//Two choices : children reference to parent, or embedded instances
module.exports = function(mongoose) {
    //one forms has many fields
    var FieldSchema = require('./field.schema.server.js')(mongoose);
    var FormSchema = mongoose.Schema({
        //can be used to retrieve the user instance given a forms, or retrieve all forms for a given user
        "userId": String,
        "title": {
            type: String,
            default: 'New Form'
        },
        //embedded representation: part of parent object, embedded schema
        "fields": [FieldSchema],
        "created": {type: Date, default: Date.now()},
        "updated": {type: Date, default: Date.now()}
    },{collection: 'assignment4.form'});
    return FormSchema;
};