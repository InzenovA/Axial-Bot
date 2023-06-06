/**
 *
 * @param {number} num1
 * @param {String} type
 * @param {number} num2
 * @returns
 */
module.exports = (num1, type, num2) => {
	switch (type) {
		case "+":
			return num1 + num2
		case "-":
			return num1 - num2
		case "*":
			return num1 * num2
		case "/":
			return num1 / num2
		case "^":
			return num1 ** num2
		default:
			return "**An error has occured!**"
	}
}