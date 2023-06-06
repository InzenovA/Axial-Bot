const { ApplicationCommandOptionType, ChatInputCommandInteraction, EmbedBuilder } = require("discord.js")

module.exports = {
	name: "role-info",
	description: "Displays information of the specified role.",
	category: "Misc",
	expectedArgs: "<role>",
	dm_permission: false,
	options: [{
		name: "role",
		description: "The role you want to see the information of",
		type: ApplicationCommandOptionType.Role,
		required: true
	}],
	/**
	 *
	 * @param {{
	 * 	interaction: ChatInputCommandInteraction,
	 * }}
	 */
	callback: async ({ interaction, guild }) => {
		await guild.members.fetch()

		const role = interaction.options.getRole("role")
		const { name, id, createdTimestamp, hexColor, members, position, mentionable } = role

		const embed = new EmbedBuilder()
			.setTitle("Role Information")
			.setDescription(role.toString())
			.addFields({
				name: "Role Name",
				value: name
			}, {
				name: "Created",
				value: `<t:${parseInt(createdTimestamp / 1000)}:F>`
			}, {
				name: "Colour",
				value: hexColor,
				inline: true
			}, {
				name: "No. of Members",
				value: `${members.size}`,
				inline: true
			}, {
				name: "Position",
				value: `${position}`,
				inline: true
			}, {
				name: "Mentionable",
				value: mentionable ? "Yes" : "No"
			})
			.setFooter({ text: `Role ID: ${id}` })
			.setTimestamp()
			.setThumbnail(role.iconURL())
			.setColor(hexColor)

		interaction.reply({ embeds: [embed] })
	}
}