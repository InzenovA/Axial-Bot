const { Events, Client } = require('discord.js')
const { connect } = require('mongoose')

module.exports = {
	name: Events.ClientReady,
	once: true,
	/**
	 * 
	 * @param {Client} client 
	 */
	execute(client) {
		console.log(`The bot is now online. Logged in as ${client.user.tag}`)

		connect(process.env.mongoPath, {
			useNewUrlParser: true,
			useUnifiedTopology: true
		}).then(() => {
			console.log("The bot is now connected to the database.")
		}).catch(err => {
			console.log(err)
		})
	}
}