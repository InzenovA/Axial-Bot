require('dotenv').config()
const { readdirSync } = require('fs')

const { Client, GatewayIntentBits, Collection } = require('discord.js')
const client = new Client({
	intents: [
		GatewayIntentBits.Guilds,
		GatewayIntentBits.GuildMembers,
		GatewayIntentBits.GuildModeration,
		GatewayIntentBits.GuildMessages,
		GatewayIntentBits.GuildMessageReactions
	],
	presence: {
		status: 'online',
		afk: false,
		activity: {
			name: `/help`,
			type: 'PLAYING'
		}
	}
})

client.commands = new Collection()
client.events = new Collection()
client.testGuilds = ['600750065786683392', '787294199090380840']

const handlerFiles = readdirSync('./handlers').filter(file => file.endsWith('.js'))
for (const file of handlerFiles) {
	require(`./handlers/${file}`)(client)
}

client.login(process.env.botToken)