// Danbooru supports 1 tag maximum

const Kaori = require("kaori");
const kaori = new Kaori();
const util = require("../data/other/kaoriUtil.js");
const { RichEmbed } = require("discord.js");

class danbooru {
	static run(client, args) {
		let m = args.shift();
		if (!client.checkNsfw(m.channel)) return m.channel.send("I can't do that here! Try again in an nsfw channel!");
		if (!args) return m.channel.send("You need to specify a tag!");
		if (args.length > 1) return m.channel.send("Sorry, danbooru does not allow searching for more than one tag at a time!");
		return m.channel.send("Taking a look...").then(msg => {
			return kaori.search("danbooru", { tags: args, random: true, limit: 1}).then(images => {
				return msg.edit("Found a picture!", {
					embed: new RichEmbed()
						.setFooter("Not seeing an image? Click the link in the title!")
						.setImage(images[0].common.fileURL)
						.setTitle("Click here to open full image!")
						.setURL(images[0].common.fileURL)
						.setDescription(
							"Rating: " + util.parse("r", images[0].common.rating) + 
							"\nScore: " + util.parse("sc", images[0].common.score) +
							"\nArtist: " + util.parse("a"), images[0].tag_string_artist + 
							"\nSource: " + util.parse("s", images[0].common.source)
						)
				});
			}, err => {
				return msg.edit("Sorry, couldn't find any image with that tag!");
			});
		});
	}

	static help() {
		return {
			category: "nsfw",
			shortDesc: "Searches Danbooru.donmai.us",
			longDesc: "Searches Danbooru.donmai.us for one tag and posts an image if one was found. Requires a channel to be marked as NSFW or have \"nsfw\" in its name.",
			syntax: "danbooru <tag>"
		};
	}
}

module.exports = danbooru;