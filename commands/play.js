﻿const { RichEmbed } = require("discord.js");
const voiceUtil = require("../data/other/voiceUtil.js");

class play {
	static run(client, args) {
		const m = args.shift();
		if (!m.guild.voiceConnection) return m.channel.send("I'm not in a voice channel, silly!");

		if (!isNaN(parseInt(args[0]))) {
			if (m.guild.queue.length <= parseInt(args[0])) {
				return m.channel.send("This server's queue isn't that big!");
			} else {
				let next = m.guild.queue.splice(parseInt(args[0]) - 1, 1);
				m.guild.queueOut.splice(parseInt(args[0]) - 1, 1);
				return voiceUtil.playURL(next.url, next.requester, next.channel);
			}
		} else {
			return voiceUtil.playURL(args.join(" "), m.member, m.channel);
		}
	}

	static help() {
		return {
			category: "music",
			shortDesc: "Directly plays audio, skipping the queue",
			longDesc: "Directly plays an audio file or a YouTube video, skipping the queue. The queue will resume automatically.",
			syntax: "play <url to audio file or youtube video>"
		};
	}
}

module.exports = play;