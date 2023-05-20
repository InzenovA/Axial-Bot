const { ChatInputCommandInteraction, Client, EmbedBuilder } = require('discord.js')

module.exports = {
	name: 'ping',
	description: 'Replies with pong and sends latency data.',
	category: 'Misc',
	/**
	 * 
	 * @param {{
	 * 	interaction: ChatInputCommandInteraction,
	 * 	client: Client
	 * }}
	 */
	callback: async ({ interaction, client }) => {
		const msg = await interaction.reply({ content: 'Pong!', fetchReply: true })

		const latency = new EmbedBuilder()
			.setAuthor({ name: 'Latency', iconURL: 'https://media.istockphoto.com/vectors/vector-radar-screen-vector-id695371778?k=20&m=695371778&s=612x612&w=0&h=nV0ehLS07zqo5cKPxzkkNufgZOqAXMYyllbTaX8B3Ds=' })
			.addFields({ 
				name: '🤖   Bot Latency', 
				value: `${msg.createdTimestamp - interaction.createdTimestamp}ms`
			}, {
				name: '🔌   WebSocket Latency',
				value: `${client.ws.ping}ms`
			})
			.setColor(0x23E90F)
			.setTimestamp()

		await interaction.editReply({ 
			content: 'Pong!',
			embeds: [ latency ]
		})
	},
}