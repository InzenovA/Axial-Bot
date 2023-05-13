const {
	PermissionsBitField,
	ApplicationCommandOptionType,
	ChatInputCommandInteraction,
	ActionRowBuilder,
	ModalBuilder,
	TextInputBuilder,
	TextInputStyle,
} = require('discord.js')

module.exports = {
	name: 'set-disboard',
	description: 'Sets the Disboard channel to be the specified channel.',
	category: 'Disboard',
	expectedArgs: '[channel]',
	defaultMemberPermissions: PermissionsBitField.Flags.ManageGuild,
	botPermissions: [PermissionsBitField.Flags.SendMessages],
	dmPermission: false,
	options: [{
		name: 'channel',
		description: 'The optional channel you want to send to',
		type: ApplicationCommandOptionType.Channel,
		channelTypes: [0],
		required: false
	}],
	/**
	 * 
	 * @param {{
	 * 	interaction: ChatInputCommandInteraction,
	 * 	channel: any
	 * }}
	 */
	callback: async ({ interaction, channel }) => {
		const targetChannel = interaction.options.getChannel('channel') || channel

		const modal = new ModalBuilder()
			.setTitle('Set Disboard Reminder Message')
			.setCustomId(`set-disboard ${targetChannel.id}`)

		const text = new TextInputBuilder()
			.setLabel('Message')
			.setPlaceholder('Input the reminder message to be sent')
			.setCustomId('set-disboard-message')
			.setStyle(TextInputStyle.Paragraph)
			.setRequired(true)

		const actionRow = new ActionRowBuilder().addComponents(text)
		modal.addComponents(actionRow)

		await interaction.showModal(modal)
	}
}