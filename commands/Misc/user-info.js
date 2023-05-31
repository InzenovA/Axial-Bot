const { ApplicationCommandOptionType, ChatInputCommandInteraction, GuildMember, EmbedBuilder } = require("discord.js")

module.exports = {
	name: "user-info",
	description: "Displays a user's profile information.",
	category: "Misc",
	expectedArgs: "[user]",
	dm_permission: false,
	options: [{
		name: "user",
		description: "The optional user you want to see the profile of",
		type: ApplicationCommandOptionType.User
	}],
	/**
	 *
	 * @param {{
	 * 	interaction: ChatInputCommandInteraction,
	 * 	member: GuildMember
	 * }}
	 */
	callback: ({ interaction, member }) => {
		const target = interaction.options.getMember("user") || member
		const { user, joinedTimestamp, displayHexColor } = target

		const embed = new EmbedBuilder()
			.setTitle("User Information")
			.setDescription(`<@${user.id}>`)
			.addFields({
				name: "Member Name",
				value: user.tag
			}, {
				name: "Joined",
				value: `<t:${parseInt(joinedTimestamp / 1000)}:F>`,
				inline: true
			}, {
				name: "Registered",
				value: `<t:${parseInt(user.createdTimestamp / 1000)}:F>`,
				inline: true
			})
			.setThumbnail(target.displayAvatarURL({ size: 4096 }))
			.setTimestamp()
			.setColor(displayHexColor)

		interaction.reply({
			embeds: [embed]
		})
	}
}