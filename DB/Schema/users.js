const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    username: {
        type: mongoose.SchemaTypes.String,
        required: true,
        unique: true,
    },
    password: {
        type: mongoose.SchemaTypes.String,
        required: true,
    },
    balance: {
        type: mongoose.SchemaTypes.Decimal128,
        required: true,
        default: 0,
    },
});

module.exports = mongoose.model('users', UserSchema);
