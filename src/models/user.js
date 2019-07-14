const mongoose = require('mongoose')
const validator = require('validator')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    }, 
    email: {
        type: String,
        unique: true,
        required: true,
        trim: true,
        lowercase: true,
        validate(value) {
            if (!validator.isEmail(value)) {
                throw new Error('Email is invalid!')
            }
        }
    },
    password: {
        type: String,
        required: true,
        trim: true,
        minlength: 7
    },
    tokens: [{
        token: {
            type: String,
            required: true
        }
    }]
}, {
    timestamps: true,
    versionKey: false,
    discriminatorKey: 'role'
})

const electricVehicleOwnerUserSchema = new mongoose.Schema({
    volumeFeePrecentage: {
        type: Number,
        required: true,
        default: 5.0
    },
    vehicleModel: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'VehicleModel',
        required: true
    }
},{
    versionKey: false
})

const electricVehicleChargingProviderUserSchema = new mongoose.Schema({
    revenueFeePrecentage: {
        type: Number,
        required: true,
        default: 5.0
    }
},{
    versionKey: false
})

electricVehicleChargingProviderUserSchema.virtual('chargingLocations', {
    ref: 'ChargingLocation',
    localField: '_id',
    foreignField: 'owner'
})

userSchema.methods.toJSON = function() {
    const user = this
    const userObject = user.toObject()

    delete userObject.password
    delete userObject.tokens

    return userObject
}

userSchema.methods.generateAuthToken = async function() {
    const user = this
    const token = jwt.sign({ _id: user._id.toString() }, process.env.JWT_SECRET, { expiresIn: 86400 })

    user.tokens = user.tokens.concat({ token })
    await user.save()

    return token
}

userSchema.statics.findByCredentials = async (email, password) => {
    const user = await User.findOne({ email })
    if (!user) {
        // Dont prvide to much information
        throw new Error('Unabe to login!')
    }

    const isMatch = await bcrypt.compare(password, user.password)
    if (!isMatch) {
        throw new Error('Unable to login!')
    }

    return user
}

// Hash the plain text password before saving user
userSchema.pre('save', async function (next) {
    const user = this
    
    if (user.isModified('password')) {
        user.password = await bcrypt.hash(user.password, 8)
    }

    next()
})

const User = mongoose.model('User', userSchema)
const EVOwner = User.discriminator('EVO', electricVehicleOwnerUserSchema)
const EVChargingProvider = User.discriminator('EVCP', electricVehicleChargingProviderUserSchema)

module.exports = {
    User,
    EVOwner,
    EVChargingProvider
}