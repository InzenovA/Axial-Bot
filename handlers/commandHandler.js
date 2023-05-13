const { Client, Events } = require('discord.js')
const { readdirSync } = require('fs')

/**
 * 
 * @param {Client} client 
 */
module.exports = async (client) => {
	client.commands.clear()
	let commandsArray = []
	let guildCommandsArray = []

	const commandFolders = readdirSync('./commands')
	for (const folder of commandFolders) {
		const commandFiles = readdirSync(`./commands/${folder}`).filter(file => file.endsWith('.js'))

		for (const file of commandFiles) {
			const command = require(`../commands/${folder}/${file}`)

			if (!command.name) continue

			client.commands.set(command.name, command)
			if (command.testOnly) guildCommandsArray.push(command)
			else commandsArray.push(command)
		}
	}

	for (const command of client.commands) {
		client.commandCategories[command[1].category]
		? client.commandCategories[command[1].category].push(command[0])
		: client.commandCategories[command[1].category] = [command[0]]
	}

	client.on(Events.ClientReady, async () => {
		client.application.commands.set(commandsArray)

		await client.guilds.fetch()
		for (const guild of client.testGuilds) {
			client.guilds.cache.get(`${guild}`).commands.set(guildCommandsArray)
		}
	})
}