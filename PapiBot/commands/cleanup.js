﻿class cleanup {
	static run(client, args) {
		const m = args.shift();
		if (!client.checkPermission(m.member, ["MANAGE_MESSAGES"])) return m.channel.send("You don't have the permission to do that!");
		if (!client.checkPermission(m.guild.me, ["MANAGE_MESSAGES"])
			&& m.mentions.members.first() !== m.guild.me) return m.channel.send("I don't have the permission to do that! Please enable the \"Manage Messages\" permission for me or my role!");
		let prunecount = parseInt(args[1]);
		if (!prunecount) return m.channel.send("You need to specify how many messages to delete!");
		m.channel.fetchMessages({ limit: 200 }).then(Messages => {
			let msgArray = Messages.filterArray(m => m.author.id === m.mentions.users.first().id);
			if (msgArray.length > prunecount) msgArray.length = prunecount;
			return m.channel.bulkDelete(msgArray).then(Msgs => {
				let person = m.mentions.members.first();
				if (!person) {
					person = m.mentions.users.first().username;
				} else {
					person = person.displayName;
				}
				return m.channel.send(`Cleaned up ${Msgs.size} of ${person}'s messages!`).then(m1 => {
					m1.delete(5000);
					m.delete(5000);
				});
			}, e => {
				m.channel.send("Bulk delete failed, using fallback method.").then(m1 => {
					msgArray.push(m1);
					var Msgs = 0;

					function del(i) {
						Msgs++;
						if (i === msgArray.length - 1) {
							let person = m.mentions.members.first();
							if (!person) {
								person = m.mentions.users.first().username;
							} else {
								person = person.displayName;
							}
							return m.channel.send(`Cleaned up ${Msgs.size} of ${person}'s messages!`).then(m1 => {
								m1.delete(5000);
								m.delete(5000);
							});
						} else {
							del(i + 1);
						}
					}
					del(0);
				});
			});
		});
	}
}

module.exports = cleanup;