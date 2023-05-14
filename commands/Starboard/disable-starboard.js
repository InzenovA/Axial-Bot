const { PermissionsBitField, ChatInputCommandInteraction, Guild } = require('discord.js')
const { deleteCache } = require('../../modules/starboard')

module.exports = {
	name: 'disable-starboard',
	description: 'Disables starboard in the guild.',
	category: 'Starboard',
	defaultMemberPermissions: PermissionsBitField.Flags.ManageGuild,
	dmPermission: false,
	/**
	 * 
	 * @param {{
	 * 	interaction: ChatInputCommandInteraction,
	 * 	guild: Guild
	 * }}
	 */
	callback: async ({ interaction, guild }) => {		
		deleteCache(guild.id).then(() => {
			interaction.reply({ content: 'The Disboard reminders has been disabled.' })
		})
	}
}