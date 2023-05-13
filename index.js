require('dotenv').config()
const process = require('node:process')
const { readdirSync } = require('fs')

process.on('unhandledRejection', (reason, promise) => {
	console.log(promise, reason)
})

const { Client, GatewayIntentBits, Collection, ActivityType } = require('discord.js')
const client = new Client({
	intents: [
		GatewayIntentBits.Guilds,
		GatewayIntentBits.GuildMembers,
		GatewayIntentBits.GuildMessages,
		GatewayIntentBits.MessageContent
	],
	presence: {
		status: 'online',
		afk: false,
		activity:  {
			name: `/help`,
			type: ActivityType.Playing
		}
	}
})

client.commands = new Collection()
client.commandCategories = {}
client.testGuilds = ['600750065786683392', '787294199090380840']

const handlerFiles = readdirSync('./handlers').filter(file => file.endsWith('.js'))
for (const file of handlerFiles) {
	require(`./handlers/${file}`)(client)
}

client.login(process.env.botToken)