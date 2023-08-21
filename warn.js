//const Discord = require('discord.js');
//const sql = require('sqlite');
//const Database = require('./database.js');
//const config = require('./config.json');
//const db = new Database(sql);
//const client = new Discord.Client();

const { Client, GatewayIntentBits } = require("discord.js");
const client = new Client({
  intents: [GatewayIntentBits.Guilds, GatewayIntentBits.MessageContent],
});
client.on('ready', () => {
	console.log(`Logged in as ${client.user.tag}!`);
});
const config = require('./config.json');
const sql = require('sqlite');
const Database = require('./database.js');
const db = new Database(sql);


client.on("messageReactionAdd", async (reaction, user) => {
	try {
		await onAddedReaction(reaction);
	}
	catch(ex) {
		logException("Unable to parse added reaction", ex);
	}
});
function logException(message, exception) {
	let message2 = exception;
	if((typeof exception === "object") && (exception !== null)) {
		message2 = JSON.stringify(exception);
	}
	console.log(message + ": " + message2);
}

async function onAddedReaction(reaction) {
	let emoji = reaction.emoji.name;
	let author = reaction.message.author;
	if(author.bot) {
		return;
	}
	if(emoji == "⚠️") {
		try {
			await warnMessage(reaction.message);
		} catch(ex) {
			console.send("Unable to warn: " + ex);
		}
	}
}
async function warnMessage(message) {
	try {
		let msgid = message.id;
		let author = message.author;
		let userid = author.id;
		let score = await db.getScore(msgid);
		await db.addToScore(msgid, author, 1);
		//let date = message.createdAt;
		//let date2 = date.getDate() + "/" + (date.getMonth()+1) + "/" + date.getFullYear();
		//let header = "Warn: " + message.author.username + " at " + date2;
		//let message2 = header + "\n" + message.content + " - @moderator";
		//let channel = message.channel;
		//channel.send(message2);
	}
	catch(ex) {
		channel.send("Unable to send warning: " + ex);
	}
}

function sleep(ms) {
	return new Promise(resolve => setTimeout(resolve, ms));
}

client.on('error', console.error);

async function start() {
	await db.load();
	console.log("Starting login");
	await client.login(config.token);
	console.log("Logged into Discord");
}

start();
