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
			return interaction.reply({
				content: `${targetMember.toString()} does not have a server avatar.`,
				ephemeral: true,
				allowedMentions: { users: [] }
			})
		}

		const embed = new EmbedBuilder()
			.setColor(0x000000)
			.setTitle(targetMember.user.tag)
			.setImage(targetMember.displayAvatarURL({ size: 4096 }))

		interaction.reply({ embeds: [embed], ephemeral: true })
	}
}