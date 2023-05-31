const { Client } = require("discord.js")
const { readdirSync } = require("fs")

/**
 *
 * @param {Client} client
 */
module.exports = (client) => {
	const featureFiles = readdirSync("./modules").filter(file => file.endsWith(".js"))

	for (const file of featureFiles) {
		require(`../modules/${file}`)(client)
	}

}