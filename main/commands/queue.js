// ----------------------------------------------------------------
//                             Imports
// ----------------------------------------------------------------
import { SlashCommandBuilder } from '@discordjs/builders';
import { CommandInteraction, MessageEmbed } from 'discord.js';
import { Queue } from 'distube';
import { AudioCollectionPages } from '../utils/ui/Paginator.js';
import Zen from '../Zen.js';

/**
 * @class
 */
export default class QueueCommand {
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
			.addSubcommand(sub =>
				sub
					.setName('clear')
					.setDescription('Clears the queue and disconnects from voice.')
			)
			.addSubcommand(sub =>
				sub.setName('list').setDescription('Displays all queued audio tracks. ')
			)
			.addSubcommandGroup(group =>
				group
					.setName('skip')
					.setDescription('Skip around the queue.')
					.addSubcommand(sub =>
						sub.setName('next').setDescription('Go to next audio track.')
					)
					.addSubcommand(sub =>
						sub
							.setName('previous')
							.setDescription('Go to previous audio track.')
					)
					.addSubcommand(sub =>
						sub
							.setName('to')
							.setDescription('Go to a specific audio track.')
							.addIntegerOption(int =>
								int
									.setName('target')
									.setDescription('Selected track.')
									.setRequired(true)
							)
					)
			);
	}

	/**
	 *
	 * @param {CommandInteraction} interaction
	 */
	execute = async interaction => {
		// Defer Reply
		await interaction.deferReply();
		// Data Builder
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
				`Sorry. Please connect to <#${guild.me.voice.channelId}> to use me.`
			);
		// Validation - Queue Exists
		const queue = this.bot.Distube.getQueue(vChannel);
		if (!queue)
			return interaction.editReply(
				`There is currently no tracks in the queue.`
			);

		// Handle Types
		switch (interaction.options.getSubcommand()) {
			case 'clear':
				await this.clear(interaction, queue);
				return;
			case 'list':
				await this.list(interaction, queue);
				return;
			case 'next':
				await this.next(interaction, queue);
				return;
			case 'previous':
				await this.previous(interaction, queue);
				return;
			case 'to':
				await this.to(interaction, queue);
				return;
		}
	};

	/**
	 *
	 * @param {CommandInteraction} interaction
	 * @param {Queue} queue
	 */
	async clear(interaction, queue) {
		try {
			await queue.stop();
			const e = new MessageEmbed()
				.setTitle('Clear')
				.setDescription(
					`Cleared Queue and Disconnected from <#${interaction.channelId}>`
				)
				.setColor('RANDOM');

			return interaction.editReply({ embeds: [e] });
		} catch (err) {
			const e = new MessageEmbed()
				.setTitle('Error')
				.setDescription(`${err}`)
				.setColor('RED')
				.setThumbnail(this.bot.user.avatarURL());

			this.bot.logger.error(err);
			return interaction.editReply({ embeds: [e] });
		}
	}

	/**
	 *
	 * @param {CommandInteraction} interaction
	 * @param {Queue} queue
	 */
	async list(interaction, queue) {
		try {
			// Construct Data
			const np = queue.songs[0];
			const allSongs = [...queue.previousSongs, ...queue.songs];
			const data = allSongs.map((s, i) => {
				const idx = i + 1 < 10 ? `0${i + 1}` : `${i + 1}`;
				let str = '';
				let name =
					s.name.length < 30
						? `${s.name}${' '.repeat(30 - s.name.length)}`
						: s.name;

				if (np.id == s.id) {
					str += `${' '.repeat(5)} -----------\n`;
				}

				str += `${idx}. ${name.slice(0, 29)}`;
				str += `  ${s.formattedDuration} `;
				str += `- [${s.member.displayName.slice(0, 10)}]`;

				if (np.id == s.id) {
					str += `\n${' '.repeat(5)} -----------`;
				}

				return str;
			});

			// Construct Embed
			const e = new MessageEmbed().setTitle('Current Queue').setColor('RANDOM');
			// Get Paginator
			const paginator = new AudioCollectionPages('Current Queue', data, e);
			// Update with data
			e.setDescription(paginator._prepareData(1));

			await paginator.onInteraction(interaction);
			return interaction.editReply({
				embeds: [e],
				components: paginator.components,
			});
		} catch (err) {
			const e = new MessageEmbed()
				.setTitle('Error')
				.setDescription(`${err}`)
				.setColor('RED')
				.setThumbnail(this.bot.user.avatarURL());

			this.bot.logger.error(err);
			return interaction.editReply({ embeds: [e] });
		}
	}

	/**
	 *
	 * @param {CommandInteraction} interaction
	 * @param {Queue} queue
	 */
	async next(interaction, queue) {
		try {
			const e = new MessageEmbed()
				.setTitle()
				.setDescription()
				.setColor('RANDOM');

			return interaction.editReply({ embeds: [e] });
		} catch (err) {
			const e = new MessageEmbed()
				.setTitle('Error')
				.setDescription(`${err}`)
				.setColor('RED')
				.setThumbnail(this.bot.user.avatarURL());

			this.bot.logger.error(err);
			return interaction.editReply({ embeds: [e] });
		}
	}

	/**
	 *
	 * @param {CommandInteraction} interaction
	 * @param {Queue} queue
	 */
	async previous(interaction, queue) {
		try {
			const e = new MessageEmbed()
				.setTitle()
				.setDescription()
				.setColor('RANDOM');

			return interaction.editReply({ embeds: [e] });
		} catch (err) {
			const e = new MessageEmbed()
				.setTitle('Error')
				.setDescription(`${err}`)
				.setColor('RED')
				.setThumbnail(this.bot.user.avatarURL());

			this.bot.logger.error(err);
			return interaction.editReply({ embeds: [e] });
		}
	}

	/**
	 *
	 * @param {CommandInteraction} interaction
	 * @param {Queue} queue
	 */
	async to(interaction, queue) {
		try {
			const e = new MessageEmbed()
				.setTitle()
				.setDescription()
				.setColor('RANDOM');

			return interaction.editReply({ embeds: [e] });
		} catch (err) {
			const e = new MessageEmbed()
				.setTitle('Error')
				.setDescription(`${err}`)
				.setColor('RED')
				.setThumbnail(this.bot.user.avatarURL());

			this.bot.logger.error(err);
			return interaction.editReply({ embeds: [e] });
		}
	}

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
