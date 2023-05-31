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

	const split = value.match(/^(-?(?:\d+)?\.?\d+) *(milliseconds?|msecs?|ms|seconds?|secs?|s|minutes?|mins?|m|hours?|hrs?|h|days?|d|weeks?|w|years?|yrs?|y)?$/i)
	let duration = parseInt(split[0])
	let type = split[1]?.toLowerCase() || "s"

	switch (type) {
	case "years":
	case "year":
	case "yrs":
	case "yr":
	case "y":
		return duration * y
	case "weeks":
	case "week":
	case "w":
		return duration * w
	case "days":
	case "day":
	case "d":
		return duration * d
	case "hours":
	case "hour":
	case "hrs":
	case "hr":
	case "h":
		return duration * h
	case "minutes":
	case "minute":
	case "mins":
	case "min":
	case "m":
		return duration * m
	case "seconds":
	case "second":
	case "secs":
	case "sec":
	case "s":
		return duration * s
	case "milliseconds":
	case "millisecond":
	case "msecs":
	case "msec":
	case "ms":
		return duration * ms
	default:
		return null
	}
}