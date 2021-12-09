// ----------------------------------------------------------------
//                             Imports
// ----------------------------------------------------------------
import { SlashCommandBuilder } from '@discordjs/builders';
import { CommandInteraction, MessageEmbed, VoiceChannel } from 'discord.js';
import Zen from '../Zen.js';

/**
 * @class
 */
export default class Play {
	/**
	 *
	 * @param {Zen} bot
	 */
	constructor(bot) {
		this.name = 'play';
		this.description = 'Plays a provided song';
		this.global = true;
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
					.setName('source')
					.setDescription('Optioanlly Select a source you wish to play from.')
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
		const source = options.getString('source')
			? options.getString('source')
			: 'yt';
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

		try {
			const query = options.getString('song');
			this.bot.Distube.playVoiceChannel(vChannel, query, {
				textChannel: channel,
				member: member,
			});

			return interaction.editReply(`Playing ${query}`);
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
