// ----------------------------------------------------------------
//                             Imports
// ----------------------------------------------------------------
import { SlashCommandBuilder } from '@discordjs/builders';
import { CommandInteraction, MessageEmbed } from 'discord.js';
import Zen from '../Zen.js';

/**
 * @class
 */
export default class Queue {
	/**
	 *
	 * @param {Zen} bot
	 */
	constructor(bot) {
		this.name = 'queue';
		this.description = 'Display and Control the Current Queue.';
		this.global = true;
		this.bot = bot;
		this.data = new SlashCommandBuilder()
			.setName(this.name)
			.setDescription(this.description)
			.addStringOption(str =>
				str
					.setName('task')
					.setDescription('Select a queue option/task.')
					.addChoice('clear', 'clear')
					.addChoice('list', 'list')
					.addChoice('pause', 'pause')
					.addChoice('resume', 'resume')
					.addChoice('skip', 'skip')
					.addChoice('stop', 'stop')
					.setRequired(true)
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
		this.queueHandler(interaction);
	};

	/**
	 *
	 * @param {CommandInteraction} interaction
	 */
	async queueHandler(interaction) {
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

		// Validation - Queue Exists
		const queue = this.bot.Distube.getQueue(vChannel);
		if (!queue) console.log(`Implement no queue.`);

		try {
			switch (options.getString('task')) {
				case 'clear':
					await queue.stop();
					return interaction.editReply(`Cleared Queue.`);
				case 'list':
					const list = queue.songs.map(
						(s, i) => `\n${i + 1}. ${s.name} - \`${s.formattedDuration}\``
					);
					const e = new MessageEmbed()
						.setTitle('Current Queue')
						.setDescription(`${list.slice(0, 1190)}`)
						.setColor('RANDOM')
						.setThumbnail(guild.me.avatarURL());
					return interaction.editReply({ embeds: [e] });
				case 'pause':
					queue.pause();
					return interaction.editReply('Paused Queue.');
				case 'resume':
					queue.resume();
					return interaction.editReply('RESUMED Playing.');
				case 'skip':
					await queue.skip();
					return interaction.editReply(`Skipped Song.`);
			}
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
