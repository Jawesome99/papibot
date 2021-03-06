﻿class id {
	static run(client, args) {
		const m = args.shift();
		if (m.mentions.users.first()) {
			let mention = m.mentions.members.first();
			return m.channel.send(mention.displayName + "'s Discord ID is `" + mention.id + "`!");
		} else {
			return m.channel.send("Your Discord ID is `" + m.author.id + "`!");
		}
	}

	static help() {
		return {
			category: "technical",
			shortDesc: "Posts the Discord ID of a member",
			longDesc: "Posts the Discord ID of a member or yourself.",
			syntax: "id [mention]"
		};
	}
}

module.exports = id;