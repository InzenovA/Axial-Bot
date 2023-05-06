const { Events, CommandInteraction, Client, EmbedBuilder } = require('discord.js')

module.exports = {
	name: Events.InteractionCreate,
	once: false,
	/**
	 * 
	 * @param {CommandInteraction} interaction 
	 * @param {Client} client 
	 */
	async execute(interaction, client) {
		if (!(interaction.isChatInputCommand() || interaction.isContextMenuCommand())) {
			console.log(`An interaction of type ${interaction.type} was attempted to be executed.`)
		}
		const command = client.commands.get(interaction.commandName)

		if (!command) {
			interaction.reply({
				embeds: [new EmbedBuilder()
					.setDescription("❌ | This command no longer exists.")
				], ephemeral: true
			})

			return client.commands.delete(interaction.commandName)
		}

		try {
			const guild = interaction.guild
			const channel = interaction.channel
			const member = interaction.member
			const user = interaction.user
			
			// Context menu only data
			const targetMessage = interaction.targetMessage ? interaction.targetMessage : null
			const targetMember = interaction.targetMember ? interaction.targetMember : null
			const targetUser = interaction.targetUser ? interaction.targetUser : null

			await command.callback({ client, interaction, guild, channel, member, user, targetMessage, targetMember, targetUser })

		} catch (err) {
			console.error(err)
			interaction.reply({
				embeds: [new EmbedBuilder()
					.setDescription("❌ | An error has occured while trying to run the command. Please try again.")
				], ephemeral: true
			})
		}
	}
}