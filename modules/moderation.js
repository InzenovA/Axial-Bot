const { Client, Guild, GuildMember, PermissionsBitField } = require("discord.js")
const schedule = require("node-schedule")
const roleSchema = require("../schemas/moderator-role-schema")
const banSchema = require("../schemas/bans-schema")

/**
 *
 * @param {GuildMember} target
 * @param {Guild} guild
 */
const moderatorCheck = async (target, guild) => {
	const query = await roleSchema.findOne({ _id: guild.id })
	guild.roles.fetch()

	if (query ? target.roles.cache.hasAny(query.roleId) : false) return true
	if (target.permissions.has(PermissionsBitField.Flags.BanMembers)) return true
	return false
}

/**
 *
 * @param {Client} client
 * @param {String} userId
 * @param {String} guildId
 */
const deleteBan = async (client, userId, guildId) => {
	const guild = client.guilds.cache.get(guildId)
	guild?.bans.remove(userId, "Ban expired").catch(() => { })
	await banSchema.findOneAndDelete({ guildId, userId })

	const job = schedule.scheduledJobs[`ban ${guildId} - ${userId}`]
	job?.cancel()
}

/**
 *
 * @param {Client} client
 * @param {Array} bans
 */
const loadBans = async (client, bans) => {
	for (let i = 0; i < bans.length; i++) {
		let { guildId, userId, endTime } = bans[i]
		schedule.scheduleJob(`ban ${guildId} - ${userId}`, endTime, async () => {
			deleteBan(client, userId, guildId)
		})
	}
}

/**
 *
 * @param {Client} client
 */
module.exports = async (client) => {
	const now = new Date()

	const expired = await banSchema.find({ endTime: { $lt: now } })

	for (let i = 0; i < expired.length; i++) {
		let { guildId, userId } = expired[i]

		deleteBan(client, userId, guildId)
	}

	const query = await banSchema.find({ endTime: { $gt: now } })
	await loadBans(client, query)
}

module.exports.moderatorCheck = moderatorCheck
module.exports.deleteBan = deleteBan
module.exports.loadBans = loadBans