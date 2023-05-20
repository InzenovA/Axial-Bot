const { ChatInputCommandInteraction, EmbedBuilder, Client } = require('discord.js')
const { dependencies } = require('../../package.json')

module.exports = {
	name: 'bot-info',
	description: "Displays information & statistics about the bot.",
	category: 'Misc',
	/**
	 * 
	 * @param {{
	 * 	interaction: ChatInputCommandInteraction,
	 * 	client: Client
	 * }}
	 */
	callback: async ({ interaction, client }) => {
		const { id, tag, createdTimestamp } = client.user
		const serverCount = await client.guilds.cache.size

		let totalSeconds = client.uptime / 1000
		const days = Math.floor( totalSeconds / (24 * 60 * 60) )
		totalSeconds %= 24 * 60 * 60
		const hours = Math.floor( totalSeconds / (60 * 60) )
		totalSeconds %= 60 * 60
		const minutes = Math.floor( totalSeconds / 60 )
		const seconds = Math.floor( totalSeconds % 60 )
		const uptime = `${days} days, ${hours} hours, ${minutes} minutes, ${seconds} seconds`

		let dependencyString = ""
		for (const dependency of Object.keys(dependencies)) {
			dependencyString += `\n**${dependency}**: v${dependencies[dependency].substring(1)}`
		}

		const botEmbed = new EmbedBuilder()
			.setTitle(tag)
			.setDescription(`<@${id}>`)
			.addFields({
				name: 'Created',
				value: `<t:${parseInt(createdTimestamp / 1000 )}:F>`,
			}, {
				name: 'Information',
				value: `Uptime: ${uptime}\nServer Count: ${serverCount}`,
			}, {
				name: 'Packages & Versions',
				value: `**Node.js**: ${process.version}${dependencyString}`,
				inline: true
			}, {
				name: 'Memory Usage',
				value: `${process.memoryUsage.rss()/1000000} MB`,
				inline: true
			})
			.setThumbnail(client.user.displayAvatarURL({ size: 4096 }))
			.setTimestamp()
			.setFooter({ text: `Bot ID: ${id}`})
		
		interaction.reply({
			embeds: [ botEmbed ]
		})
	}
}