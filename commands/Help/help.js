const {
	ApplicationCommandOptionType,
	ChatInputCommandInteraction,
	Client,
	EmbedBuilder,
	PermissionsBitField
} = require('discord.js')


const { getCommandId, addCommandToEmbed, components, emojis } = require('../../modules/help-module')

module.exports = {
	name: 'help',
	description: 'Displays all the commands available on the bot.',
	category: 'Help',
	expectedArgs: '[command]',
	options: [{
		name: 'command',
		description: 'The command name you want extra information for',
		type: ApplicationCommandOptionType.String
	}],
	/**
	 * 
	 * @param {{
	 * 	interaction: ChatInputCommandInteraction,
	 * 	client: Client
	 * }}
	 */
	callback: async ({ interaction, client }) => {
		const specificCommand = interaction.options.getString('command')
		if (specificCommand) {
			const commandObject = client.commands.find(command => command.name == specificCommand)
			if (!commandObject) {
				return interaction.reply({ content: "That command does not exist.", ephemeral: true })
			}

			let commandEmbed = new EmbedBuilder().setTitle(`</${commandObject.name}:${getCommandId(client, commandObject.name)}> command info`).setColor('Blue')
			commandEmbed.setDescription(commandObject.description || null)

			let usage = `/${commandObject.name}`
			if (commandObject.expectedArgs) usage += ` ${commandObject.expectedArgs}`
			commandEmbed.addFields({ name: "Usage", value: usage })

			if (commandObject.botPermissions) {
				let textPermissions = ""
				for (const permission of commandObject.botPermissions) {
					textPermissions += `${Object.keys(PermissionsBitField.Flags).find(key => PermissionsBitField.Flags[key] === permission)}, `
				}
				commandEmbed.addFields({ name: "Required Bot Permissions", value: textPermissions.slice(0, -2) })
			}

			return interaction.reply({ embeds: [commandEmbed] })
		}

		await interaction.deferReply()

		let embed = new EmbedBuilder()
			.setTitle(`${client.user.username} Help Menu`)
			.setColor('Blue')
		
		embed = addCommandToEmbed(client, embed)
		const lastPage = embed.data.footer.text.split(" ")[3]

		interaction.editReply({
			embeds: [embed],
			components: components(client, 1, lastPage)
		})
	}
}