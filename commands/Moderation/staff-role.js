const { PermissionsBitField, ApplicationCommandOptionType, ChatInputCommandInteraction, Guild, EmbedBuilder } = require("discord.js")
const staffRole = require("../../schemas/staff-role-schema")

module.exports = {
	name: "staff-role",
	description: "Set roles that prevent members with them from being moderated.",
	category: "Moderation",
	expectedArgs: "<add/remove/list> <role>",
	defaultMemberPermissions: PermissionsBitField.Flags.ManageGuild,
	dm_permission: false,
	options: [{
		name: "add",
		description: "Add a staff role.",
		type: ApplicationCommandOptionType.Subcommand,
		options: [{
			name: "role",
			description: "The role to add as a staff role",
			type: ApplicationCommandOptionType.Role,
			required: true
		}]
	}, {
		name: "remove",
		description: "Remove a staff role.",
		type: ApplicationCommandOptionType.Subcommand,
		options: [{
			name: "role",
			description: "The role to remove as a staff role",
			type: ApplicationCommandOptionType.Role,
			required: true
		}]
	}, {
		name: "list",
		description: "List all the staff roles.",
		type: ApplicationCommandOptionType.Subcommand
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
		const modRole = interaction.options.getRole("role")

		const query = await staffRole.findOne({ _id: guild.id })
		const embed = new EmbedBuilder()

		switch (command) {
			case "add":
				if (query ? query.length > 0 : false) {
					const roleId = query.roleId

					if (roleId.includes(modRole.id)) {
						embed.setDescription(`❌ The role <@&${modRole.id}> has already been added as a staff role.`).setColor(0xff0000)
						return interaction.reply({ embeds: [embed] })
					}
				}

				await staffRole.findOneAndUpdate({
					_id: guild.id
				}, {
					_id: guild.id,
					$push: {
						roleId: modRole.id
					}
				}, {
					upsert: true
				})

				embed.setDescription(`✅ The role <@&${modRole.id}> has now been added as a staff role.`).setColor(0x00ff00)
				interaction.reply({ embeds: [embed] })
				break
			case "remove":
				if (query ? query.length <= 0 : true) {
					embed.setDescription("❌ There are no roles set as a staff role in this server.").setColor(0xff0000)
					return interaction.reply({ embeds: [embed] })
				}

				var roleId = query.roleId
				if (!roleId.includes(modRole.id)) {
					embed.setDescription(`❌ The role <@&${modRole.id}> is not already included as a staff role.`).setColor(0xff0000)
					return interaction.reply({ embeds: [embed] })
				}

				roleId.pop(modRole.id)

				if (roleId.length == 0) await staffRole.findOneAndDelete({ _id: guild.id })
				else {
					await staffRole.findOneAndUpdate({
						_id: guild.id
					}, {
						_id: guild.id,
						roleId
					}, {
						upsert: true
					})
				}

				embed.setDescription(`✅ The role <@&${modRole.id}> has now been removed from the staff roles.`).setColor(0x00ff00)

				interaction.reply({ embeds: [embed] })
				break
			case "list":
				if (query ? query.length <= 0 : true) {
					embed
						.setDescription("❌ There are no roles set as a staff role in this server.")
						.setColor(0xff0000)
					return interaction.reply({ embeds: [embed] })
				}

				roleId = query.roleId

				var roles = ""
				for (const role in roleId) {
					roles += `<@&${roleId[role]}>, `
				}
				roles = roles.slice(0, -2)

				embed.setTitle("List of staff roles").setDescription(roles).setColor(0x40C0E7)
				interaction.reply({ embeds: [embed] })
		}
	}
}