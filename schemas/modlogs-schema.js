const { Schema, model } = require("mongoose")

const reqString = {
	type: String,
	required: true
}

const modlogsSchema = Schema({
	guildId: reqString,
	userId: reqString,
	warns: [Object],
	kicks: [Object],
	mutes: [Object],
	bans: [Object]
})

module.exports = model("modlogs", modlogsSchema)