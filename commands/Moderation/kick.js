const { PermissionsBitField, ApplicationCommandOptionType, ChatInputCommandInteraction, Guild, GuildMember, EmbedBuilder } = require('discord.js')

const modlogsSchema = require('../../schemas/modlogs-schema')
const { moderatorCheck } = require('../../modules/moderation')

module.exports = {
	name: 'kick',
	description: 'Kick a member from the server.',
	category: 'Moderation',
	expectedArgs: '<user> [reason]',
	defaultMemberPermissions: PermissionsBitField.Flags.KickMembers,
	dm_permission: false,
	options: [{
		name: 'user',
		description: 'The user to kick',
		type: ApplicationCommandOptionType.User,
		required: true
	}, {
		name: 'reason',
		description: 'The reason for the kick',
		type: ApplicationCommandOptionType.String,
		required: false
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
		const reason = interaction.options.getString('reason')
		const target = await guild.members.fetch(user)

		const embed = new EmbedBuilder()

		const isModerator = await moderatorCheck(target, guild)
		if (isModerator) {
			embed.setDescription("❌ | You cannot kick other moderators.").setColor(0xff0000)
			return interaction.reply({ embeds: [embed], ephemeral: true })
		}
		if (target.user.bot) {
			embed.setDescription("❌ | You cannot kick bots.").setColor(0xff0000)
			return interaction.reply({ embeds: [embed], ephemeral: true })
		}
		if (target == member) {
			embed.setDescription("❌ | You cannot kick yourself.").setColor(0xff0000)
			return interaction.reply({ embeds: [embed], ephemeral: true })
		}
		if (!target.kickable) {
			embed.setDescription("❌ | I am unable to timeout that user.").setColor(0xff0000)
			return interaction.reply({ embeds: [embed], ephemeral: true })
		}

		let responseMessage = `${target} (${target.user.tag}) has been kicked.`
		let dmMessage = `You have been kicked from **${guild.name}**.`
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

		target.kick(reason).then(async () => {
			await modlogsSchema.findOneAndUpdate({
				guildId: guild.id,
				userId: target.user.id
			}, {
				guildId: guild.id,
				userId: target.user.id,
				$push: {
					kicks: {
						moderator: member.id,
						timestamp: new Date(Date.now()),
						reason
					}
				}
			}, {
				upsert: true
			})
		})

		interaction.reply({ embeds: [responseEmbed], ephemeral: false })
	}
}