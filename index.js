require('dotenv').config()

const Telegraf = require('telegraf')
const moment = require('moment')
const bot = new Telegraf(process.env.BOT_TOKEN)

const request = require ("request");
const FeedParser = require ("feedparser");

const genbetadev = "http://feeds.weblogssl.com/genbetadev";
const genbeta = "http://feeds.weblogssl.com/genbeta";
//const genbetadev = "http://feeds.weblogssl.com/genbetadev";
//const genbetadev = "http://feeds.weblogssl.com/genbetadev";


bot.start(ctx => {
  console.log(`${ctx.from.username} started`)
  ctx.reply('Allahu Akbar!')
})

bot.startPolling()

bot.hears(/help/, ctx => {
  ctx.reply("There are 2 options atm: \n 1 => GenbetaDev \n 2 => Genbeta")
})

bot.hears(/1/, ctx => {

  getFeed (genbetadev, function (err, feedItems) {
  	if (!err) {
  		ctx.reply("There are " + feedItems.length + " items in the feed.\n");
  		for (var i = 0; i < feedItems.length; i++) {
        ctx.reply("Item #" + (i+1) + ":\n" + feedItems[i].link + "\n")
  			}
  		}
  	});
})

bot.hears(/2/, ctx => {

  getFeed (genbeta, function (err, feedItems) {
  	if (!err) {
  		ctx.reply("There are " + feedItems.length + " items in the feed.\n");
  		for (var i = 0; i < feedItems.length; i++) {
        ctx.reply("Item #" + (i+1) + ":\n" + feedItems[i].link + "\n")
  			}
  		}
  	});
})

function getFeed (urlfeed, callback) {

	var req = request (urlfeed);
	var feedparser = new FeedParser ();
	var feedItems = new Array ();


	req.on ("response", function (response) {
		var stream = this;
		if (response.statusCode == 200) {
			stream.pipe (feedparser);
			}
		});


	req.on ("error", function (err) {
		console.log ("getFeed: err.message == " + err.message);
		});


	feedparser.on ("readable", function () {
		try {
			var item = this.read (), flnew;
			if (item !== null) {
				feedItems.push (item);
				}
			}
		catch (err) {
			console.log ("getFeed: err.message == " + err.message);
			}
		});


	feedparser.on ("end", function () {
		callback (undefined, feedItems);
		});


	feedparser.on ("error", function (err) {
		console.log ("getFeed: err.message == " + err.message);
		callback (err);
		});
}
