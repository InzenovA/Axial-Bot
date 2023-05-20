const { ApplicationCommandType, UserContextMenuCommandInteraction, GuildMember, EmbedBuilder } = require('discord.js')

module.exports = {
	name: 'User Info',
	category: 'Context Menu',
	type: ApplicationCommandType.User,
	dm_permission: false,
	/**
	 * 
	 * @param {{
	 * 	interaction: UserContextMenuCommandInteraction, 
	 * 	targetMember: GuildMember 
	 * }}
	 */
	callback: ({ interaction, targetMember }) => {
		const { user, joinedTimestamp, displayHexColor } = targetMember

		const profileEmbed = new EmbedBuilder()
			.setTitle('User Information')
			.setDescription(`<@${user.id}>`)
			.addFields({ 
				name: 'Member Name', 
				value: user.tag
			}, {
				name: 'Joined',
				value: `<t:${parseInt(joinedTimestamp / 1000)}:F>`,
				inline: true
			}, {
				name: 'Registered',
				value: `<t:${parseInt(user.createdTimestamp / 1000 )}:F>`,
				inline: true
			})
			.setThumbnail(targetMember.displayAvatarURL({ size: 4096 }))
			.setTimestamp()
			.setColor(displayHexColor)
		
		interaction.reply({
			embeds: [ profileEmbed ],
			ephemeral: true
		})
	}
}