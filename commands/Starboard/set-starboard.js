const {
	PermissionsBitField,
	ApplicationCommandOptionType,
	ChannelType,
	ChatInputCommandInteraction,
} = require('discord.js')

const starboardSchema = require('../../schemas/starboard-schema')
const { fetchStarboardChannels } = require('../../modules/starboard')

module.exports = {
	name: 'set-starboard',
	description: 'Set a starboard channel to send messages when it receives a certain number of star reactions.',
	category: 'Starboard',
	expectedArgs: '<star count> [channel]',
	defaultMemberPermissions: PermissionsBitField.Flags.ManageGuild,
	botPermissions: [PermissionsBitField.Flags.ViewChannel, PermissionsBitField.Flags.SendMessages],
	dmPermission: false,
	options: [{
        name: 'star_count',
		description: 'The number of star reactions required to send a message to starboard',
		type: ApplicationCommandOptionType.Integer,
        minValue: 1,
        maxValue: 100,
		required: true
    },{
		name: 'channel',
		description: 'The optional channel you want messages to be sent to',
		type: ApplicationCommandOptionType.Channel,
		channelTypes: ChannelType.GuildText,
	}],
	/**
	 * 
	 * @param {{
	 * 	interaction: ChatInputCommandInteraction,
	 * 	channel: any
	 * }}
	 */
	callback: async ({ interaction, channel }) => {
        const starCount = interaction.options.getInteger('star_count')
		const targetChannel = interaction.options.getChannel('channel') || channel

		const { id: _id } = interaction.guild
		const { id: channelId } = targetChannel

		await starboardSchema.findOneAndUpdate({
			_id
		}, {
			_id,
			channelId,
			starCount
		}, {
			upsert: true
		})

		fetchStarboardChannels(_id).then(async () => {
			await interaction.reply({
				content: `The starboard channel has been bound to <#${channelId}> with **${starCount}** required reactions.`
			})
		})
	}
}