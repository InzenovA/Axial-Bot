const { Client, Events, EmbedBuilder } = require("discord.js")
const starboardSchema = require("../schemas/starboard-schema")

let starboardCache = {}

/**
 *
 * @param {String} guildId
 */
const fetchStarboardChannels = async (guildId) => {
	let query = {}

	if (guildId) query._id = guildId

	const results = await starboardSchema.find(query)

	for (const result of results) {
		const { _id, channelId, starCount } = result
		starboardCache[_id] = { channelId, starCount }
	}
}

/**
 *
 * @param {string} guildId
 */
const deleteCache = async (guildId) => {
	await starboardSchema.findOneAndDelete({ _id: guildId })
	delete starboardCache[guildId]
}

/**
 *
 * @param {Client} client
 */
module.exports = async (client) => {
	fetchStarboardChannels()

	client.on(Events.MessageReactionAdd, async (reaction, user) => {
		if (reaction.emoji.name == "⭐" && starboardCache[reaction.message.guildId] && !user.bot) {
			await reaction.fetch()
			if (reaction.count >= starboardCache[reaction.message.guildId].starCount && !reaction.message.author.bot) {
				const { member, url, content, attachments, createdTimestamp, id } = await reaction.message.fetch()
				const { displayName } = member

				const starboardChannel = client.channels.cache.get(starboardCache[reaction.message.guildId].channelId)
				if (!starboardChannel) return
				const starboardChannelMessages = await starboardChannel.messages.fetch({ limit: 100 })
				const existingMessage = starboardChannelMessages.find((channelMessage) => {
					if (channelMessage.embeds.length == 1 && channelMessage.author.id == client.user.id) {
						if (channelMessage.embeds.footer == id) return true
					}
					return false
				})
				if (existingMessage) return

				const embed = new EmbedBuilder()
					.setAuthor({ name: displayName, iconURL: member.displayAvatarURL({ size: 4096 }) })
					.setFields({
						name: "Message Link",
						value: `[Jump to the message](${url})`
					})
					.setColor("Yellow")
					.setTimestamp(createdTimestamp)
					.setFooter({ text: id })
				if (content) embed.setDescription(content)
				if (attachments) embed.setImage(attachments.at(0)?.attachment)

				starboardChannel.send({ embeds: [ embed ] })
			}
		}
	})
}

module.exports.fetchStarboardChannels = fetchStarboardChannels
module.exports.deleteCache = deleteCache