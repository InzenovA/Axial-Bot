const { ApplicationCommandType, MessageContextMenuCommandInteraction, Message, Guild, EmbedBuilder } = require("discord.js")

module.exports = {
	name: "Message Info",
	category: "Context Menu",
	type: ApplicationCommandType.Message,
	dm_permission: false,
	/**
	 *
	 * @param {{
	 * 	interaction: MessageContextMenuCommandInteraction,
	 * 	targetMessage: Message,
	 * 	guild: Guild,
	 * 	channel: any
	 * }}
	 */
	callback: ({ interaction, targetMessage, guild, channel }) => {
		const embed = new EmbedBuilder()
			.setTitle("Message Information")
			.addFields({
				name: "Message ID",
				value: `${targetMessage.id}\n[Message Link](${targetMessage.url})`
			}, {
				name: "Channel ID",
				value: channel.id
			}, {
				name: "Guild ID",
				value: guild.id
			})
			.setTimestamp()

		interaction.reply({ embeds: [embed], ephemeral: true })
	}
}