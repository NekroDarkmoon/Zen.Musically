// ----------------------------------------------------------------
//                             Imports
// ----------------------------------------------------------------
import { MessageReaction, Permissions, User } from 'discord.js';
import Zen from '../Zen.js';

// ----------------------------------------------------------------
//                            Ready Event
// ----------------------------------------------------------------
export default class MessageReactionAddEvent {
	constructor(bot) {
		this.name = 'messageReactionAdd';
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
