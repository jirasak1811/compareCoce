var mongoose = require('mongoose'),
	Schema = mongoose.Schema,

	Client = new Schema({
		name: {
			type: String,
			unique: true,
			required: true
		},
		clientId: {
			type: String,
			unique: true,
			required: true
		},
		clientSecret: {
			type: String,
			required: true
		},
		extLicense: {
			type: Number,
			required: true,
			default: 128
		},
		createdAt: {
			type: Date,
			required: true,
			default: Date.now
		},
		licExpires: {
			type: Date,
			required: true,
			default: Date.now
		}

	});

module.exports = mongoose.model('Client', Client);
