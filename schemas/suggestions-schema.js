const { Schema, model } = require('mongoose')

const reqString = {
	type: String,
	required: true
}

const suggestionsSchema = Schema({
	_id: reqString,
	channelId: reqString
})

module.exports = model('suggestions', suggestionsSchema)