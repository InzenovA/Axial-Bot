const { ApplicationCommandOptionType, ChatInputCommandInteraction } = require('discord.js')
const calculate = require('../../functions/calculate')

module.exports = {
	name: 'math',
	description: 'Does basic math calculations.',
	category: 'fun',
	expectedArgs: '<num1> <operation> <num2>',
	options: [{
		name: 'num1',
		description: 'The first number',
		type: ApplicationCommandOptionType.Integer,
		required: true
	}, {
		name: 'operation',
		description: 'The operation to do on the numbers',
		type: ApplicationCommandOptionType.String,
		required: true,
		choices: [{
			name: '+',
			value: '+'
		}, {
			name: '-',
			value: '-'
		}, {
			name: '*',
			value: '*'
		}, {
			name: '/',
			value: '/'
		}, {
			name: '^',
			value: '^'
		}]
	}, {
		name: 'num2',
		description: 'The second number',
		type: ApplicationCommandOptionType.Integer,
		required: true
	}],
	/**
	 * 
	 * @param {{
	 * 	interaction: ChatInputCommandInteraction
	 * }}
	 */
	callback: async ({ interaction }) => {
		const num1 = interaction.options.getInteger('num1')
		const num2 = interaction.options.getInteger('num2')
		const operation = interaction.options.getString('operation')
		
		interaction.reply({ 
			content: `${num1} ${operation} ${num2} = ${calculate(num1, operation, num2).toString()}`
		})
	}
}