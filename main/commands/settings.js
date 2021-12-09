// ----------------------------------------------------------------
//                             Imports
// ----------------------------------------------------------------
import { SlashCommandBuilder } from '@discordjs/builders';
import { CommandInteraction, MessageEmbed } from 'discord.js';
import Zen from '../Zen.js';

/**
 * @class
 */
export default class Settings {
	/**
	 *
	 * @param {Zen} bot
	 */
	constructor(bot) {
		this.name = 'settings';
		this.description = 'Zen.Musically Settings.';
		this.global = true;
		this.bot = bot;
		this.data = new SlashCommandBuilder()
			.setName(this.name)
			.setDescription(this.description)
			.addSubcommand(sub =>
				sub
					.setName('volume')
					.setDescription('Change the volume of the bot.')
					.addIntegerOption(int =>
						int
							.setName('percent')
							.setDescription('Target Volume')
							.setRequired(true)
					)
			);
	}

	/**
	 *
	 * @param {CommandInteraction} interaction
	 */
	execute = async interaction => {
		// Emit Reply
		await interaction.deferReply();

		switch (interaction.options.getSubcommand()) {
			case 'volume':
				this.changeVolume(interaction);
				return;
		}
	};

	/**
	 *
	 * @param {CommandInteraction} interaction
	 */
	async changeVolume(interaction) {
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
			// Logic volume
			let vol = options.getInteger('percent');
			if (vol > 100) vol = 100;
			if (vol < 1) vol = 1;

			// Change Volume
			this.bot.Distube.setVolume(vChannel, vol);
			const e = new MessageEmbed()
				.setTitle('Volume Changed')
				.setDescription(`Volume now set to ${vol}.`)
				.setColor('RANDOM')
				.setThumbnail(guild.me.avatarURL());

			return interaction.editReply({ embeds: [e] });
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
