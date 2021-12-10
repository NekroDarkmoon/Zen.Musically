// ----------------------------------------------------------------
//                             Imports
// ----------------------------------------------------------------
import { SlashCommandBuilder } from '@discordjs/builders';
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
		this.leave(interaction);
	};

	/**
	 *
	 * @param {CommandInteraction} interaction
	 */
	async leave(interaction) {
		const { channel, guild, member, options } = interaction;
		/** @type {VoiceChannel} */
		const vChannel = member.voice.channel;
		const isAdmin = member.permissions.has(Permissions.FLAGS.ADMINISTRATOR);

		// Validation - Channel
		if (!vChannel)
			return interaction.editReply(
				`Please join a voice channel to be able to use music commands.`
			);

		// Validation - Not In A Channel
		if (!guild.me.voice.channel)
			return interaction.reply(`Error: Not connected to a voice channel.`);
		// Validation - In an other channel
		if (vChannel?.id !== guild.me.voice.channelId && !isAdmin)
			return interaction.editReply(
				`Sorry. You must be in <#${guild.me.voice.channelId}> to use this command.`
			);

		try {
			if (this.bot.Distube.getQueue(vChannel)) this.bot.Distube.stop(vChannel);
			else this.bot.Distube.voices.leave(guild.id);
			return interaction.editReply(`Left Voice Channel.`);
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
