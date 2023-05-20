const { Events, CommandInteraction, Client, EmbedBuilder, PermissionsBitField } = require('discord.js')

module.exports = {
	name: Events.InteractionCreate,
	once: false,
	/**
	 * 
	 * @param {CommandInteraction} interaction 
	 * @param {Client} client 
	 */
	async execute(interaction, client) {
		if (!(interaction.isChatInputCommand() || interaction.isContextMenuCommand() )) return
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
			const targetMessage = interaction.targetMessage
			const targetMember = interaction.targetMember
			const targetUser = interaction.targetUser

			const permissionsList = command.botPermissions || []
			for (const permission of permissionsList) {
				if (!guild.members.me.permissions.has(permission)) {
					const textPermission = Object.keys(PermissionsBitField.Flags).find(key => PermissionsBitField.Flags[key] === permission)
					return interaction.reply({
						embeds: [new EmbedBuilder()
							.setDescription(`❌ I do not have the permission \`${textPermission}\` required to run the command.`)
						], ephemeral: true
					})
				}
			}

			await command.callback({ interaction, guild, channel, member, user, targetMessage, targetMember, targetUser, client })

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