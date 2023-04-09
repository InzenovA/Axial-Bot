const { ChatInputCommandInteraction, Guild, EmbedBuilder, ChannelType } = require('discord.js')

module.exports = {
	name: 'server-info',
	description: "Displays information about the server.",
	category: 'Misc',
	dm_permission: false,
	/**
	 * 
	 * @param {{
	 * 	interaction: ChatInputCommandInteraction,
	 * 	guild: Guild
	 * }}
	 */
	callback: async ({ interaction, guild }) => {
		const owner = await guild.fetchOwner()
		const { name, description, createdTimestamp, id, members, memberCount, channels, roles, premiumTier, premiumSubscriptionCount, emojis, stickers } = guild

		await members.fetch()
		await roles.fetch()
		await emojis.fetch()

		const serverEmbed = new EmbedBuilder()
			.setTitle(name)
			.setDescription(`Created: <t:${parseInt(createdTimestamp / 1000 )}:F>`)
			.addFields([{
				name: 'Description',
				value: description? description : "No description"
			}, { 
				name: 'Owner',
				value: `<@${owner.id}>\n${owner.user.tag}`
			}, {
				name: 'Members',
				value: `👥 Total: ${memberCount}\n
				👤 Humans: ${members.cache.filter((m) => !m.user.bot).size}
				🤖 Bots: ${members.cache.filter((m) => m.user.bot).size}`,
				inline: true
			}, {
				name: 'Channels',
				value: `Total: ${channels.cache.size}\n
					#️⃣ Text: ${channels.cache.filter((c) => c.type == ChannelType.GuildText).size}
					🔊 Voice: ${channels.cache.filter((c) => c.type == ChannelType.GuildVoice).size}`,
				inline: true
			}, {
				name: 'Roles',
				value: `${roles.cache.size}`,
				inline: true
			}, {
				name: 'Nitro',
				value: `Tier: ${premiumTier}
					Boosts: ${premiumSubscriptionCount}
					Boosters: ${members.cache.filter((m) => m.premiumSince).size}`,
				inline: true
			}, {
				name: 'Emotes',
				value: `Total: ${emojis.cache.size + stickers.cache.size}\n
					Static: ${emojis.cache.filter((e) => !e.animated).size}
					Animated: ${emojis.cache.filter((e) => e.animated).size}\nStickers: ${stickers.cache.size}`,
				inline: true
			}])
			.setThumbnail(guild.iconURL({ format: "png", dynamic: true }))
			.setColor(guild.members.me.roles.highest.hexColor)
			.setFooter({ text: `ID: ${id}` })
		
		interaction.reply({
			embeds: [ serverEmbed ]
		})
	}
}