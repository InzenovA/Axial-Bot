const { ApplicationCommandType, UserContextMenuCommandInteraction, GuildMember, EmbedBuilder } = require("discord.js")

module.exports = {
	name: "Guild Avatar",
	category: "Context Menu",
	type: ApplicationCommandType.User,
	dmPermission: false,
	/**
	 *
	 * @param {{
	 * 	interaction: UserContextMenuCommandInteraction,
	 * 	targetMember: GuildMember
	 * }}
	 */
	callback: ({ interaction, targetMember }) => {
		if (!targetMember.avatar) {
			interaction.reply({
				content: `<@${targetMember.user.id}> does not have a server avatar`,
				ephemeral: true,
				allowedMentions: {
					users: []
				}
			})
		} else {
			const avatarAuthor = new EmbedBuilder()
				.setColor(0x000000)
				.setTitle(targetMember.user.tag)
				.setImage(targetMember.displayAvatarURL({ size: 4096 }))

			interaction.reply({
				embeds: [avatarAuthor],
				ephemeral: true,
				allowedMentions: {
					users: []
				}
			})
		}

	}
}