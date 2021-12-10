// ----------------------------------------------------------------
//                             Imports
// ----------------------------------------------------------------
import { SlashCommandBuilder } from '@discordjs/builders';
import { CommandInteraction, MessageEmbed } from 'discord.js';
import Zen from '../Zen.js';

/**
 * @class
 */
export default class Loop {
	/**
	 *
	 * @param {Zen} bot
	 */
	constructor(bot) {
		this.name = 'loop';
		this.description = 'Loops a track or queue.';
		this.global = true;
		this.bot = bot;
		this.data = new SlashCommandBuilder()
			.setName(this.name)
			.setDescription(this.description)
			.addIntegerOption(int =>
				int
					.setName('mode')
					.setDescription('Type of loop.')
					.setRequired(true)
					.addChoice('Disabled', 0)
					.addChoice('Song', 1)
					.addChoice('Queue', 2)
			);
	}

	/**
	 *
	 * @param {CommandInteraction} interaction
	 */
	execute = async interaction => {
		// Emit Reply
		await interaction.deferReply();

		// PLay music
		this.loop(interaction);
	};

	/**
	 *
	 * @param {CommandInteraction} interaction
	 */
	async loop(interaction) {
		const { channel, guild, member, options } = interaction;
		const vChannel = member.voice.channel;
		const mode = options.getInteger('mode');

		// Validation - Channel
		if (!vChannel)
			return interaction.editReply(
				`Please join a voice channel to be able to use music commands.`
			);
		// Validation - Already In A Channel
		if (guild.me.voice.channelId && vChannel.id !== guild.me.voice.channelId)
			return interaction.editReply(
				`Sorry. I'm already connected to <#${guild.me.voice.channelId}>.`
			);

		const queue = this.bot.Distube.getQueue(vChannel);
		if (!queue)
			return interaction.editReply(`There are no tracks in the queue.`);

		try {
			const setMode = queue.setRepeatMode(mode);
			const data = { 0: 'DISABLED', 1: 'SONG', 2: 'QUEUE' };

			return interaction.editReply(`Repeat Mode set to \`${data[setMode]}\``);
		} catch (err) {
			const e = new MessageEmbed()
				.setTitle('Error')
				.setColor('RED')
				.setDescription(`An Error occured while trying to pause the track.`);
			interaction.editReply({ embeds: [e] });
			this.bot.logger.error(err);
		}
	}
}
