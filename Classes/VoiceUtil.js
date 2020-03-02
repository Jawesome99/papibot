const yt = require("ytdl-core");
const { RichEmbed, GuildMember, GuildChannel } = require("discord.js");
const infoCommand = require("../Commands/info.js");

const fileRegExp = new RegExp(/(https:\/\/|http:\/\/).+(\.mp3$|\.wav$)/);

/**
 * Play an audio file or a YouTube Video
 * @param {string} url - The file or video URL
 * @param {GuildMember} requester - The Discord ID of the requester
 * @param {GuildChannel} channel - The Discord channel the request was sent to
 */
exports.playURL = function (url, requester, channel) {
	// We're assuming a voice connection already exists
	// First check whether this is a file or a YouTube video
	if (fileRegExp.test(url)) {
		// If it's a file, attempt to play it and notify 
		
		// NOTE: PLAYING A FILE SOMEHOW BREAKS PLAYING ANY FURTHER AUDIO, WHETHER IT BE FILES OR YOUTUBE!
		let filename = url.split("/");
		filename = filename[filename.length - 1];

		channel.send("<@" + requester.id + ">, attempting to play your requested file \"" + filename + "\"...");

		channel.guild.voiceConnection.playStream(url, {bitrate: "auto"});
		channel.guild.voiceConnection.dispatcher.on("end", reason => {
			/**
			 * We can determine whether the stream was stopped manually or if it ended naturally using the reason.
			 * Stopping it manually causes reason to be undefined.
			 * Naturally ending causes the reason to be "Stream is not generating quickly enough."
			 **/
			if ((reason === "Stream is not generating quickly enough." || reason === "stream") && channel.guild.queue[0]) {
				channel.guild.queueOut.shift();
				let next = channel.guild.queue.shift();
				return this.playURL(next.url, next.requester, next.channel);
			}
		});

	} else
	if (yt.validateURL(url)) {
		// If it's a YouTube video, we use ytdl-core to stream it. Also print information about the video to the channel.
		yt.getInfo(url, (err, info) => {
			// Catch any errors and play the next song
			if (err || !info) {
				channel.send("<@" + requester.id + ">, uh-oh! Something went wrong with your video:\n" + err);
				if (channel.guild.queue[0])
				{
					channel.guild.queueOut.shift();
					let next = channel.guild.queue.shift();
					this.playURL(next.url, next.requester, next.channel);
				}
				return;
			}

			channel.guild.voiceConnection.playStream(yt(url, { filter: 'audioonly' }));
			channel.guild.voiceConnection.dispatcher.on("end", reason => {
				/**
				* We can determine whether the stream was stopped manually or if it ended naturally using the reason.
				* Stopping it manually causes reason to be undefined.
				* Naturally ending causes the reason to be "Stream is not generating quickly enough."
				**/
				if (reason === "Stream is not generating quickly enough." && channel.guild.queue[0]) {
					channel.guild.queueOut.shift();
					let next = channel.guild.queue.shift();
					return this.playURL(next.url, next.requester, next.channel);
				}
			});
			channel.send("<@" + requester.id + ">, playing your requested video!", {
				embed: makeEmbed(info).setFooter("Requested by " + requester.displayName, requester.user.displayAvatarURL)
			});
		});
	} else {
		// This should in theory not occur, but in case it does
		channel.send("Sorry, I can't play this!");
	}
};

/**
 * Make an embed from the information parsed from a video
 * @param {object} info - The information fetched via ytdl-core
 * @returns {RichEmbed} - The generated embed
 **/
makeEmbed = function (info) {
	// Limit video description to six lines
	let description = info.description.split("\n");
	description.splice(6);

	// Make views more readable
	let views = parseInt(info.player_response.videoDetails.viewCount);
	let viewData = ["", " Thousand", " Million", " Billion"];
	let viewCounter = 0;
	while (views / 1000 > 1) {
		views /= 1000;
		viewCounter++;
	}
	if (viewCounter > 0) views = views.toFixed(2);

	// Make video length more readable
	let length = infoCommand.parseUptime(info.length_seconds);

	// Generate and return embed
	let embed = new RichEmbed().setTitle(info.title)
		.setAuthor(info.author.name, info.author.avatar, info.author.channel_url)
		.setDescription(description.join("\n"))
		.setThumbnail(info.thumbnail_url.replace("default", "maxresdefault"))
		.setURL(info.video_url)
		.addField("Views:", views + viewData[viewCounter], true)
		.addField("Rating:", (info.player_response.videoDetails.averageRating / 5 * 100).toFixed(2) + "%", true)
		.addField("Length:", length);
	return embed;
};