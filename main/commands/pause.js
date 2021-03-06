// ----------------------------------------------------------------
//                             Imports
// ----------------------------------------------------------------
import { SlashCommandBuilder } from '@discordjs/builders';
import { CommandInteraction, MessageEmbed } from 'discord.js';
import Zen from '../Zen.js';

/**
 * @class
 */
export default class Pause {
	/**
	 *
	 * @param {Zen} bot
	 */
	constructor(bot) {
		this.name = 'pause';
		this.description = 'Pauses the music player';
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
		this.pause(interaction);
	};

	/**
	 *
	 * @param {CommandInteraction} interaction
	 */
	async pause(interaction) {
		const { channel, guild, member, options } = interaction;
		const vChannel = member.voice.channel;

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
			queue.pause();
			return interaction.editReply(`Playing Paused.`);
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
