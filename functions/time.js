/**
 * 
 * @param {String} value 
 * @returns 
 */
module.exports = (value) => {
	const ms = 1
	const s = ms * 1000
	const m = s * 60
	const h = m * 60
	const d = h * 24
	const w = d * 7
	const y = d * 365

	const split = value.match(/\d+|\D+/g)
	let duration = parseInt(split[0])
	let type = split[1]?.toLowerCase() || 's'

	if (type == 'ms') return duration * ms
	else if (type == 's') return duration * s
	else if (type == 'm') return duration * m
	else if (type == 'h') return duration * h
	else if (type == 'd') return duration * d
	else if (type == 'w') return duration * w
	else if (type == 'y') return duration * y
	else return null
}