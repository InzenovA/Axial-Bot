const { PermissionsBitField, ApplicationCommandOptionType, ChatInputCommandInteraction, Guild, GuildMember, EmbedBuilder } = require('discord.js')

const modlogsSchema = require('../../schemas/modlogs-schema')
const { moderatorCheck } = require('../../features/moderation')
const time = require('../../functions/time')

module.exports = {
	name: 'timeout',
	description: 'Timeout a member to prevent them from interacting.',
	category: 'Moderation',
	expectedArgs: '<user> <duration> [reason]',
	defaultMemberPermissions: PermissionsBitField.Flags.ModerateMembers,
	dm_permission: false,
	options: [{
		name: 'user',
		description: 'The user to mute',
		type: ApplicationCommandOptionType.User,
		required: true
	}, {
		name: 'duration',
		description: 'How long they should be muted for. Type "0" to unmute the member',
		type: ApplicationCommandOptionType.String,
		required: true
	}, {
		name: 'reason',
		description: 'The reason for the mute',
		type: ApplicationCommandOptionType.String,
		required: false,
		max_length: 512
	}],
	/**
	 * 
	 * @param {{
	 * 	interaction: ChatInputCommandInteraction,
	 * 	guild: Guild,
	 * 	member: GuildMember
	 * }}
	 */
	callback: async ({ interaction, guild, member }) => {
		const user = interaction.options.getUser('user')
		const duration = interaction.options.getString('duration')
		const reason = interaction.options.getString('reason')
		const target = await guild.members.fetch(user)

		const embed = new EmbedBuilder()

		const isModerator = await moderatorCheck(target, guild)
		if (isModerator) {
			embed.setDescription("❌ | You cannot timeout other moderators.").setColor(0xff0000)
			return interaction.reply({ embeds: [embed], ephemeral: true })
		}
		if (target.user.bot) {
			embed.setDescription("❌ | You cannot timeout bots.").setColor(0xff0000)
			return interaction.reply({ embeds: [embed], ephemeral: true })
		}
		if (target == member) {
			embed.setDescription("❌ | You cannot timeout yourself.").setColor(0xff0000)
			return interaction.reply({ embeds: [embed], ephemeral: true })
		}
		if (!target.moderatable) {
			embed.setDescription("❌ | I am unable to timeout that user.").setColor(0xff0000)
			return interaction.reply({ embeds: [embed], ephemeral: true })
		}

		const unixDuration = time(duration)
		if (unixDuration == null) {
			embed.setDescription("❌ | Provide a valid time format.").setColor(0xff0000)
			return interaction.reply({ embeds: [embed], ephemeral: true })
		}
		if (unixDuration === 0) {
			target.timeout(null, reason)
			embed.setDescription(`${target} (${target.user.tag}) has been unmuted`)
			target.user.send({ 
				embeds: [
					new EmbedBuilder().setDescription(`You have been unmuted from **${guild.name}**`)
				] 
			}).catch((err) => { console.log(err) })
			return interaction.reply({ embeds: [embed] })
		}
		if ((unixDuration / 1000) > 2419200) {
			embed.setDescription("❌ | The duration must be below 28d.").setColor(0xff0000)
			return interaction.reply({ embeds: [embed], ephemeral: true })
		}
		const unixTime = parseInt(Date.now()/1000 + unixDuration/1000)
		
		let responseMessage = `${target} (${target.user.tag}) has been muted.`
		let dmMessage = `You have been muted from **${guild.name}**.\nUnmute time: <t:${unixTime}:f> (<t:${unixTime}:R>)`
		if (reason) {
			responseMessage += `\n\nReason:\`\`\`\n${reason}\n\`\`\``
			dmMessage += `\n\nReason:\`\`\`\n${reason}\n\`\`\``
		}

		const dmEmbed = new EmbedBuilder()
			.setDescription(dmMessage)
			.setColor(0xff0000)
		target.user.send({ embeds: [dmEmbed] }).catch((err) => { console.log(err) })

		const responseEmbed = new EmbedBuilder()
			.setDescription(responseMessage)
			.setColor(0xff0000)

		target.timeout(time(duration), reason).then(async () => {
			await modlogsSchema.findOneAndUpdate({
				guildId: guild.id,
				userId: target.user.id
			}, {
				guildId: guild.id,
				userId: target.user.id,
				$push: {
					mutes: {
						moderator: member.id,
						timestamp: new Date(Date.now()),
						reason
					}
				}
			}, {
				upsert: true
			})

			interaction.reply({ embeds: [responseEmbed], ephemeral: false })
		})
	}
}