// ----------------------------------------------------------------
//                             Imports
// ----------------------------------------------------------------
import { MessageEmbed } from 'discord.js';
import { Queue, Song } from 'distube';
import Zen from '../Zen.js';

// ----------------------------------------------------------------
//                            Ready Event
// ----------------------------------------------------------------
export default class AddSongEvent {
	constructor(bot) {
		this.name = 'addSong';
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
		// Validation - Queue Length
		if (queue.songs.length < 2) return;

		const e = new MessageEmbed()
			.setDescription(`Queued ${song.name}\n[ <@${song.member.id}> ]`)
			.setColor('RANDOM')
			.setThumbnail(`${song.thumbnail}`);

		queue.textChannel.send({ embeds: [e] });
	};
}
