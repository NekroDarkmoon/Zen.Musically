// ----------------------------------------------------------------
//                             Imports
// ----------------------------------------------------------------
import { SlashCommandBuilder } from '@discordjs/builders';
import { ChannelType } from 'discord-api-types/v9';
import {
	CommandInteraction,
	MessageEmbed,
	Permissions,
	VoiceChannel,
} from 'discord.js';
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
				chn.setName('target').setDescription('Channel to join.');
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
		this.join(interaction);
	};

	/**
	 *
	 * @param {CommandInteraction} interaction
	 */
	async join(interaction) {
		const { channel, guild, member, options } = interaction;
		/** @type {VoiceChannel} */
		const vChannel = member.voice.channel || options.getChannel('target');
		const isAdmin = member.permissions.has(Permissions.FLAGS.ADMINISTRATOR);

		// Validation - Channel
		if (!vChannel)
			return interaction.editReply(
				`Please join a voice channel to be able to use music commands or specify a channel.`
			);
		// Validation - In an other channel
		if (vChannel?.id !== guild.me.voice.channelId && !isAdmin)
			return interaction.editReply(
				`Sorry. You must be in <#${guild.me.voice.channelId}> to use this command.`
			);

		try {
			this.bot.Distube.voices.join(vChannel);
			return interaction.editReply(`Joined <#${vChannel.id}>`);
		} catch (err) {
			const e = new MessageEmbed()
				.setTitle('Error')
				.setColor('RED')
				.setDescription(`An Error occured while trying to leave - ${err}.`);
			interaction.editReply({ embeds: [e] });
			this.bot.logger.error(err);
		}
	}
}
