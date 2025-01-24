const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const {Schema} = mongoose;

const UserSchema = new Schema({
 name: String, 
 email: {type: String, unique: true},
 password: String,
});

UserSchema.pre('save', function(next) {
 if (this.isModified('password')) {
   this.password = bcrypt.hashSync(this.password, 10);
 }
 next();
});

const UserModel = mongoose.model('User', UserSchema);

module.exports = UserModel;