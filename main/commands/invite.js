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
export default class Invite {
	/**
	 *
	 * @param {Zen} bot
	 */
	constructor(bot) {
		this.name = 'invite';
		this.description = 'Sends an invite for the bot.';
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
		const member = interaction.user;
		const link = this.bot.config.inviteLink;

		try {
			await member.send(link);
			return interaction.reply({ content: 'Sent an invite link to your DM.' });
		} catch (e) {
			this.bot.logger.error();
			return interaction.reply({
				content: 'An error occured while sending an invite',
				ephemeral: true,
			});
		}
	};
}
