﻿const fs = require("fs");
const nudes = fs.readFileSync("./data/sendnudes.txt", "utf8").split("\r\n");

class sendnudes {
	static run(client, args) {
		const m = args.shift();
		if (!(m.channel.nsfw || m.channel.name.toLowerCase().includes("nsfw"))) return m.channel.send("I can't do that here! Try again in an nsfw channel!");
		return m.channel.send("P-please don't stare...", {
			files: [nudes[Math.floor(Math.random() * nudes.length)]]
		});
	}
}

module.exports = sendnudes;