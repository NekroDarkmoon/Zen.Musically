// ----------------------------------------------------------------
//                             Imports
// ----------------------------------------------------------------
import { SlashCommandBuilder } from '@discordjs/builders';
import { ChannelType } from 'discord-api-types/v9';
import { CommandInteraction, MessageEmbed, VoiceChannel } from 'discord.js';
import Zen from '../Zen.js';

/**
 * @class
 */
export default class Join {
	/**
	 *
	 * @param {Zen} bot
	 */
	constructor(bot) {
		this.name = 'join';
		this.description = 'Join a voice channel.';
		this.global = true;
		this.bot = bot;
		this.data = new SlashCommandBuilder()
			.setName(this.name)
			.setDescription(this.description)
			.addChannelOption(chn => {
				chn.setName('channel').setDescription('Selected channel to play in.');
				chn.channelTypes = [ChannelType.GuildVoice];
				return chn;
			});
	}

	/**
	 *
	 * @param {CommandInteraction} interaction
	 */
	execute = async interaction => {
		// Emit Reply
		await interaction.deferReply();

		// PLay music
		this.join(interaction);
	};

	/**
	 *
	 * @param {CommandInteraction} interaction
	 */
	async join(interaction) {
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

		try {
			// this.bot.Distube.play('Join');
			return interaction.editReply('Not Implemented.');
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
