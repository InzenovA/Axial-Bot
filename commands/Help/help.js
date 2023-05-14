const {
	ApplicationCommandOptionType,
	ChatInputCommandInteraction,
	Client,
	EmbedBuilder,
	ActionRowBuilder,
	StringSelectMenuBuilder,
	ButtonBuilder,
	ButtonStyle,
} = require('discord.js')

const emojis = {
	"Context Menu": "📑",
	"Disboard": "📈",
	"Fun": "🎲",
	"Help": "❓",
	"Misc": "📀",
	"Moderation": "🔨",
	"Starboard": "⭐",
	"Utility": "🧰"
}

module.exports = {
	name: 'help',
	description: 'Displays all the commands available on the bot.',
	category: 'Help',
	expectedArgs: '[command]',
	options: [{
		name: 'command',
		description: 'The command name you want extra information for',
		required: false,
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
		await interaction.deferReply()

		let selectMenuOptions = [{
			label: 'All',
			value: 'all',
			emoji: "🌐",
			default: true
		}]
		for (const category of Object.keys(client.commandCategories)) {
			selectMenuOptions.push({
				label: category,
				value: category.toLowerCase(),
				emoji: emojis[category]
			})
		}

		let embed = new EmbedBuilder()
			.setTitle("Axial-Bot Help Menu")
			.setColor('Blue')

		const getCommand = (name) => {
			const commandId = client.application.commands.cache
				.filter(command => command.name == name)
				.map(command => command.id)
			return commandId
		}

		let components = (disabled=false) => {
			const actionRow = new ActionRowBuilder()
				.addComponents(
					new StringSelectMenuBuilder()
						.setCustomId('help-menu-select')
						.setPlaceholder('Select a category')
						.setDisabled(disabled)
						.setMinValues(0)
						.setMaxValues(1)
						.setOptions(selectMenuOptions)
				)
	
			const startButton = new ButtonBuilder()
				.setCustomId('start')
				.setEmoji("⏮")
				.setStyle(ButtonStyle.Secondary)
				.setDisabled(disabled)

			const previousButton = new ButtonBuilder()
				.setCustomId('previous')
				.setEmoji("⏪")
				.setStyle(ButtonStyle.Primary)
				.setDisabled(disabled)

			const nextButton = new ButtonBuilder()
				.setCustomId('next')
				.setEmoji("⏩")
				.setStyle(ButtonStyle.Primary)
				.setDisabled(disabled)

			const endButton = new ButtonBuilder()
				.setCustomId('end')
				.setEmoji("⏭")
				.setStyle(ButtonStyle.Secondary)
				.setDisabled(disabled)

			const buttons = new ActionRowBuilder().addComponents(startButton, previousButton, nextButton, endButton)

			return [ actionRow, buttons ]
		}

		const createMenu = (filter="all") => {
			filter == "all" ? commandList = client.commands : commandList = client.commands.filter(command => command.category == filter)
			return commandList
		}

		interaction.editReply({
			embeds: [ embed ],
			components: components()
		})
	}
}