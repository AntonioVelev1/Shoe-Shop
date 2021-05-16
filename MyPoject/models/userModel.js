const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcrypt');
const saltRounds = Number(process.env.SALTROUNDS) || 6;

const { ObjectId } = mongoose.Schema.Types;

const userSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        unique: true,
        validate: [validator.isEmail, 'Invalid email']
    },
    firstname: {
        type: String,
        required: true,
        minlength: [3, 'Firstname should be at least 3 characters'],
        validate: {
            validator: function (v) {
                return /[a-zA-Z0-9]+/g.test(v);
            },
            message: props => `${props.value} must contains only latin letters and digits!`
        },
    },
    lastname: {
        type: String,
        required: true,
        minlength: [3, 'Last should be at least 3 characters'],
        validate: {
            validator: function (v) {
                return /[a-zA-Z0-9]+/g.test(v);
            },
            message: props => `${props.value} must contains only latin letters and digits!`
        },
    },
    password: {
        type: String,
        required: true,
        minlength: [6, 'Password should be at least 6 characters']
    },
    phone: {
        type: String,
        required: true,
        validate: {
            validator: function (v) {
                return /^[0-9]{10}$/g.test(v);
            },
            message: props => `${props.value} is not valid phone number!`
        },
    },
    gender: {
        type: String,
        require: true
    },
    products: [{
        type: ObjectId,
        ref: 'product'
    }],
}, { timestamps: { createdAt: 'created_at' } });

userSchema.methods = {
    matchPassword: function (password) {
        return bcrypt.compare(password, this.password);
    }
};

userSchema.pre('save', function (next) {
    if (this.isModified('password')) {
        bcrypt.genSalt(saltRounds, (err, salt) => {
            if (err) {
                next(err);
            }

            bcrypt.hash(this.password, salt, (err, hash) => {
                if (err) {
                    next(err);
                }
                this.password = hash;
                next();
            })
        })
        return;
    }
    next();
});



module.exports = mongoose.model('User', userSchema);