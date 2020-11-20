// User .JSON template for adding users to the db
const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const userSchema = new Schema({
  email: {type: String, required: true},
  password: {type: String, required: true, minlength: 5},
  displayName: {type: String},
  priveldgeType: {type: String, required: false},

});

const User = mongoose.model('User', userSchema);

module.exports = User;