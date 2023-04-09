const { PermissionsBitField, ApplicationCommandOptionType, ChatInputCommandInteraction, Guild, GuildMember, Client, EmbedBuilder } = require('discord.js')

const modlogsSchema = require('../../schemas/modlogs-schema')
const banSchema = require('../../schemas/bans-schema')
const { moderatorCheck, loadBans } = require('../../features/moderation')
const time = require('../../functions/time')

module.exports = {
	name: 'ban',
	description: 'Ban a member from the server with an optional timer.',
	category: 'Moderation',
	expectedArgs: '<user> [duration] [delete_messages] [reason]',
	defaultMemberPermissions: PermissionsBitField.Flags.BanMembers,
	dm_permission: false,
	options: [{
		name: 'user',
		description: 'The user to ban',
		type: ApplicationCommandOptionType.User,
		required: true
	}, {
		name: 'duration',
		description: 'How long they should be banned for',
		type: ApplicationCommandOptionType.String,
		required: false
	}, {
		name: 'delete_messages',
		description: 'How much of their recent message history to delete',
		type: ApplicationCommandOptionType.String,
		required: false
	}, {
		name: 'reason',
		description: 'The reason for the ban',
		type: ApplicationCommandOptionType.String,
		required: false
	}],
	/**
	 * 
	 * @param {{
	 * 	interaction: ChatInputCommandInteraction,
	 * 	guild: Guild,
	 * 	member: GuildMember,
	 * 	client: Client
	 * }}
	 */
	callback: async ({ interaction, guild, member, client }) => {
		const user = interaction.options.getUser('user')
		const duration = interaction.options.getString('duration')
		const deleteMessages = interaction.options.getString('delete_messages')
		const reason = interaction.options.getString('reason')
		const target = await guild.members.fetch(user)

		const embed = new EmbedBuilder()

		const isModerator = await moderatorCheck(target, guild)
		if (isModerator) {
			embed.setDescription("❌ | You cannot timeout other moderators.").setColor(0xff0000)
			return interaction.reply({ embeds: [embed], ephemeral: true })
		}
		if (target.user.bot) {
			embed.setDescription("❌ | You cannot ban bots.").setColor(0xff0000)
			return interaction.reply({ embeds: [embed], ephemeral: true })
		}
		if (target == member) {
			embed.setDescription("❌ | You cannot ban yourself.").setColor(0xff0000)
			return interaction.reply({ embeds: [embed], ephemeral: true })
		}
		if (!target.bannable) {
			embed.setDescription("❌ | I am unable to ban that user.").setColor(0xff0000)
			return interaction.reply({ embeds: [embed], ephemeral: true })
		}

		// let deleteMessages = null

		let responseMessage = `${target} (${target.user.tag}) has been banned.`
		let dmMessage = `You have been banned from **${guild.name}**.`

		if (duration) {
			const unixDuration = time(duration)
			if (unixDuration == null) {
				embed.setDescription("❌ | Provide a valid time format.")
				return interaction.reply({ embeds: [embed], ephemeral: true })
			}
			const unixTime = parseInt(Date.now() / 1000 + unixDuration / 1000)
			dmMessage += `\nUnban time: <t:${unixTime}:f> (<t:${unixTime}:R>)`
		}

		if (reason) {
			responseMessage += `\n\nReason:\`\`\`\n${reason}\n\`\`\``
			dmMessage += `\n\nReason:\`\`\`\n${reason}\n\`\`\``
		}

		if (deleteMessages) {
			var deleteMessageSeconds = time(deleteMessages) / 1000

			if (deleteMessages == null) {
				embed.setDescription("❌ | Provide a valid time format.")
				return interaction.reply({ embeds: [embed], ephemeral: true })
			} else if (deleteMessages > 604800) {
				embed.setDescription("❌ | The time must be below 7 days.")
				return interaction.reply({ embeds: [embed], ephemeral: true })
			}
		}

		const dmEmbed = new EmbedBuilder()
			.setDescription(dmMessage)
			.setColor(0xff0000)
		target.user.send({ embeds: [dmEmbed] }).catch((err) => { console.log(err) })

		embed.setDescription(responseMessage).setColor(0xff0000)

		target.ban({ deleteMessageSeconds, reason: reason })

		if (duration) {
			const banDuration = time(duration)
			const data = {
				guildId: guild.id,
				userId: target.user.id,
				endTime: new Date(Date.now() + banDuration)
			}
			await new banSchema(data).save()
			loadBans(client, [data])
		}

		await modlogsSchema.findOneAndUpdate({
			guildId: guild.id,
			userId: target.user.id
		}, {
			guildId: guild.id,
			userId: target.user.id,
			$push: {
				bans: {
					moderator: member.id,
					timestamp: new Date(Date.now()),
					reason
				}
			}
		}, {
			upsert: true
		})

		interaction.reply({ embeds: [embed], ephemeral: false })
	}
}