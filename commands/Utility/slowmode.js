const { PermissionsBitField, ApplicationCommandOptionType, ChatInputCommandInteraction } = require('discord.js')
const time = require('../../functions/time')

module.exports = {
	name: 'slowmode',
	description: 'Set a slowmode for a channel.',
	category: 'Utility',
	expectedArgs: '<time> [channel] [reason]',
	defaultMemberPermissions: PermissionsBitField.Flags.ManageChannels,
	botPermissions: [PermissionsBitField.Flags.ManageChannels],
	dm_permission: false,
	options: [{
		name: 'duration',
		description: 'How long the slowmode should be',
		type: ApplicationCommandOptionType.String,
		required: true
	}, {
		name: 'channel',
		description: 'The channel you want to set the slowmode to',
		type: ApplicationCommandOptionType.Channel,
		channelTypes: [0],
		required: false
	}, {
		name: 'reason',
		description: 'Reason the slowmode was changed', 
		type: ApplicationCommandOptionType.String,
		required: false
	}],
	/**
	 * 
	 * @param {{
	 * 	interaction: ChatInputCommandInteraction,
	 * 	channel: any
	 * }}
	 */
	callback: ({ interaction, channel }) => {
		const duration = interaction.options.getString('duration')
		const targetChannel = interaction.options.getChannel('channel')
		const reason = interaction.options.getString('reason')
		
		const length = time(duration) / 1000
		if (length == null) return interaction.reply({ content: "Invalid time format." }) 
		if (length > 21600 || length < 0) return interaction.reply({ content: "The duration must be between 0 seconds (off) and 6 hours." })

		if (!targetChannel) targetChannel = channel

		targetChannel.setRateLimitPerUser(length, reason).then(() => {
			interaction.reply({ content: `Set the channel slowmode to **${duration}**.` }) 
		})
	}
}