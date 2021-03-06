﻿class report {
	static run(client, args) {
		const m = args.shift();
		if (!args[0]) {
			return m.channel.send("Report a user by mentioning them and include a reason! Evidence has to be provided, otherwise your report might be ignored! You can either include a link somewhere in your report or send an attachment, i.e. a photo!\nAbusing this feature will result in you being blocked from using the bot!");
		}
		if (!m.mentions.members.first()) {
			return m.channel.send("Who are you reporting? Mention them!");
		}
		let reporter = m.author;
		let reportee = m.mentions.users.first();
		let reason = args.join(" ");
		let guild = m.guild.name;
		if (m.attachments.first()) {
			let attachment = m.attachments.first().url;
			return client.fetchUser("211227683466641408").then(Owner => {
				Owner.send(`A report has been sent in by ${reporter.tag} (ID: ${reporter.id}) from ${guild}\nReportee: ${reportee.tag} (ID: ${reportee.id})\n\nReason: ${reason}\nEvidence: ${attachment}`);
				return m.channel.send("Your report has been submitted!");
			});
		} else {
			return client.fetchUser("211227683466641408").then(Owner => {
				Owner.send(`A report has been sent in by ${reporter.tag} (ID: ${reporter.id}) from ${guild}\nReportee: ${reportee.tag} (ID: ${reportee.id})\n\nReason: ${reason}\nNo attachment provided!`);
				return m.channel.send("Your report has been submitted!");
			});
		}
	}

	static help() {
		return {
			category: "general",
			shortDesc: "Reports a user to Papi-Bot's developer",
			longDesc: "Reports a user to Papi-Bot's developer. Use only to report abuse of commands, such as bullying et cetera. Please send evidence as well as this will greatly help with the report procedure. After analysing the report, the user will be blocked from using Papi-Bot in any way.",
			syntax: "report <mention> <reason> [evidence as attachment or link in reason]"
		};
	}
}

module.exports = report;