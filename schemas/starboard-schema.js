const { Schema, model } = require("mongoose")

const reqString = {
	type: String,
	required: true
}

const starboardSchema = Schema({
	_id: reqString,
	channelId: reqString,
	starCount: {
		type: Number,
		required: true
	}
})

module.exports = model("starboard", starboardSchema, "starboard")