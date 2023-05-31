const { ApplicationCommandOptionType, ChatInputCommandInteraction, GuildMember, EmbedBuilder } = require("discord.js")

module.exports = {
	name: "avatar",
	description: "Displays a user's profile avatar.",
	category: "Misc",
	expectedArgs: "<type> [user]",
	dmPermission: false,
	options: [{
		name: "type",
		description: "If the avatar displayed is the guild avatar or the main user avatar",
		type: ApplicationCommandOptionType.String,
		required: true,
		choices: [{
			name: "Main",
			value: "Main"
		}, {
			name: "Guild",
			value: "Guild"
		}]
	}, {
		name: "user",
		description: "The optional user you want to see the avatar of",
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
		if (interaction.options.getString("type") == "Guild") {
			if (!target.avatar) {
				interaction.reply({
					content: `<@${target.user.id}> does not have a server avatar`,
					ephemeral: true,
					allowedMentions: {
						users: []
					}
				})
			} else {
				const avatarAuthor = new EmbedBuilder()
					.setColor(0x000000)
					.setTitle(target.user.tag)
					.setImage(target.displayAvatarURL({ size: 4096 }))

				interaction.reply({
					embeds: [avatarAuthor],
					allowedMentions: {
						users: []
					}
				})
			}
		} else {
			const avatarAuthor = new EmbedBuilder()
				.setColor(0x000000)
				.setTitle(target.user.tag)
				.setImage(target.user.displayAvatarURL({ size: 4096 }))

			interaction.reply({
				embeds: [avatarAuthor],
				allowedMentions: {
					users: []
				}
			})
		}
	}
}