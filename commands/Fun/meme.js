const { ApplicationCommandOptionType, ChatInputCommandInteraction, EmbedBuilder } = require('discord.js')
const axios = require('axios')

const subreddits = [
	'funny',
	'memes',
	'wholesomememes',
	'me_irl',
	'dankmemes',
	'meme',
	'MemeEconomy'
]

module.exports = {
	name: 'meme',
	description: 'Posts a random meme from a random or specific reddit.',
	category: 'Fun',
	expectedArgs: '[subreddit]',
	options: [{
		name: 'subreddit',
		description: 'The subreddit you want the memes from',
		type: ApplicationCommandOptionType.String,
		choices: [{
			name: 'funny',
			value: 'dankmemes'
		}, {
			name: 'memes',
			value: 'memes'
		}, {
			name: 'wholesomememes',
			value: 'wholesomememes'
		}, {
			name: 'me_irl',
			value: 'me_irl'
		}, {
			name: 'dankmemes',
			value: 'dankmemes'
		},  {
			name: 'meme',
			value: 'meme'
		}, {
			name: 'MemeEconomy',
			value: 'MemeEconomy'
		}]
	}],
	/**
	 * 
	 * @param {{
	 * 	interaction: ChatInputCommandInteraction
	 * }}
	 */
	callback: async ({ interaction }) => {
		const subreddit = interaction.options.getString('subreddit') || subreddits[Math.floor(Math.random() * subreddits.length)]

		axios
			.get(`https://www.reddit.com/r/${subreddit}/random/.json`)
			.then(response => {
				let permalink = response.data[0].data.children[0].data.permalink
				let memeUrl = `https://reddit.com${permalink}`
				let memeImage = response.data[0].data.children[0].data.url
				let memeTitle = response.data[0].data.children[0].data.title
				let memeUpvotes = response.data[0].data.children[0].data.ups
				let memeDownvotes = response.data[0].data.children[0].data.downs
				let memeNumComments = response.data[0].data.children[0].data.num_comments

				const memeEmbed = new EmbedBuilder()
					.setTitle(`${memeTitle}`)
					.setURL(`${memeUrl}`)
					.setImage(memeImage)
					.setColor('Random')
					.setFooter({ text: `👍 ${memeUpvotes} | 👎 ${memeDownvotes} | 💬 ${memeNumComments}` })
				interaction.reply({
					embeds: [ memeEmbed ]
				})
			})
	}
}