const mongoose = require('mongoose');

const blacklistTokenSchema = mongoose.Schema({
    token: {
        type: String,
        required: true,
    }
},
    {
        timestamps: true
    }
)

const blacklistModel = mongoose.model("blacklistToken", blacklistTokenSchema);

module.exports = blacklistModel;