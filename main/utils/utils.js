// ----------------------------------------------------------------
//                             Imports
// ----------------------------------------------------------------
import Zen from '../Zen.js';

// ----------------------------------------------------------------
//                           Chunk Strings
// ----------------------------------------------------------------
/**
 *
 * @param {String} str
 * @param {Number} chunkSize
 * @returns {Array<String>} chunks
 */
export function chunkify(str, chunkSize) {
	const numChunks = Math.ceil(str.length / chunkSize);
	const chunks = new Array(numChunks);

	for (let i = 0, o = 0; i < numChunks; ++i, o += chunkSize) {
		chunks[i] = str.substr(o, chunkSize);
	}

	return chunks;
}

// ----------------------------------------------------------------
//                         Sanitize String
// ----------------------------------------------------------------
/**
 *
 * @param {String} str
 * @returns {String} str
 */
export function msgSanatize(str) {
	return str.replaceAll('@', '@\u200b');
}

// ----------------------------------------------------------------
//                         Export Cachers
// ----------------------------------------------------------------
export const caches = {};

// ----------------------------------------------------------------
//                             Imports
// ----------------------------------------------------------------
// ----------------------------------------------------------------
//                             Imports
// ----------------------------------------------------------------
