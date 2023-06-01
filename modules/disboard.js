const {
	Client,
	Events,
	PermissionsBitField,
	ActionRowBuilder,
	ModalBuilder,
	TextInputBuilder,
	TextInputStyle
} = require("discord.js")
const schedule = require("node-schedule")
const disboardSchema = require("../schemas/disboard-schema")
const bumpsSchema = require("../schemas/bumps-schema")

let disboardCache = {}

/**
 *
 * @param {string} guildId
 */
const fetchDisboardChannels = async (guildId) => {
	let query = {}

	if (guildId) query._id = guildId

	const results = await disboardSchema.find(query)

	for (const result of results) {
		const { _id, channelId, content } = result
		disboardCache[_id] = { channelId, content }
	}
}

/**
 *
 * @param {string} guildId
 */
const deleteCache = async (guildId) => {
	await disboardSchema.findOneAndDelete({ _id: guildId })
	await bumpsSchema.findOneAndDelete({ _id: guildId })

	delete disboardCache[guildId]

	const job = schedule.scheduledJobs[`${guildId}`]
	if (job) job.cancel()
}

/**
 *
 * @param {Client} client
 * @param {Array} bumps
 */
const loadBumps = async (client, bumps) => {
	for (let i = 0; i < bumps.length; i++) {
		let { _id: guildId, bumpTime } = bumps[i]
		const cache = disboardCache[guildId]
		schedule.scheduleJob(`bump ${guildId}`, bumpTime, async () => {
			const channel = client.channels.cache.get(cache.channelId)
			channel?.send(cache.content)
			await bumpsSchema.findOneAndDelete({ _id: guildId })
		})
	}
}

/**
 *
 * @param {Client} client
 */
module.exports = async (client) => {
	fetchDisboardChannels().then(async () => {
		const now = new Date()
		const bumps = await bumpsSchema.find({ bumpTime: { $gt: now } })
		await loadBumps(client, bumps)

		await bumpsSchema.deleteMany({ bumpTime: { $lt: now } })
	})

	client.on(Events.MessageCreate, async (message) => {
		const { guild, embeds, author } = message

		const cache = disboardCache[guild.id]
		if (author.id === "302050872383242240" && embeds[0].description.includes("Bump done!") && disboardCache[guild.id]) {
			const bumpTime = new Date(Date.now() + (1000 * 60 * 60 * 2))
			await bumpsSchema.findOneAndUpdate({
				_id: guild.id
			}, {
				_id: guild.id,
				bumpTime
			}, {
				upsert: true
			})

			schedule.scheduleJob(`bump ${guild.id}`, bumpTime, async () => {
				const channel = client.channels.cache.get(cache.channelId)
				channel?.send({ content: cache.content })

				await bumpsSchema.findOneAndDelete({ _id: guild.id })
			})
		}
	})

	client.on(Events.InteractionCreate, async (interaction) => {
		if (!(interaction.isModalSubmit() || interaction.isChannelSelectMenu() || interaction.isButton())) return
		if (!interaction.customId.startsWith("set-disboard")) return

		if (!interaction.member.permissions.has(PermissionsBitField.Flags.ManageGuild)) {
			return interaction.reply({
				content: "Only server managers can modify the Disboard module settings.",
				ephemeral: true
			})
		}

		if (interaction.isModalSubmit()) {
			const content = interaction.fields.getTextInputValue("set-disboard-message")

			const { id: _id } = interaction.guild
			const channelId = interaction.customId.split(" ")[1]

			await disboardSchema.findOneAndUpdate({
				_id
			}, {
				_id,
				channelId,
				content
			}, {
				upsert: true
			})

			fetchDisboardChannels(_id).then(() => {
				interaction.reply({
					content: `The Disboard reminder channel has been bound to <#${channelId}>.\n**NOTE:** The new message and channel location will take effect in the next bump.`
				})
			})
		} else if (interaction.isChannelSelectMenu()) {
			const query = await disboardSchema.findOne({ _id: interaction.guild.id })

			if (!query) {
				return interaction.reply({
					content: "This server does not have the Disboard module set up.",
					ephemeral: true
				})
			}

			const channelId = interaction.values[0]
			await disboardSchema.findOneAndUpdate({
				_id: interaction.guild.id
			}, {
				channelId
			})

			interaction.reply({
				content: `Successfully edited the Disboard reminder channel to <#${channelId}>.\n**NOTE:** The new channel location will take effect in the next bump.`
			})
		} else if (interaction.isButton()) {
			const query = await disboardSchema.findOne({ _id: interaction.guild.id })

			if (!query) {
				return interaction.reply({
					content: "This server does not have the Disboard module set up.",
					ephemeral: true
				})
			}

			const modal = new ModalBuilder()
				.setTitle("Change Disboard Reminder Message")
				.setCustomId(`set-disboard ${query.channelId}`)

			const text = new TextInputBuilder()
				.setLabel("Message")
				.setPlaceholder("Input the reminder message to be sent")
				.setCustomId("set-disboard-message")
				.setStyle(TextInputStyle.Paragraph)
				.setRequired(true)

			const actionRow = new ActionRowBuilder().addComponents(text)
			modal.addComponents(actionRow)

			await interaction.showModal(modal)
		}
	})
}

module.exports.fetchDisboardChannels = fetchDisboardChannels
module.exports.deleteCache = deleteCache
module.exports.loadBumps = loadBumps