const { Schema, model } = require('mongoose')

const bumpsSchema = Schema({
	_id: {
		type: String,
		required: true
	},
	bumpTime: {
		type: Date,
		required: true
	}
})

module.exports = model('bumps', bumpsSchema)