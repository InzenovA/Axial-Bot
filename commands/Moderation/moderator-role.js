const { PermissionsBitField, ApplicationCommandOptionType, ChatInputCommandInteraction, Guild, EmbedBuilder } = require('discord.js')
const moderatorRole = require('../../schemas/moderator-role-schema')

module.exports = {
	name: 'moderator-role',
	description: 'Set roles that prevent members with the roles from being moderated.',
	category: 'Moderation',
	expectedArgs: '<add/remove/list> <role>',
	defaultMemberPermissions: PermissionsBitField.Flags.ManageGuild,
	dm_permission: false,
	options: [{
		name: 'add',
		description: 'Add a moderator role.',
		type: ApplicationCommandOptionType.Subcommand,
		options: [{
			name: 'role',
			description: 'The role to add as a moderator role',
			type: ApplicationCommandOptionType.Role,
			required: true
		}]
	}, {
		name: 'remove',
		description: 'Remove the moderator role.',
		type: ApplicationCommandOptionType.Subcommand,
		options: [{
			name: 'role',
			description: 'The role to remove as a moderator role',
			type: ApplicationCommandOptionType.Role,
			required: true
		}]
	}, {
		name: 'list',
		description: 'List all the moderator roles.',
		type: ApplicationCommandOptionType.Subcommand,
	}],
	/**
	 * 
	 * @param {{
	 * 	interaction: ChatInputCommandInteraction,
	 * 	guild: Guild
	 * }}
	 */
	callback: async ({ interaction, guild }) => {
		const command = interaction.options.getSubcommand()
		const modRole = interaction.options.getRole('role')

		const query = await moderatorRole.findOne({ _id: guild.id })
		const embed = new EmbedBuilder()

		switch (command) {
			case "add":
				if (query? query.length > 0: false) {
					roleId = query.roleId

					if (roleId.includes(modRole.id)) {
						embed.setDescription(`❌ The role <@&${modRole.id}> has already been added as a moderator role.`).setColor(0xff0000)
						return interaction.reply({ embeds: [embed] })
					}
				}

				await moderatorRole.findOneAndUpdate({
					_id: guild.id
				}, {
					_id: guild.id,
					$push: {
						roleId: modRole.id
					}
				}, {
					upsert: true
				})

				embed.setDescription(`✅ The role <@&${modRole.id}> has now been added as a moderator role.`).setColor(0x00ff00)
				interaction.reply({ embeds: [embed] })
				break
			case "remove":
				if (query? query.length <= 0: true) {
					embed.setDescription(`❌ There are no roles set as a moderator role in this server.`).setColor(0xff0000)
					return interaction.reply({ embeds: [embed] })
				}

				roleId = query.roleId
				if (!roleId.includes(modRole.id)) {
					embed.setDescription(`❌ The role <@&${modRole.id}> is not already included as a moderator role.`).setColor(0xff0000)
					return interaction.reply({ embeds: [embed] })
				}

				const index = roleId.indexOf(modRole.id)
				roleId.splice(index, 1)

				if (roleId.length == 0) await moderatorRole.findOneAndDelete({ _id: guild.id })
				else {
					await moderatorRole.findOneAndUpdate({
						_id: guild.id
					}, {
						_id: guild.id,
						roleId
					}, {
						upsert: true
					})
				}

				embed.setDescription(`✅ The role <@&${modRole.id}> has now been removed from the moderator roles.`).setColor(0x00ff00)

				interaction.reply({ embeds: [embed], })
				break
			case "list":
				if (query? query.length <= 0: true) {
					embed 
						.setDescription(`❌ There are no roles set as a moderator role in this server.`)
						.setColor(0xff0000)
					return interaction.reply({ embeds: [embed] })
				}

				roleId = query.roleId

				let roles = ''
				for (role in roleId) {
					roles += `<@&${roleId[role]}>, `
				}
				roles = roles.slice(0, -2)

				embed.setTitle("List of moderator roles").setDescription(roles).setColor(0x40C0E7)
				interaction.reply({ embeds: [embed] })
		}
	}
}    