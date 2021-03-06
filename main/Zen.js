// ----------------------------------------------------------------
//                             Imports
// ----------------------------------------------------------------
import { Client, GuildMember, Intents } from 'discord.js';

import { DisTube } from 'distube';
import { YtDlpPlugin } from '@distube/yt-dlp';
import { SpotifyPlugin } from '@distube/spotify';
import { SoundCloudPlugin } from '@distube/soundcloud';

import CommandHandler from './structures/CommandHandler.js';
import EventHandler from './structures/EventHandler.js';
import winston from 'winston';

// ----------------------------------------------------------------
//                             Zen
// ----------------------------------------------------------------
/**
 * Main class for Zen
 * @class Zen
 */
export default class Zen extends Client {
	/**
	 * @param {import('./structures/typedefs.js').ZenConfig} config
	 * @param {winston.Logger} logger
	 */
	constructor(config, logger) {
		// Init Client with intents and partials
		super({
			intents: 1153,
			partials: ['CHANNEL', 'REACTION', 'GUILD_MEMBER'],
		});

		/** @type {import('./structures/typedefs.js').ZenConfig} */
		this.config = config;

		/** @type {winston.Logger} */
		this.logger = logger;

		/** @type {CommandHandler} */
		this.CommandHandler = new CommandHandler(this);

		/** @type {EventHandler} */
		this.EventHandler = new EventHandler(this);

		this.Distube = new DisTube(this, {
			searchSongs: 10,
			leaveOnEmpty: true,
			leaveOnFinish: true,
			leaveOnStop: true,
			nsfw: true,
			plugins: [new SpotifyPlugin(), new SoundCloudPlugin(), new YtDlpPlugin()],
			youtubeCookie: this.config.ytCookie,
			youtubeDL: false,
		});

		// Miscellaneous
		/**@type {import('./structures/typedefs.js').ZenCache} */
		this.caches = {};
		this._started = false;
		this._exited = false;
	}

	/**
	 * @returns {Promise<void>}
	 * @memberof Zen
	 */
	async start() {
		if (this._started) return;
		this._started = true;

		// Check Token
		if (!this.config.token) throw new Error('No discord token provided');

		// Setup event listeners
		await this.EventHandler.loadEvents(this);

		// Setup commands & interactions
		await this.CommandHandler.loadCommands();
		try {
			if (this.config.deploySlash) await this.CommandHandler.registerCommands();
		} catch (e) {
			this.logger.error(e);
		}

		// Set token
		this.login(this.config.token);
		this.setMaxListeners(20);

		// Cache Builder
		await this.buildCaches();
	}

	/**
	 *
	 * @param {object} data
	 * @returns {boolean}
	 * @memberof Zen
	 */
	async fetchPartial(data) {
		if (data.partial) {
			try {
				await data.fetch();
			} catch (err) {
				console.error(
					`Something went wrong when fetching partial ${data.id}: `,
					error
				);
				return false;
			}
		}
		return true;
	}

	async buildCaches() {
		setTimeout(async () => {
			console.log(this.caches);
		}, 1500);
	}

	/**
	 *
	 * @param {Number} userId
	 * @param {Number} guildId
	 * @returns {GuildMember}
	 */
	async _getOrFetchMembers(userId, guildId) {
		const guild = this.guilds.cache.get(guildId);
		const member = guild.members.cache.get(userId);
		if (member) return member;

		// Fetch
		try {
			const member = await guild.members.fetch(userId);
			return member;
		} catch (e) {
			this.logger.error(e);
			return null;
		}
	}

	onClose() {
		if (this._exited) return;
		this._exited = true;
		this.logger.warn('Shutting down.');

		this.destroy();
		this.logger.warn('Client Disconnected');

		// Close logger
		this.logger.warn('Logger streams closed');
		this.logger.close();

		process.exit();
	}
}
