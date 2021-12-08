// ----------------------------------------------------------------
//                             Imports
// ----------------------------------------------------------------
import { SlashCommandBuilder } from '@discordjs/builders';
import { CommandInteraction, MessageEmbed } from 'discord.js';

/**
 * @class
 */
export default class Play {
	constructor(bot) {
		this.name = 'play';
		this.description = 'Plays a provided song';
		this.global = false;
		this.bot = bot;
		this.data = new SlashCommandBuilder()
			.setName(this.name)
			.setDescription(this.description)
			.addStringOption(str =>
				str
					.setName('song')
					.setDescription('Title or link of song.')
					.setRequired(true)
			)
			.addStringOption(str =>
				str
					.setName('')
					.setDescription('')
					.addChoice('Youtube', 'yt')
					.addChoice('Spotify', 'sp')
					.addChoice('SoundCloud', 'sc')
			);
	}

	/**
	 *
	 * @param {CommandInteraction} interaction
	 */
	execute = async interaction => {
		// Emit Reply
		await interaction.deferReply();

		//
	};
}
