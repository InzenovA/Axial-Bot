const {
	PermissionsBitField,
	ChatInputCommandInteraction,
	Guild,
	GuildMember,
	ChannelType,
	ButtonStyle,
	EmbedBuilder,
	ActionRowBuilder,
	ButtonBuilder,
	ChannelSelectMenuBuilder
} = require("discord.js")
const disboardSchema = require("../../schemas/disboard-schema")
const bumpsSchema = require("../../schemas/bumps-schema")

module.exports = {
	name: "disboard-info",
	description: "Shows information about the Disboard module.",
	category: "Disboard",
	botPermissions: [PermissionsBitField.Flags.SendMessages],
	dmPermission: false,
	/**
	 *
	 * @param {{
	 * 	interaction: ChatInputCommandInteraction,
	 * 	guild: Guild,
	 * 	member: GuildMember
	 * }}
	 */
	callback: async ({ interaction, guild, member }) => {
		const query = await disboardSchema.findOne({ _id: guild.id })

		if (!query) {
			return interaction.reply({
				content: "This server does not have the Disboard module enabled.",
				ephemeral: true
			})
		}

		const bump = await bumpsSchema.findOne({ _id: guild.id })
		const bumpTime = bump?.bumpTime

		let status
		if (!bumpTime) {
			status = "Not bumped yet."
		} else {
			status = `Bumped!\nNext bump <t:${Math.floor(new Date(bumpTime).getTime() / 1000)}:R>`
		}

		const embed = new EmbedBuilder()
			.setTitle("Disboard module information")
			.setFields({
				name: "Status",
				value: status
			}, {
				name: "Channel",
				value: `<#${query.channelId}>`
			})
			.setColor(0xffffff)
			.setTimestamp()

		const selectMenu = new ActionRowBuilder()
			.addComponents(
				new ChannelSelectMenuBuilder()
					.setCustomId("set-disboard-channel")
					.setPlaceholder("Select a channel to change to")
					.setChannelTypes([ChannelType.GuildText])
					.setMinValues(1)
					.setMaxValues(1)
					.setDisabled(!member.permissions.has(PermissionsBitField.Flags.ManageGuild))
			)

		const button = new ActionRowBuilder()
			.addComponents(new ButtonBuilder()
				.setLabel("Edit Disboard Message")
				.setCustomId("set-disboard-edit-message")
				.setStyle(ButtonStyle.Primary)
				.setDisabled(!member.permissions.has(PermissionsBitField.Flags.ManageGuild))
			)

		interaction.reply({
			embeds: [embed],
			components: [selectMenu, button]
		})
	}
}