// ----------------------------------------------------------------
//                             Imports
// ----------------------------------------------------------------
import { SlashCommandBuilder } from '@discordjs/builders';
import { CommandInteraction, MessageEmbed } from 'discord.js';
import Zen from '../Zen.js';

/**
 * @class
 */
export default class Resume {
	/**
	 *
	 * @param {Zen} bot
	 */
	constructor(bot) {
		this.name = 'resume';
		this.description = 'Resumes the music player';
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
		this.resume(interaction);
	};

	/**
	 *
	 * @param {CommandInteraction} interaction
	 */
	async resume(interaction) {
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
			queue.resume();
			return interaction.editReply(`Resumed Playing.`);
		} catch (err) {
			const e = new MessageEmbed()
				.setTitle('Error')
				.setColor('RED')
				.setDescription(`An Error occured while trying to resume the queue.`);
			interaction.editReply({ embeds: [e] });
			this.bot.logger.error(err);
		}
	}
}
