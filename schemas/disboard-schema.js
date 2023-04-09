const { Schema, model } = require('mongoose')

const reqString = {
	type: String,
	required: true
}

const disboardSchema = Schema({
	_id: reqString,
	channelId: reqString,
	content: reqString
})

module.exports = model('disboard', disboardSchema, 'disboard')