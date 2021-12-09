// ----------------------------------------------------------------
//                             Imports
// ----------------------------------------------------------------
import { SlashCommandBuilder } from '@discordjs/builders';
import { CommandInteraction, MessageEmbed, VoiceChannel } from 'discord.js';
import Zen from '../Zen.js';

/**
 * @class
 */
export default class Leave {
	/**
	 *
	 * @param {Zen} bot
	 */
	constructor(bot) {
		this.name = 'leave';
		this.description = 'Leave joined voice channel.';
		this.global = true;
		this.bot = bot;
		this.data = new SlashCommandBuilder()
			.setName(this.name)
			.setDescription(this.description);
	}

	/**
	 *
	 * @param {CommandInteraction} interaction
	 */
	execute = async interaction => {
		// Emit Reply
		await interaction.deferReply();

		// PLay music
		this.play(interaction);
	};

	/**
	 *
	 * @param {CommandInteraction} interaction
	 */
	async play(interaction) {
		const { channel, guild, member, options } = interaction;
		const vChannel = member.voice.channel;
		try {
		} catch (err) {
			const e = new MessageEmbed()
				.setTitle('Error')
				.setColor('RED')
				.setDescription(`An Error occured while trying to play the song.`);
			interaction.editReply({ embeds: [e] });
			this.bot.logger.error(err);
		}
	}
}
