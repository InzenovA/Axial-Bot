const {
	Client,
	Events,
	ActionRowBuilder,
	StringSelectMenuBuilder,
	ButtonBuilder,
	ButtonStyle,
	EmbedBuilder,
} = require('discord.js')

const emojis = {
	"Context Menu": "📑",
	"Disboard": "📈",
	"Fun": "🎲",
	"Giveaways": "🎉",
	"Help": "❓",
	"Misc": "📀",
	"Moderation": "🔨",
	"Starboard": "⭐",
	"Utility": "🧰"
}

/**
 * 
 * @param {Client} client
 * @param {string} name 
 * @returns 
 */
const getCommandId = (client, name) => {
	const commandId = client.application.commands.cache
		.filter(command => command.name == name)
		.map(command => command.id)
	return commandId
}

/**
 * 
 * @param {Client} client 
 * @param {EmbedBuilder} embed 
 * @param {number} page
 * @param {string} filter 
 * @returns 
 */
const addCommandToEmbed = (client, embed, filter="All", page=1) => {
	filter == "All" ? commandList = client.commands : commandList = client.commands.filter(command => command.category == filter)
	for (let i = (page - 1) * 5; i < page * 5 && i < commandList.size; i++) {
		const commandObject = commandList.at(i)
		embed.addFields({
			name: `</${commandObject.name}:${getCommandId(client, commandObject.name)}>`,
			value: commandObject.description || "No description.",
		})
	}
	let lastPage = commandList.size / 5
	if (lastPage % 1 != 0) lastPage = parseInt(lastPage += 1)
	
	embed.setFooter({ text: `Page ${page} of ${parseInt(lastPage)}`})
	embed.setDescription(`### Category: ${filter}`)
	return embed
}

/**
 * 
 * @param {Client} client 
 * @param {number} currentPage
 * @param {number} lastPage
 * @returns 
 */
let components = (client, currentPage, lastPage) => {
	let selectMenuOptions = [{
		label: 'All',
		value: 'All',
		emoji: "🌐",
	}]
	for (const category of Object.keys(client.commandCategories)) {
		selectMenuOptions.push({
			label: category,
			value: category,
			emoji: emojis[category]
		})
	}

	const selectMenu = new ActionRowBuilder()
		.addComponents(
			new StringSelectMenuBuilder()
				.setCustomId('help-menu-select')
				.setPlaceholder('Select a category')
				.setMinValues(1)
				.setMaxValues(1)
				.setOptions(selectMenuOptions)
		)

	const startButton = new ButtonBuilder().setCustomId('start')
		.setCustomId('help-menu-start')
		.setEmoji("⏮")
		.setStyle(ButtonStyle.Secondary)
		.setDisabled(currentPage <= 1)
	const previousButton = new ButtonBuilder()
		.setCustomId('help-menu-previous')
		.setEmoji("⏪")
		.setStyle(ButtonStyle.Primary)
		.setDisabled(currentPage <= 1)
	const nextButton = new ButtonBuilder()
		.setCustomId('help-menu-next')
		.setEmoji("⏩")
		.setStyle(ButtonStyle.Primary)
		.setDisabled(currentPage == lastPage)
	const endButton = new ButtonBuilder()
		.setCustomId('help-menu-end')
		.setEmoji("⏭")
		.setStyle(ButtonStyle.Secondary)
		.setDisabled(currentPage == lastPage)

	const buttons = new ActionRowBuilder().addComponents(startButton, previousButton, nextButton, endButton)
	return [selectMenu, buttons]
}

/**
 * 
 * @param {Client} client 
 */
module.exports = (client) => {
	client.on(Events.InteractionCreate, async (interaction) => {
		if ( !(interaction.isButton() || interaction.isStringSelectMenu()) ) return
		if (!interaction.customId.startsWith('help-menu-')) return

		if (interaction.message.interaction.user.id != interaction.user.id) {
			return interaction.reply({ content: "This is not your help command.", ephemeral: true })
		}
		
		delete interaction.message.embeds[0].data.fields
		let newEmbed = new EmbedBuilder(interaction.message.embeds[0].data)

		if (interaction.isStringSelectMenu()) {
			delete interaction.message.embeds[0].data.footer
			delete interaction.message.embeds[0].data.description

			newEmbed = addCommandToEmbed(client, newEmbed, interaction.values[0])

			const currentPage = newEmbed.data.footer.text.split(" ")[1]
			const lastPage = newEmbed.data.footer.text.split(" ")[3] 

			interaction.update({ embeds: [ newEmbed ], components: components(client, currentPage, lastPage) })
		} else if (interaction.isButton()) {
			const currentCategory = interaction.message.embeds[0].data.description.split(" ")[2]
			delete interaction.message.embeds[0].data.description

			const currentPage = parseInt(interaction.message.embeds[0].data.footer.text.split(" ")[1])
			const lastPage = parseInt(interaction.message.embeds[0].data.footer.text.split(" ")[3])

			delete interaction.message.embeds[0].data.footer

			switch (interaction.customId) {
				case 'help-menu-start':
					newEmbed = addCommandToEmbed(client, newEmbed, currentCategory)
					interaction.update({ embeds: [ newEmbed ], components: components(client, 1, lastPage) })
					break
				case 'help-menu-previous':
					newEmbed = addCommandToEmbed(client, newEmbed, currentCategory, currentPage - 1)
					interaction.update({ embeds: [ newEmbed ], components: components(client, currentPage - 1, lastPage) })
					break
				case 'help-menu-next':
					newEmbed = addCommandToEmbed(client, newEmbed, currentCategory, currentPage + 1)
					interaction.update({ embeds: [ newEmbed ], components: components(client, currentPage + 1, lastPage) })
					break
				case 'help-menu-end':
					newEmbed = addCommandToEmbed(client, newEmbed, currentCategory, lastPage)
					interaction.update({ embeds: [ newEmbed ], components: components(client, lastPage, lastPage) })
					break
				default:
					return
			}
		}
	})
}

module.exports.getCommandId = getCommandId
module.exports.addCommandToEmbed = addCommandToEmbed
module.exports.components = components
module.exports.emojis = emojis