const { PermissionsBitField, ApplicationCommandOptionType, ChatInputCommandInteraction, Guild } = require('discord.js')
const disboardSchema = require('../../schemas/disboard-schema')
const { fetchDisboardChannels } = require('../../features/disboard')

module.exports = {
	name: 'set-disboard',
	description: 'Sets the Disboard channel to be the specified channel.',
	category: 'Disboard',
	expectedArgs: '<message> [channel]',
	defaultMemberPermissions: PermissionsBitField.Flags.ManageGuild,
	dmPermission: false,
	options: [{
		name: 'message',
		description: 'The text you want the bot to send',
		type: ApplicationCommandOptionType.String,
		required: true
	}, {
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
	 * 	guild: Guild,
	 * 	channel: any
	 * }}
	 */
	callback: async ({ interaction, guild, channel }) => {		
		const targetChannel = interaction.options.getChannel('channel') || channel
		const text = interaction.options.getString('message')
		
		const { id: _id } = guild
		const { id: channelId } = targetChannel

		await disboardSchema.findOneAndUpdate({
			_id
		}, {
			_id,
			channelId,
			content: text
		}, {
			upsert: true
		})

		fetchDisboardChannels(_id).then(() => {
			interaction.reply({ content: `The Disboard reminder channel has been bound to <#${targetChannel.id}>.
				**NOTE:** The new message and channel location will take effect in the next bump.`,
			})
		})
	}
}