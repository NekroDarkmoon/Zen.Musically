// ----------------------------------------------------------------
//                             Imports
// ----------------------------------------------------------------
import { Guild } from 'discord.js';
import Zen from '../Zen.js';

// ----------------------------------------------------------------
//                            Ready Event
// ----------------------------------------------------------------
export default class GuildCreateEvent {
	constructor(bot) {
		this.name = 'guildCreate';
		/** @type {boolean} */
		this.once = false;
		/** @type {Zen} */
		this.bot = bot;
	}

	/**
	 * @param {Guild} guild
	 * @returns {Promise<void>}
	 */
	execute = async guild => {
		// Validation - Ready
		if (!this.bot.isReady()) return;
		// Validation - Guild Count
		if (this.bot.guilds.cache.size > 73) {
			await guild.leave();
			this.bot.logger.warn(`73 Guilds Limit reached - Left ${guild.name}.`);
		}

		this.bot.logger.debug(`Joined a new guild - ${guild.name}`);

		// Rebuild Cache
		await this.bot.buildCaches();

		// Rebuild Slash Perms
		this.bot.CommandHandler.setGlobalSlashPerms();
	};
}
