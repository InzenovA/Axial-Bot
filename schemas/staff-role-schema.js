const { Schema, model } = require("mongoose")

const moderatorRoleSchema = Schema({
	_id: {
		type: String,
		required: true
	},
	roleId: {
		type: [String],
		required: true
	}
})

module.exports = model("staff-roles", moderatorRoleSchema)