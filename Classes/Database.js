const base = require("sqlite3").Database;

class Database {
	/**
	 * Create a database at the given path.
	 * @param {string} path - The path of the database
	 */
	constructor(path) {
		this.db = new base(path, err => {
			if (err) throw err;
		});
		this.log("DB loaded");
	}

	/**
	 * Get all rows of a table.
	 * @param {string} table - The name of the table
	 * @returns {Promise<object[]>} - The rows of the table
	 */
	all(table) {
		return new Promise((resolve, reject) => {
			switch (table) {
				case "afk":
					this.db.all("SELECT * FROM afk;", [], (err, rows) => {
						if (err) reject(err);
						resolve(rows);
					});
					break;
				case "blacklists":
					this.db.all("SELECT * FROM blacklists;", [], (err, rows) => {
						if (err) reject(err);
						resolve(rows);
					});
					break;
				case "logs":
					this.db.all("SELECT * FROM logs;", [], (err, rows) => {
						if (err) reject(err);
						resolve(rows);
					});
					break;
				case "prefixes":
					this.db.all("SELECT * FROM prefixes;", [], (err, rows) => {
						if (err) reject(err);
						resolve(rows);
					});
					break;
				case "welcomes":
					this.db.all("SELECT * FROM welcomes;", [], (err, rows) => {
						if (err) reject(err);
						resolve(rows);
					});
					break;
			}
		});
	}

	/**
	 * Delete en entry from a table.
	 * One of:
	 * "afk"
	 * "blacklists"
	 * "logs"
	 * "prefixes"
	 * "welcomes"
	 * @param {string} table - The name of the table
	 * @param {string} id - The ID of the entry
	 * @returns {Promise<void>} - Nothing
	 */
	del(table, id) {
		return new Promise((resolve, reject) => {
			switch (table) {
				case "afk":
					this.db.run("DELETE FROM afk WHERE id = ?;", [id], err => {
						if (err) reject(err);
						resolve();
					});
					break;
				case "blacklists":
					this.db.run("DELETE FROM blacklists WHERE id = ?;", [id], err => {
						if (err) reject(err);
						resolve();
					});
					break;
				case "logs":
					this.db.run("DELETE FROM logs WHERE id = ?;", [id], err => {
						if (err) reject(err);
						resolve();
					});
					break;
				case "prefixes":
					this.db.run("DELETE FROM prefixes WHERE id = ?;", [id], err => {
						if (err) reject(err);
						resolve();
					});
					break;
				case "welcomes":
					this.db.run("DELETE FROM welcomes WHERE serverid = ?;", [id], err => {
						if (err) reject(err);
						resolve();
					});
					break;
			}
		});
	}

	/**
	 * Get the value of an item in a table.
	 * @param {string} table - The name of the table
	 * @param {string} id - The ID of the entry
	 * @returns {string} - The value of the entry
	 */
	get(table, id) {
		return new Promise((resolve, reject) => {
			switch (table) {
				case "afk":
					this.db.get("SELECT message FROM afk WHERE id = ?;", [id], (err, row) => {
						if (err) reject(err);
						if (row) resolve(row.message);
						else resolve(null);
					});
					break;
				case "blacklists":
					this.db.get("SELECT tags FROM blacklists WHERE id = ?;", [id], (err, row) => {
						if (err) reject(err);
						if (row) resolve(JSON.parse(row.tags));
						else resolve([]);
					});
					break;
				case "logs":
					this.db.get("SELECT channelid, settings FROM logs WHERE serverid = ?;", [id], (err, row) => {
						if (err) reject(err);
						if (row) resolve(row);
						else resolve(null);
					});
					break;
				case "prefixes":
					this.db.get("SELECT prefix FROM prefixes WHERE id = ?;", [id], (err, row) => {
						if (err) reject(err);
						if (row) resolve(row.prefix);
						else resolve(null);
					});
					break;
				case "welcomes":
					this.db.get("SELECT channelid, message FROM welcomes WHERE serverid = ?;", [id], (err, row) => {
						if (err) reject(err);
						if (row) resolve(row);
						else resolve(null);
					});
					break;
			}
		});
	}

	/**
	 * Run the entered SQL statement. Does not return anything.
	 * @param {string} sql - The SQL statements
	 * @returns {Promise<void>} - Nothing
	 */
	run(sql) {
		return new Promise((resolve, reject) => {
			this.db.run(sql, [], (err) => {
				if (err) reject(err);
				resolve();
			});
		});
	}

	/**
	 * Set the value of an entry in a table.
	 * @param {string} table - The name of the table
	 * @param {string} id - The ID of the entry
	 * @param {string} val - The value
	 * @returns {Promise<void>} - Nothing
	 */
	set(table, id, val) {
		return new Promise((resolve, reject) => {
			switch (table) {
				case "afk":
					this.db.get("SELECT * FROM afk WHERE id = ?;", [id], (err, row) => {
						if (err) reject(err);
						if (row) {
							this.db.run("UPDATE afk SET message = ? WHERE id = ?;", [val, id], err => {
								if (err) reject(err);
								resolve();
							});
						} else {
							this.db.run("INSERT INTO afk VALUES (?, ?);", [id, val], err => {
								if (err) reject(err);
								resolve();
							});
						}
					});
					break;
				case "blacklists":
					this.db.get("SELECT * FROM blacklists WHERE id = ?;", [id], (err, row) => {
						if (err) reject(err);
						if (row) {
							this.db.run("UPDATE blacklists SET tags = ? WHERE id = ?;", [val, id], err => {
								if (err) reject(err);
								resolve();
							});
						} else {
							this.db.run("INSERT INTO blacklists VALUES (?, ?);", [id, val], err => {
								if (err) reject(err);
								resolve();
							});
						}
					});
					break;
				case "logs":
					this.db.get("SELECT * FROM logs WHERE id = ?;", [id], (err, row) => {
						if (err) reject(err);
						if (row) {
							this.db.run("UPDATE logs SET channelid = ?, settings = ? WHERE id = ?;", [val[0], val[1], id], err => {
								if (err) reject(err);
								resolve();
							});
						} else {
							this.db.run("INSERT INTO logs VALUES (?, ?, ?);", [id, val[0], val[1]], err => {
								if (err) reject(err);
								resolve();
							});
						}
					});
					break;
				case "prefixes":
					this.db.get("SELECT * FROM prefixes WHERE id = ?;", [id], (err, row) => {
						if (err) reject(err);
						if (row) {
							this.db.run("UPDATE prefixes SET prefix = ? WHERE id = ?;", [val, id], err => {
								if (err) reject(err);
								resolve();
							});
						} else {
							this.db.run("INSERT INTO prefixes VALUES (?, ?);", [id, val], err => {
								if (err) reject(err);
								resolve();
							});
						}
					});
					break;
				case "welcomes":
					this.db.get("SELECT * FROM welcomes WHERE serverid = ?;", [id], (err, row) => {
						if (err) reject(err);
						if (row) {
							this.db.run("UPDATE welcomes SET channelid = ?, message = ? WHERE serverid = ?;", [val[0], val[1], id], err => {
								if (err) reject(err);
								resolve();
							});
						} else {
							this.db.run("INSERT INTO welcomes VALUES (?, ?, ?);", [id, val[0], val[1]], err => {
								if (err) reject(err);
								resolve();
							});
						}
					});
					break;
			}
		});
	}

	/**
	 * Log a line to the console with a timestamp.
	 * @param {string} string - The string to log
	 */
	log(string) {
		let date = new Date();
		let hr = date.getHours().toString();
		let min = date.getMinutes().toString();
		let sec = date.getSeconds().toString();
		if (hr.length < 2) hr = "0" + hr;
		if (min.length < 2) min = "0" + min;
		if (sec.length < 2) sec = "0" + sec;
		let ts = `[${hr}:${min}:${sec}]`;
		console.log(`${ts} ${string}`);
	}
}

module.exports = Database;