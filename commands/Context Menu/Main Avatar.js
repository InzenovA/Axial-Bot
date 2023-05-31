const { ApplicationCommandType, UserContextMenuCommandInteraction, GuildMember, EmbedBuilder } = require("discord.js")

module.exports = {
	name: "Main Avatar",
	category: "Context Menu",
	type: ApplicationCommandType.User,
	/**
	 *
	 * @param {{
	 * 	interaction: UserContextMenuCommandInteraction,
	 * 	targetMember: GuildMember
	 * }}
	 */
	callback: ({ interaction, targetUser }) => {
		const embed = new EmbedBuilder()
			.setColor(0x000000)
			.setTitle(targetUser.tag)
			.setImage(targetUser.displayAvatarURL({ size: 4096 }))

		interaction.reply({
			embeds: [embed],
			ephemeral: true
		})
	}
}