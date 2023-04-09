/**
 * 
 * @param {String} strDate 
 * @returns 
 */
module.exports = (strDate) => {
	const datum = Date.parse(strDate) / 1000
	return datum
}