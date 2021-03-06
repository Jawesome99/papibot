// Rule34 has no tag limit

const Kaori = require("kaori");
const kaori = new Kaori();
const util = require("../data/other/kaoriUtil.js");
const { RichEmbed } = require("discord.js");

class rule34 {
	static run(client, args) {
		let m = args.shift();
		if (!client.checkNsfw(m.channel)) return m.channel.send("I can't do that here! Try again in an nsfw channel!");
		if (!args) return m.channel.send("You need to specify at least one tag! Tags are seperated by spaces!");
		return m.channel.send("Taking a look...").then(async msg => {
			let uBlacklist = util.unNegateTags(await client.db.get("blacklists", m.author.id));
			let sBlacklist = util.unNegateTags(await client.db.get("blacklists", m.guild.id));
			for (let i in args) {
				if (uBlacklist.includes(args[i])) return msg.edit("The tag `" + args[i] + "` conflicts with your blacklist settings!");
				if (sBlacklist.includes(args[i])) return msg.edit("Tag tag `" + args[i] + "` conflicts with this server's blacklist settings!");
			}
			return kaori.search("rule34", { tags: args.concat(util.negateTags(uBlacklist), util.negateTags(sBlacklist)), random: true, limit: 1}).then(images => {
				if (images.length == 0) return msg.edit("Sorry, couldn't find any image with those tags!");
				return msg.edit("Found a picture!", {
					embed: new RichEmbed()
						.setFooter("Not seeing an image? Click the link in the title!")
						.setImage(images[0].common.fileURL)
						.setTitle("Click here to open full image!")
						.setURL(images[0].common.fileURL)
						.setDescription(
							"Rating: " + util.parse("r", images[0].common.rating) + 
							"\nScore: " + util.parse("sc",images[0].common.score) +
							"\nSource: " + util.parse("s", images[0].common.source)
						)
				});
			}, err => {
				return msg.edit("Sorry, couldn't find any image with those tags!");
			});
		});
	}

	static help() {
		return {
			category: "nsfw",
			shortDesc: "Searches Rule34.xxx",
			longDesc: "Searches Rule34.xxx for one or multiple tags and posts an image if one was found. Requires a channel to be marked as NSFW or have \"nsfw\" in its name.",
			syntax: "rule34 <tag> [tag] [tag]..."
		};
	}
}

module.exports = rule34;