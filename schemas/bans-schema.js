const { Schema, model } = require("mongoose")

const reqString = {
	type: String,
	required: true
}

const bansSchema = Schema({
	guildId: reqString,
	userId: reqString,
	endTime: {
		type: Date,
		required: true
	}
})

module.exports = model("bans", bansSchema)