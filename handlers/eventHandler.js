const { Client } = require('discord.js')
const { readdirSync } = require('fs')

/**
 * 
 * @param {Client} client 
 */
module.exports = (client) => {
	const eventFiles = readdirSync('./events').filter(file => file.endsWith('.js'))

	for (const file of eventFiles) {
		const event = require(`../events/${file}`)

		if (event.once) {
			client.once(event.name, async (...args) => event.execute(...args, client))
		} else {
			client.on(event.name, async (...args) => event.execute(...args, client))
		}
	}

}