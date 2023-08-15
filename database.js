module.exports = Database = function (sql) {
	this.sql = sql;
}
Database.prototype = {
	load: async function () {
		await this.sql.open("./database/scores.sqlite");
		await this.sql.migrate();
		console.log("Loaded database");
		// TEST SETUP
		var createUser = (id, name) => { return { id: id, username: name } };
		await this.addToScore("25", createUser("55", "Bob"), 1);
		await this.addToScore("26", createUser("132", "Alice"), 2);
		// var createUser = (id, name) => { return { id: id, username: name } };
		// await this.addToScore("👌", createUser("1234", "Radomaj"), 13);
		// await this.addToScore("👌", createUser("5678", "IX"), 2);
		// await this.addToScore("👌", createUser("1111", "AlexTobacco"), 0);
		// await this.addToScore("👌", createUser("9998", "king bones"), 20);
		//
	},
	getSetting: async function (settingName) {
		let row = await this.sql.get(`SELECT value FROM Setting WHERE setting ="${settingName}"`);
		if (!row) {
			throw "ERROR: setting " + settingName + " does not exist";
		} else {
			return row.value;
		}
	},
	setSetting: async function (settingName, value) {
		await this.sql.run(`INSERT OR REPLACE INTO Setting (setting, value) VALUES ("${settingName}", "${value}");`);
	},
	clear: async function () {
		await this.sql.run(`DELETE FROM Score`);
	},
	getScore: async function (msgId) {
		row = await this.sql.all(`SELECT * FROM Score WHERE msgId = "${msgId}" DESC`);
		if (!row) {
			throw "ERROR: Missing row for " + msgId;
		} else {
			return row;
		}
	},
	addToScore: async function (msgId, user, addition) {
		row = await this.sql.get(`SELECT * FROM Score WHERE msgId = "${msgId}" and userId ="${user.id}"`);

		if (!row) {
			await this.sql.run(
				`INSERT INTO Score (msgId, userId, username, points) VALUES
				("${msgId}", "${user.id}", "${user.username}", "${addition}")`);
			console.log("Added " + msgId + " by " + user.username + " (" + user.id + ") to scores");
		}
		else {
			let newScore = row.points + addition;
			await this.sql.run(`UPDATE Score SET points = ${newScore} WHERE msgId = "${msgId}" and userId ="${user.id}"`);
			console.log(msgId + " by " + user.username + " (" + user.id + ") just changed to " + newScore);
		}
	}
};
