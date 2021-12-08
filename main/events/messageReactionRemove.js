// ----------------------------------------------------------------
//                             Imports
// ----------------------------------------------------------------
import { MessageReaction, User, Permissions } from 'discord.js';
import Zen from '../Zen.js';

// ----------------------------------------------------------------
//                            Ready Event
// ----------------------------------------------------------------
export default class MessageReactionRemoveEvent {
	constructor(bot) {
		this.name = 'messageReactionRemove';
		/** @type {boolean} */
		this.once = false;
		/** @type {Zen} */
		this.bot = bot;
	}

	/**
	 *
	 * @param {MessageReaction} reaction
	 * @param {User} user
	 */
	execute = async (reaction, user) => {
		// Validation - Ready
		if (!this.bot.isReady()) return;

		try {
		} catch (e) {
			this.bot.logger.error(e);
			return;
		}
	};
}
