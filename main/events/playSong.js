// ----------------------------------------------------------------
//                             Imports
// ----------------------------------------------------------------
import { MessageEmbed } from 'discord.js';
import { Queue, Song } from 'distube';
import Zen from '../Zen.js';

// ----------------------------------------------------------------
//                            Ready Event
// ----------------------------------------------------------------
export default class PlaySongEvent {
	constructor(bot) {
		this.name = 'playSong';
		/** @type {boolean} */
		this.once = false;
		/** @type {Zen} */
		this.bot = bot;
		this.distube = true;
	}

	/**
	 *
	 * @param {Queue} queue
	 * @param {Song} song
	 */
	execute = async (queue, song) => {
		const e = new MessageEmbed()
			.setTitle('Now Playing')
			.setDescription(`[${song.name}](${song.url})\n[ <@${song.member.id}> ]`)
			.setColor('RANDOM')
			.setThumbnail(`${song.thumbnail}`);

		queue.textChannel.send({ embeds: [e] });
	};
}
