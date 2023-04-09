const { PermissionsBitField, ChatInputCommandInteraction, GuildMember } = require('discord.js')
const { deleteCache } = require('../../features/disboard')

module.exports = {
	name: 'disable-disboard',
	description: 'Disables the Disboard reminders in the guild.',
	category: 'Disboard',
	defaultMemberPermissions: PermissionsBitField.Flags.ManageGuild,
	dmPermission: false,
	/**
	 * 
	 * @param {{
	 * 	interaction: ChatInputCommandInteraction,
	 * 	guild: GuildMember
	 * }}
	 */
	callback: async ({ interaction, guild }) => {		
		deleteCache(guild.id).then(() => {
			interaction.reply({ content: 'The Disboard reminders has been disabled.' })
		})
	}
}