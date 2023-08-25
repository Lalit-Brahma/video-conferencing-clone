const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const userSchema = new Schema({
googleId: String,
name: String,
photos: String
});
const User = mongoose.model('user', userSchema);

module.exports = User;