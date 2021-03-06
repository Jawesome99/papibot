﻿class leave {
	static run(client, args) {
		const m = args.shift();
		if (!m.guild.voiceConnection) return m.channel.send("I'm not in any voice channel, silly!");
		if (m.guild.queue) m.guild.queue = null;
		if (m.guild.queueOut) m.guild.queueOut = null;
		let channelName = m.guild.me.voiceChannel.name;
		m.guild.me.voiceChannel.leave();
		return m.channel.send("Left " + channelName + "!");
	}

	static help() {
		return {
			category: "music",
			shortDesc: "Leaves the current voice channel",
			longDesc: "Leaves the voice channel, if Papi-Bot is in any on this server.",
			syntax: "leave"
		};
	}
}

module.exports = leave;