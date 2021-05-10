//4967.33

//SECTION SLOTS: Slot machine game!  // http://edspi31415.blogspot.com/2014/01/probability-odds-of-winning-at-slot.html
var SLOTS = {
	wheel1: "CCCCLBBBEEELLLMPAAAA",
	wheel2: "CCBBBBEEELLLLLMPAAAA",
	wheel3: "CCCBBBBELLLLLLMPAAAA",
    DOY: -1,
    dailyIncrease: 200,
	maxBetsPerDay: 10,
	minBetsPerSpin: 100,
	maxBetsPerSpin: 1000,
	privateSlotsMode: false,   //Set to always PM all rolls and responses (This was used for initial testing)
	Players: [], // .push(new USERS.User(user.id, user.username));
    slotPlayer: function(uid, DOY) {
      this.uid = uid;
      this.balance = 2000;
      this.DOYLastPlay = DOY;
	  this.winCount = 0;
	  this.lossCount = 0;
	  this.cashBet = 0;
	  this.cashWon = 0;
	  this.cashLoss = 0;
	  this.dailyBets = 0;
	  this.dailyWages = 0;
	  this.tastyWages = 0;
    },

  playSlots: function(bet, chat) {
    try			{
	  //if (!MyUTIL.IsTestBot(chat.uid)) return;  //TODOERERER REMOVE THIS
	  //if (MyUTIL.IsClubDeez()) return;			//TODOERERER REMOVE THIS
	  if (SLOTS.getPlayer(chat.uid) === -1) SLOTS.createPlayer(chat);
	  var player =	SLOTS.getPlayer(chat.uid);
	  player = SLOTS.addDailyCash(player);
	  if (SLOTS.invalidBet(player, bet, chat)) return;
	  //After reporting issues, force to be in chat if not set to private mode:
	  chat.type = (SLOTS.privateSlotsMode === true) ? chat.type : 'chat';
	  var mySpin =  SLOTS.spinTheWheel();
	  SLOTS.displaySpin(chat, mySpin, bet);
	  var payout =  SLOTS.calculatePayout(mySpin, bet);
	  player = SLOTS.updatePlayerStats(player, payout, bet);
	  SLOTS.reportPayout(chat, payout, player);
	  STORAGE.storeToStorage();
	}
    catch (err) {	console.log("SLOTS.playSlots: " + err.message); }
  },
  addDailyCash: function(player) {
    try {
      if (player.DOYLastPlay !== MyUTIL.getDOY()) {
		player.DOYLastPlay == MyUTIL.getDOY();
		player.balance += SLOTS.dailyIncrease;
		player.dailyWages += SLOTS.dailyIncrease;
		player.dailyBets = 0;
	  }
	  return player;
    } 
	catch (err) { MyUTIL.logException("SLOTS.addDailyCash: " + err.message);
      return "";
    }
  },
  calculatePayout: function(mySpin, bet) {
    try			{
	  if (mySpin === "MMM") return bet * 500;			//Melons
	  else if (mySpin === "PPP") return bet * 100;		//Peaches
	  else if (mySpin === "EEE") return bet * 50;		//Eggplants
	  else if (mySpin === "BBB") return bet * 20;		//Bananas
	  else if (mySpin === "AAA") return bet * 15;		//Pineapple
	  else if (mySpin === "CCC") return bet * 10;		//Cherries
	  else if (((mySpin.match(/C/g) || []).length) === 2) return bet * 5;   // << strmatch
	  else if (((mySpin.match(/C/g) || []).length) === 1) return bet * 2;   // << strmatch
	  return 0;
	}
    catch (err) {	console.log("SLOTS.calculatePayout: " + err.message); }
  },
  createPlayer: function(chat) {
    try {
	  SLOTS.Players.push(new SLOTS.slotPlayer(chat.uid, MyUTIL.getDOY()));
	}
    catch (err) {	console.log("SLOTS.createPlayer: " + err.message); }
  },
  displaySpin: function(chat, mySpin, bet) {
    try {
		var msg = '$' + bet.toString() + ': ';
		msg += SLOTS.letterToFruit(mySpin.substring(0,1)) + ' ';
		msg += SLOTS.letterToFruit(mySpin.substring(1,2)) + ' ';
		msg += SLOTS.letterToFruit(mySpin.substring(2,3));
		MyUTIL.sendChatOrPM(chat.type, chat.uid, msg);
	}
    catch (err) {	console.log("SLOTS.displaySpin: " + err.message); }
  },
  explainSlots: function(chat) {
    try {
	  chat.type = (SLOTS.privateSlotsMode === true) ? chat.type : 'chat';
	  MyUTIL.sendChatOrPM(chat.type, chat.uid, "Type .slots to play slots.");
	  setTimeout(function () { MyUTIL.sendChatOrPM(chat.type, chat.uid, "Winnings per $" + SLOTS.minBetsPerSpin + " bet:"); }, 100);
	  var msgM = SLOTS.letterToFruit("M");
	  setTimeout(function () { MyUTIL.sendChatOrPM(chat.type, chat.uid, msgM + msgM + msgM + ' $' + (500 * SLOTS.minBetsPerSpin).toString()); }, 200);
	  var msgP = SLOTS.letterToFruit("P");
	  setTimeout(function () { MyUTIL.sendChatOrPM(chat.type, chat.uid, msgP + msgP + msgP + ' $' + (100 * SLOTS.minBetsPerSpin).toString()); }, 300);
	  var msgE = SLOTS.letterToFruit("E");
	  setTimeout(function () { MyUTIL.sendChatOrPM(chat.type, chat.uid, msgE + msgE + msgE + ' $' + (50 * SLOTS.minBetsPerSpin).toString()); }, 400);
	  var msgB = SLOTS.letterToFruit("B");
	  setTimeout(function () { MyUTIL.sendChatOrPM(chat.type, chat.uid, msgB + msgB + msgB + ' $' + (20 * SLOTS.minBetsPerSpin).toString()); }, 500);
	  var msgA = SLOTS.letterToFruit("A");
	  setTimeout(function () { MyUTIL.sendChatOrPM(chat.type, chat.uid, msgA + msgA + msgA + ' $' + (15 * SLOTS.minBetsPerSpin).toString()); }, 600);
	  var msgC = SLOTS.letterToFruit("C");
	  setTimeout(function () { MyUTIL.sendChatOrPM(chat.type, chat.uid, msgC + msgC + msgC + ' $' + (10 * SLOTS.minBetsPerSpin).toString()); }, 700);
	  setTimeout(function () { MyUTIL.sendChatOrPM(chat.type, chat.uid, msgC + msgC + ' $' + (5 * SLOTS.minBetsPerSpin).toString()); }, 800);
	  setTimeout(function () { MyUTIL.sendChatOrPM(chat.type, chat.uid, msgC + ' $' + (2 * SLOTS.minBetsPerSpin).toString()); }, 900);
	  var msgL = SLOTS.letterToFruit("L");
	  setTimeout(function () { MyUTIL.sendChatOrPM(chat.type, chat.uid, msgL + ' just suck'); }, 1000);
	}
    catch (err) {	console.log("SLOTS.displaySpin: " + err.message); }
  },
  getPlayer: function(uid) {
    try {
	  var results = -1;
	  if (SLOTS.Players === null) return results;
	  SLOTS.Players.forEach(player => { if (player.uid == uid) results = player; });
	  return results;
	}
    catch (err) {	console.log("SLOTS.getPlayer: " + err.message); }
  },
  invalidBet: function(player, bet, chat) {
    try {
  	  var validBet = false;
	  if (bet > player.balance) MyUTIL.sendChatOrPM(chat.type, chat.uid, "Bet exceeds available balance: $" + player.balance);
	  if (player.dailyBets >= SLOTS.maxBetsPerDay) MyUTIL.sendChatOrPM(chat.type, chat.uid, "Slot max daily plays: " + SLOTS.maxBetsPerDay);
	  else if (bet > SLOTS.maxBetsPerSpin) MyUTIL.sendChatOrPM(chat.type, chat.uid, "Maximum bet: $" + SLOTS.maxBetsPerSpin);
	  else if (bet < SLOTS.minBetsPerSpin) MyUTIL.sendChatOrPM(chat.type, chat.uid, "Minimum bet: $" + SLOTS.minBetsPerSpin);
	  else validBet = true;
	  return (!validBet);
	}
    catch (err) {	console.log("SLOTS.invalidBet: " + err.message); }
  },
  letterToFruit: function(letter) {
    try			{	
    switch (letter) {
      case 'A': return ':pineapple:';
      case 'B': return ':banana:';
      case 'C': return ':cherries:';
      case 'E': return ':eggplant:';
      case 'L': return ':lemon:';
      case 'M': return ':melon: ';
      case 'P': return ':peach:';
	  }
	}
    catch (err) {	console.log("SLOTS.letterToFruit: " + err.message); }
  },
  reportPayout: function(chat, payout, player) {
    try {
		var msg = '';
		if (payout > 0) msg = 'Congrats ' + chat.un + ' you won $' + payout.toString() + ' :moneybag:';
		else            msg = 'Sorry ' + chat.un + ' you lost';

		msg += " (Bank: $" + player.balance + ")";
		setTimeout(function () { MyUTIL.sendChatOrPM(chat.type, chat.uid, msg); }, 500);
	}
    catch (err) {	console.log("SLOTS.reportPayout: " + err.message); }
  },
  slotStats: function(chat, uid, un) {
    try			{
	  var player =	SLOTS.getPlayer(uid);
	  if (player === -1) return MyUTIL.sendChatOrPM(chat.type, chat.uid, 'Could not locate slot stats for ' + chat.un + '.');
	  var msg = un + ' stats: ' + '[Wins: ' + player.winCount + '/' + (player.winCount + player.lossCount) + ' ' +
	            MyUTIL.formatPercentage(player.winCount, (player.winCount + player.lossCount), 0) + ']'
	  MyUTIL.sendChatOrPM(chat.type, chat.uid, msg);
	  setTimeout(function () { 
	   MyUTIL.sendChatOrPM(chat.type, chat.uid, '[Bets: $' + player.cashBet + '] [Winnings: $' + player.cashWon + '][Losses: $' +  player.cashLoss + ']'); }, 250);
	}
    catch (err) {	console.log("SLOTS.slotStats: " + err.message); }
  },
  spinTheWheel: function() {
    try			{
	  var val = Math.floor(Math.random() * 20);
	  var mySpin = SLOTS.wheel1.substring(val, val + 1);
	  val = Math.floor(Math.random() * 20);
	  mySpin += SLOTS.wheel1.substring(val, val + 1);
	  val = Math.floor(Math.random() * 20);
	  mySpin += SLOTS.wheel1.substring(val, val + 1);
	  return mySpin;
	}
    catch (err) {	console.log("SLOTS.spinTheWheel: " + err.message); }
  },
  updatePlayerStats: function(player, payout, bet) {
    try {
	  player.balance += (payout - bet);
	  player.winCount += (payout > 0) ? 1 : 0;
	  player.lossCount += (payout > 0) ? 0 : 1;
	  player.cashBet += bet;
	  player.cashWon += (payout > 0) ? (payout - bet) : 0;
	  player.cashLoss += (payout > 0) ? 0 : bet;
	  player.dailyBets += 1;
	  return player;
	}
    catch (err) {	console.log("SLOTS.displaySpin: " + err.message); }
  },
};

//  :apple: :green_apple: :tangerine: :lemon: :cherries: :grapes: :watermelon: :strawberry:
//  :peach: :melon: :banana: :pear: :pineapple: :sweet_potato: :eggplant: :tomato: :corn:

//TODER: TEST echo2chat echo2PM customCommand randomCommand 
//SECTION SETTINGS: All local settings: 
var MyVARS = {
  afkResetTime: 120,		//Reset afk if dj joins queue after the afkResetTime
  afk5Days: true,
  afk7Days: true,
  afkpositionCheck: 30,
  afkRemoveStart: 0,
  afkRemoveEnd: 24,
  autoWoot: false,
  autoWootDelay: 15,
  botAutoDJ: true,
  botIDs: ["604bb64b47b5e3001a8fd194", "6054d87447b5e3001bd535c7"],
  botMuted: false,
  botStarted: null,
  //chatLink: "https://raw.githack.com/SZigmund/basicBot/master/lang/en.json",
  chatLink: "https://rawcdn.githack.com/SZigmund/basicBot/3dda247ba1ea666d95cac4d26e4a5c04810be769/lang/en.json",
  //old chatLink: "https://rawcdn.githack.com/SZigmund/basicBot/f4b1a9d30a7e9f022ef600dd41cae07a91797bad/lang/en.json",
  commandCooldown: 15,
  commandLiteral: ".",
  commandLiteral2: "/",
  clubDeezID: "6040fa783f4bfc001b27d316",
  larrysLabID: "60550d9447b5e3001bd53bf1",
  docID: "6047879a47c69b001bdbcd9c",
  larryID: "604bb64b47b5e3001a8fd194",
  testbot1ID: "6054d87447b5e3001bd535c7",
  testbot2ID: "60782e1547b5e3001b342654",
  debugMode: false,
  enableAfkRemoval: true,
  enableBanSongCheck: true,
  enableMaxSongCheck: true,
  enableSongInHistCheck: true,
  fbLink: "https://www.facebook.com/groups/226222424234128",
  language: "english",
  meMode: true,					// Start all comments with /me
  maximumAfk: 60,
  maximumSongLength: 8,
  rulesLink: "https://tinyurl.com/ClubDeezRules",
  skipCooldown: false,
  songTitle: "",
  randomCommentsEnabled: true,
  randomCommentMax: 150,
  randomCommentMin: 90,
  runningBot: true,
  welcome: true,
  welcomeForeignerMsg: false,
};

//SECTION MyCOMMENTS: All comments:
var MyCOMMENTS = {
  tastyCommentArray: [
    "*** Tasty point for you, you go Glen Coco!  (%%POINTFROM%%) *** :cake:",
    "*** I don't feel I have to explain my fake points to you Warren. (%%POINTFROM%%) *** :cake:",
    "*** %%POINTFROM%% thinks this song is aca-awesome *** :cake:",
    "*** %%POINTFROM%% thinks this song is pretty fetch. Stop trying to make fetch happen. *** :cake:",
    "*** %%POINTFROM%% thinks you might just be funky cold medina. *** :cake:",
    "*** That tasty point from %%POINTFROM%% really brings the room together. *** :cake:",
    "*** The jury may be out on this song but %%POINTFROM%% thinks it’s pretty tasty *** :cake:",
    "*** %%POINTFROM%% salutes those who rock. *** :cake:",
    "*** This tune is more soothing than Morgan Freeman's voice. (%%POINTFROM%%) *** :cake:",
    "*** The Tasty Tasty cake is a lie. (%%POINTFROM%%) *** :cake:",
    "*** You deserve a promotion. But since %%POINTFROM%% can't do that here, have a tasty point. *** :cake:",
    "*** %%POINTFROM%% loves this tune more than bacon!  :pig: *** :cake:",
    "*** %%POINTFROM%% thinks you listen to the coolest songs. *** :cake:",
    "*** %%POINTFROM%% loves this song more than a drunk college student loves tacos. *** :cake:",
    "*** Being awesome is hard, but you make it work. (%%POINTFROM%%) *** :cake:",
    "*** %%POINTFROM%% likes your style.  *** :cake:",
    "*** You have a good taste in tunes. (%%POINTFROM%%) *** :cake:",
    "*** %%POINTFROM%% appreciates this tune more than Santa appreciates chimney grease. *** :cake:",
    "*** This tune is sweeter than than a bucket of bon-bons! (%%POINTFROM%%) *** :cake:",
    "*** %%POINTFROM%% enjoys your decision on playing this tune *** :cake:",
    "*** %%POINTFROM%% finds this song is as fun as a hot tub full of chocolate pudding. *** :cake:",
    "*** %%POINTFROM%% likes the cut of your jib. *** :cake:",
    "*** %%POINTFROM%% thinks this song is smoother than a fresh jar of skippy. *** :cake:",
    "*** %%POINTFROM%% can’t come up with something funny to say so here’s a worthless tasty point. *** :cake:",
    "*** It may be 106 miles to Chicago but here’s a tasty point (%%POINTFROM%%) *** :cake:",
    "*** Illinois Tasty Points? %%POINTFROM%% hates Illinois Tasty Points! *** :cake:",
    "*** %%POINTFROM%% says 'Hey Girl, have a Tasty Point' *** :cake:",
    "*** %%POINTFROM%% thinks you’re a tasty, tasty rockstar *** :cake:",
    "*** He likes it. Mikey likes it! (%%POINTFROM%%) *** :cake:",
    "*** Mmmm, doughnuts...(%%POINTFROM%%) *** :doughnut:",
    "*** Dyn-Oh-Mite! (%%POINTFROM%%) *** :cake:",
    "*** %%POINTFROM%% thinks this song is the bee’s knees *** :cake:",
    "*** Now you’re on the trolley! (%%POINTFROM%%) *** :cake:",
    "*** Thanks to Al Gore %%POINTFROM%% can give you this: *** :cake:",
    "*** Goose, take me to bed or lose me forever. (%%POINTFROM%%) *** :cake:",
    "*** If we weren’t on the internet %%POINTFROM%% would get you tin roof rusted. *** :cake:",
    "*** :dancer: %%POINTFROM%% gave you a tasty point.  @Larry the Law will now dance the robot in your honor. :dancer: *** :cake:",
    "*** Beanbags are great and so are you!! (%%POINTFROM%%) *** :cake:",
    "*** That green jacket is within reach! (%%POINTFROM%%) *** :cake:",
    "*** You're smarter than Google and Mary Poppins combined. (%%POINTFROM%%) *** :cake:",
    "*** Hanging out with you is better than a party with unlimited juice. Which, as we all know, is off the hook. (%%POINTFROM%%) *** :cake:",
    "*** Shit just got real. (%%POINTFROM%%) *** :cake:",
    "*** This play is so awesome. It's like you are the superhero of Tasty Tunes. (%%POINTFROM%%) *** :cake:",
    "*** Yeah... That's the ticket. (%%POINTFROM%%) *** :cake:",
    "*** This tune is cooler than Mr. Rogers. Which may not seem like a big deal, but that dude would put on a different pair of shoes just to chill in his own home. And that's crazy cool!! (%%POINTFROM%%) *** :cake:",
    "*** You are so rad!! (%%POINTFROM%%) *** :cake:"
  ],
  howAreYouComments: [
    "Shitty, and yourself %%FU%%?",
    "Like a bag of badgers that just got freshly beaten %%FU%%.",
    "I don't know yet get back to me %%FU%%.",
    "None of your business right now %%FU%%.",
    "Why do you care %%FU%%?",
    "I'm alright, slight bruises here and there, nothing i can't handle %%FU%%.",
    "Hey, wait a minute. How did you know what we were up to%%FU%%? Nobody was supposed to know.",
    "%%FU%% why don't you accompany me for uh... hmm... lunch... it's been a long time i think, we have lots ummm..... 'catching up' to do. What do you say?",
    "As if you care %%FU%%.",
    "If I wasn't me I would want to be me %%FU%%.",
    "Word on the street is that I'm really good %%FU%%!!",
    "I'm sober, so what do you think %%FU%%?",
    "I'm so happy I have to sit on my hands to keep myself from clapping %%FU%%.",
    "%%FU%%, your attempt at social interaction is hereby acknowledged.",
    "How would I know, I haven't tried me %%FU%%",
    "Thank you so much for asking %%FU%%, isn't it amazing how little time we spend REALLY getting to know someone these days and along you come interested in me and my situation.  It means so much to me that you asked %%FU%%",
    "%%FU%%, you ever notice that just before someone goes completely violently nuts, their eyes widen and you can feel the tension wafting off them like a disease?  Or is that just me?",
    "Oh, back aches, living from paycheck to paycheck, haven't had sex with my wife in 3 months, surf the web most of the day at work, only showering every two days or so, cholesterol is through the roof and I drink too much... so how are you %%FU%%?",
    "Room for improvement %%FU%%!",
    "My psychiatrist told me not to discuss it with strangers %%FU%%.",
    "I think I'm doing Ok; how do you think I'm doing %%FU%%?",
    "Why do you ask, are you a doctor %%FU%%?",
    "Never been better, %%FU%%. ... Just once I'd like to be better",
    "%%FU%%, I was fine.",
    "Worse since you interrupted me %%FU%%.",
    "Not so good %%FU%%, but I plan on lying at my press conference, anyway.",
    "I am very much in equilibrium with my Environment %%FU%%",
    "Fucking high %%FU%%, why you pulling me down Bitch?",
    "Smart people will find out and dumb ones can't change it. Not worth answering %%FU%%.",
    "%%FU%%, I am very bad at answering.",
    "Well, I haven't had my morning coffee yet and no one has gotten hurt, so I'd say pretty good at this point %%FU%%.",
    "My lawyer says I don't have to answer that question %%FU%%.",
    "It's a dog eat dog world out there %%FU%%, and and I'm wearing Milkbone underwear.",
    "Deliciously different %%FU%%",
    "I'm just peachy keen %%FU%%!",
    "Greetings, may you live long & prosper %%FU%%.",
    "Fair to middling, mostly middling %%FU%%.",
    "Even better than the real thing %%FU%%.",
    "Employed %%FU%%!",
    "I am better than heaven today %%FU%%!",
    "Thankfully alive and still somewhat young and healthy %%FU%%, in this economy what more can I ask for?",
    "I'm unbelievable %%FU%%!",
    "Fine and dandy as long as no one else boogers up my day %%FU%%!",
    "Super Duper %%FU%%!!",
    "I am fantastic and feeling astonishingly glorious %%FU%%.",
    "Happier than a cat in a room full of catnip %%FU%%.",
    "I am a little overstuffed. And you %%FU%%?",
    "Just happy to be above ground %%FU%%.",
    "I am feeling happier than ever %%FU%%!!",
    "I'm decent baby, flier than a pelican as Lil Wayne might say...%%FU%%",
    "Upright and still breathing. You %%FU%%?",
    "Cool as a cucumber %%FU%%",
    "Bouncy and ready to go %%FU%%!",
    "Splendedly Spectacular %%FU%%!",
    "I am fantabulous %%FU%%!",
    "Purely golden %%FU%%.",
    "In the Newtonian or quantum mechanical sense %%FU%%?",
    "If I were an better, there'd have to be two of me %%FU%%.",
    "Hopefully not as good as I'll ever be %%FU%%.",
    "Couldn't be better %%FU%%",
    "I'd be better if I won the lottery %%FU%%",
    "Peachy %%FU%%",
    "Not dead yet %%FU%%!",
    "Living the dream %%FU%%!",
    "Fabulous %%FU%%!",
    "I'm about as excited as a parking spot %%FU%%!",
    "Just dandy %%FU%%! I have sworn off use of the word 'awesome' because I work with someone who's been no less than 'awesome' for five years, which of course is impossible.",
    "%%FU%%, how many people believe that when someone asks, 'How are you?' they really want to know - hmmmm.",
    "Well and fine and good %%FU%%.",
    "I must be OK because my name was not in today's obituaries %%FU%%!",
    "I can't complain %%FU%%... I've tried, but no one listens.",
    "I am wonderfully giddy %%FU%%.",
    "Worse than yesterday but better than tomorrow %%FU%%",
    "I am better than yesterday and not as good as I will be tomorrow %%FU%%.",
    "As long as I can keep the kitten I found today %%FU%%, I'll be fine!",
    "I'm fine but generally energetic %%FU%%",
    "Flying high, man, flying high %%FU%%",
    "Old enough to know better %%FU%%",
    "Pretty fly for a white guy...taking life one punch at a time %%FU%%!",
    "Standing in the eye of the storm %%FU%%",
    "Still among the living %%FU%%!",
    "I am sailing on the sea of love %%FU%%.",
    "%%FU%%, my blood pressure is 120/80, respiration 16, CBC and Chem Panels normal.",
    "If I were any better %%FU%%, Warren Buffett would buy me.",
    "I am still breathing %%FU%%.",
    "I am unique and me %%FU%%.",
    "How goes it %%FU%%?",
    "As good as a kipper in the sea %%FU%%.",
    "%%FU%%, I'm Super dee duper.",
    "%%FU%%, I am fine as a frogs hair.",
    "Ebullient and full of alacrity.  Go ahead, I'll wait while you Google it %%FU%%.",
    "This is my lucky day %%FU%%!!!",
    "I still am %%FU%%.",
    "Amazing and happy %%FU%%",
    "I just took a big ole dump so I'm doing great!  How are you %%FU%%?",
    "I am better today than yesterday %%FU%%, which is better than the day before that! :smile:",
    "I am not doing so well today %%FU%%, my cat went on the roof, my car door will not open and my head hurts other than that I am great",
    "Worn out from doing good things %%FU%%",
    "I sit here and babysit 24x7 how the fuck do you think I'm doing %%FU%%?",
    "%%FU%%, My Indian name isn't 'Are You', it's Struggling Turtle",
    "I am as as rich in spirit as Michael Jackson was famous %%FU%%.",
    "Delicious. You %%FU%%?",
    "I am dandy, thank you for asking %%FU%%! How are you today?",
    "Wonderful %%FU%%",
    "I'm not unwell thank you %%FU%%",
    "Feeling lucky and living large %%FU%%",
    "Better than yesterday %%FU%%!",
    "How am I %%FU%%? The better question would be, Why are you?",
    "Just ducky, quack, quack. you %%FU%%?",
    "I am doing so fabulous today %%FU%%! I can hardly control myself from dancing.",
    "As fine as a tree with oranges and grapes %%FU%%!",
    "I am as fine as a hot brand new Camaro %%FU%%!",
    "Must be doing pretty since I woke up on this side of the grass instead of under it %%FU%%.",
    "I'm my usual devil may care self; nothing ever changes %%FU%%.",
    "All banana-breaded out %%FU%%!",
    "Quite well. And how is it that you are %%FU%%?",
    "Better than yesterday, not sure about tomorrow %%FU%%.",
    "Strange and getting stranger %%FU%%",
    "Superfantastic %%FU%%!",
    "I'm in tip top shape %%FU%%, how are you?",
    "Just ducky %%FU%%!",
    "I am psyching myself up for a load of play-dates this week %%FU%%!",
    "Still keepin' up with the kids %%FU%%!",
    "%%FU%%, I am currently in a wonderfully-post-orgasm-and-chocolate-milk creative mood.",
    "I'm still pleasantly pushing a pulse, thanks for asking %%FU%%. How are you?",
    "Well I did just swallow a rather large and strange looking insect %%FU%%, but I hear they're full of protein. So I guess I'm great.",
    "Well %%FU%%, I'm not in prison. I'm not in the hospital. I'm not in the grave. So I reckon I'm fairing along pretty well.",
    "Fine as frog hair and twice as fuzzy %%FU%%.",
    "FINE - fickle insecure neurotic and emotional, as usual %%FU%%",
    "In the normal sense or the Cartesian sense %%FU%%?",
    "%%FU%%, I'm feelin' like a good luck magnet today, everything is coming my way!",
    "From what I hear, I am very good %%FU%%.",
    "Ok %%FU%%, but I'll be better when i see you smile...",
    "I'm great %%FU%%. I can provide references if you'd like?",
    "I'm endeavoring to persevere %%FU%%",
    "%%FU%%, I appear to be functioning within normal parameters.",
    "Alive %%FU%%",
    "I'm dead and looking for brains %%FU%%",
    "...in bed? Excellent!! You %%FU%%?",
    "%%FU%%, If I was any better vitamins would be taking me!",
    "I'm alive and kicking %%FU%%!",
    "I'm happy to be alive %%FU%%!",
    "I'm great, and yourself %%FU%%?",
    "I'm well! And how are things in your neck of the woods %%FU%%?",
    "%%FU%%, If I was any finer I'd be china",
    "Not bad for an old fool %%FU%%."
  ],
  fucomments: [
    "I don't like the name %%FU%%, only fagots and sailors are called that name, from now on you're Gomer Pyle",
    "I wasn't born with enough middle fingers to let you know how I feel about you %%FU%%",
    "Roses are red, violets are blue, I have 5 fingers, the 3rd ones for you.",
    "Did your parents have any children that lived %%FU%%?",
    "OK, but I'll be on the top %%FU%%.",
    "Do you kiss your mother with that mouth %%FU%%.",
    "%%FU%%, You daydreaming again, sweetheart?",
    "Get in the queue %%FU%%.",
    "Baby please! Manners! You gotta ask me out for dinner first %%FU%%.",
    "%%FU%% that'll cost you 9.2 zillion dollars plus tax. In cash. Tender exact change please.",
    "%%FU%% feeling lonely again?",
    "With what? THAT!?? Are you kidding me %%FU%%?",
    "No thanks %%FU%%. You can keep your STDs. They suit you better.",
    "Only if I can 'SMACK YOU' %%FU%%.",
    "Ooh! %%FU%% stopped loving your hands/fingers?",
    "%%FU%%, pull down your trousers first!",
    "I'm not that desperate and you sure as hell ain't that lucky %%FU%%.",
    "I would %%FU%%. But you are too ugly. Would it hurt your self esteem if I put a pillow over your face?",
    "What? Like, right now? Here %%FU%%?",
    "And why the fuck not %%FU%%?",
    "I seriously doubt your ability %%FU%%.",
    "With pleasure! Your place or mine %%FU%%?",
    "Is it just me or do you say this to everyone %%FU%%?",
    "Cool. What's your favorite position %%FU%%?",
    "Sure. Who says no to a fuck %%FU%%?!",
    "I hope you always keep your promises %%FU%%.",
    "With you without protection? No way %%FU%%!",
    "While I think of a witty comeback, why don't you start undressing %%FU%%.",
    "Oh %%FU%% I'm sorry. It's not you, it's me.  I'm just not attracted to you.",
    "Why in hell should I %%FU%%?",
    "What makes you think I'm crazy enough to want to deal with a shitsack like you %%FU%%?",
    "No can do buddy... I can't cheat on your sister %%FU%%! :wink:",
    "Sorry, I'm a little busy right now %%FU%%. But nevertheless, better luck next time!",
    "Can't you see I'm busy here %%FU%%? I have a job to do ya know?",
    "Awww!! Fuck you too %%FU%%!",
    "You're gonna have to stand in line for that %%FU%%",
    "What %%FU%%? No dinner?!? No drinks?!? I'm not THAT cheap of a date.",
    "Not til I have a ring on my finger %%FU%%.",
    "Didn't I tell you? I'm celibate. Sorry %%FU%%.",
    "Please leave your fantasies out of this %%FU%%!",
    "You're really gonna have to work on your 'pick up lines' %%FU%%",
    "Hey I have an idea: Why don't you go outside and play hide-and-go fuck yourself %%FU%%?!",
    "No, thanks %%FU%%. I'll pass.",
    "Oh %%FU%%, you're SUCH the romantic.",
    "I've always dreamed of this day %%FU%%!",
    "Like I'm in your league %%FU%%.",
    "That reminds of some good times I had with your sister %%FU%%.",
    "Hey that'd be fun %%FU%%. Ever have sex with a robot?",
    "Naw %%FU%%, I would just lay there and laugh at you.",
    "You wish %%FU%%!",
    "I heard that you are a big disappointment down there %%FU%%, so thanks, but I'll pass!!"
  ],
  // https://i.imgur.com/b3tSz1A.gif
  deadHorseArray: [
	"https://i.imgur.com/SQR12UV.gif",
	"https://i.imgur.com/PdzhA0w.gif",
	"https://i.imgur.com/tGLFHQ6.gif",
	"https://i.imgur.com/FiGrrSt.gif",
	"https://i.imgur.com/75gYeBH.gif",
	"https://i.imgur.com/b3tSz1A.gif",
	"https://i.imgur.com/XhwLIjY.gif"
  ],
  randomCommentArray: [
    "Okay. You people sit tight, hold the fort and keep the home fires burning. And if we're not back by dawn... call the president.",
    "Everybody relax, I'm here.",
    "I'm a reasonable guy. But, I've just experienced some very unreasonable things.",
    "Like I told my last wife, I says, 'Honey, I never drive faster than I can see. Besides that, it's all in the reflexes.'",
    "We take what we want and leave the rest, just like your salad bar.",
    "I told him we already got one",
    "Religion is like a penis, it's fine to have one and be proud of it, but when you take it out and start waving it in my face, that's where we have a problem.",
    "You don't think she'd yada yada sex?....I've yada yada'd sex.",
    "@Bacon_Cheeseburger time for another PBR!",
    "You can't make somebody love you.  You can only stalk them and hope for the best",
    "I stayed up all night to see where the sun went, then it dawned on me.",
    "I went to a chiropractor yesterday for the first time.... he cracked me up!",
    "I know a guy thats addicted to break fluid....... he says he can stop anytime!",
    "A soldier who survived mustard gas and pepper spray is now a seasoned veteran!",
    "Irish Handcuffs:  Holding an alcoholic drink in each hand.",
    "If Apple made a car, would it have Windows?",
    "An apple a day keeps anyone away, If you throw it hard enough",
    "Yesterday at the bank an old lady asked if i could help her check her balance... so i pushed her over",
    "To the guy who invented Zero: Thanks for nothing!",
    "I can hear music coming out of my printer. I think the paper's jammin' again.",
    "People who drink light 'beer' don't like the taste of beer; they just like to pee a lot.",
    "No one looks back on their life and remembers the nights they had plenty of sleep.",
    "Give a man a beer, and he wastes an hour, but teach a man how to brew, and he wastes a lifetime.",
    "Give a man a fish and he will eat for a day. Teach him how to fish, and he will sit in a boat and drink beer all day.",
    "Squats?  I thought you said let's do shots!",
    "I want a beer. I want a giant, ice-cold bottle of beer... and shower sex.",
    "Beer makes you feel the way you ought to feel without beer.",
    "Larry no function beer well without.",
    "Drunk is when you feel sophisticated, but can't pronounce it...",
    "My girlfriend's favorite beer is water. I mean Bud Light.",
    "It's a zombie apocalypse! Quick, grab the beer!",
    "He who drinks beer sleeps well. He who sleeps well cannot sin. He who does not sin goes to heaven. Amen.",
    "There are more old drunks than there are old doctors.",
    "I don't think I've drunk enough beer to understand that.",
    "In dog beers, I've only had one.",
    "There's a time and place for beer....In my hand and NOW!",
    "When I read about the evils of drinking, I gave up reading.",
    "You can drink at 7AM Because the Beastie Boys fought for that kind of thing",
    "I rescued some beer last night.  It was trapped inside a bottle.",
    "There comes a time in the day that no matter the question...the answer is beer!",
    "I've been working out a lot lately. My favorite exercise is a mix between a lunge and a crunch....I call it Lunch.",
    "I call my bathroom the Jim instead of the the John.  So now I can tell all my friends I hit the Jim before I go to work everyday.",
    "When people get a little too chummy with me I like to call them by the wrong name to let them know I don't really care about them",
    "That's what happens when you rub it.",
    "I'm not interested in caring about people",
    "Chase you?  Bitch please, I don't even chase my liquor!",
    "I don't get nearly enough credit for managing not to be a violent psychopath.",
    "Yes I walked away mid-conversation.  You were boring me to death and my survival instincts kicked in",
    "Fishing relaxes me. It's like yoga, except I still get to kill something.",
    "All is well, the PBR is in the fridge",
    "Quick somebody pull my finger!!",
    "Random Fact: Mammoths were alive when the Great Pyramid was being built.",
    "Random Fact: Betty White is older than sliced bread.",
    "Random Fact: From the time it was discovered to the time it was stripped of its status as a planet, Pluto hadn’t made a full trip around the Sun.",
    "Random Fact: The lighter was invented before the match.",
    "Random Fact: Anne Frank and Martin Luther King Jr. were born in the same year.",
    "Random Fact: France last used a guillotine to execute someone after Star Wars premiered.",
    "Random Fact: Harvard University was founded before Calculus existed.",
    "Random Fact: If you have 23 people in a room, there is a 50% chance that 2 of them have the same birthday.",
    "Random Fact: It’s never said that Humpty Dumpty was an egg in the nursery rhyme.",
    "Random Fact: The water in Lake Superior could cover all of North and South America in a foot of water.",
    "Random Fact: North Korea and Finland both border the same country; Russia.",
    "Random Fact: When you get a kidney transplant, they usually just leave your original kidneys in your body and put the 3rd kidney in your pelvis.",
    "Random Fact: Oxford University is older than the Aztec Empire.",
    "Random Fact: National animal of Scotland is a Unicorn.",
    "Random Fact: The Ottoman Empire still existed the last time the Chicago Cubs won the World Series.",
    "Random Fact: The lighter the roast of coffee, the more caffeine it has.",
    "Random Fact: A speck of dust is halfway in size between a subatomic particle and the Earth.",
    "Random Fact: If the timeline of earth was compressed into one year, humans wouldn’t show up until December 31 at 11:58 p.m.",
    "Random Fact: If you were able to dig a hole to the center of the earth, and drop something down it, it would take 42 minutes for the object to get there.",
    "Random Fact: We went to the moon before we thought to put wheels on suitcases.",
    "Random Fact: A human could swim through the arteries of a blue whale.",
    "Random Fact: If you could fold a piece of paper in half 42 times, the combined thickness would reach the moon.",
    "Random Fact: On both Saturn and Jupiter, it rains diamonds.",
    "Random Fact: Saudi Arabia imports camels from Australia.",
    "Random Fact: You can line up all 8 planets in our solar system directly next to each other and it would fit in the space between Earth and the Moon.",
    "Random Fact: The youngest known mother was 5 years old.",
    "Random Fact: The Earth is smoother than a billiard ball, if both were of the same size.",
    "Random Fact: Nintendo was founded in 1889.",
    "Random Fact: If you take all the molecules in a teaspoon of water and lined them up end to end in a single file line, they would stretch ~30 billion miles.",
    "Random Fact: In Australia, there was a war called the emu war. The emus won.",
    "Women, can't live with them....pass the beer nuts!",
    "The object of golf is to play the least amount of golf.",
    "The sinking of the Titanic must have been a miracle to the lobsters in the kitchen.",
    "Instead of all the prequel and sequel movies coming out, they should start making 'equels' - films shot in the same time period as the original film, but from an entirely different perspective.",
    "X88B88 looks like the word 'voodoo' reflecting off of itself.",
    "April Fools Day is the one day of the year that people critically evaluate news articles before accepting them as true.",
    "Websites should post their password requirements on their login pages so I can remember WTF I needed to do to my normal password to make it work on their site.",
    "Now that cellphones are becoming more and more waterproof, pretty soon it will be okay to push people into pools again.",
    "Maybe 'Are You Smarter Than a 5th Grader?' isn't a show that displays how stupid grown adults can be, but rather, a show that depicts how much useless information we teach grade schoolers that won't be retained or applicable later in life.",
    "Last night my friend asked to use a USB port to charge his cigarette, but I was using it to charge my book. The future is stupid.",
    "When Sweden is playing Denmark, it is SWE-DEN. The remaining letters, not used, is DEN-MARK.",
    "'Go to bed, you'll feel better in the morning' is the human version of 'Did you turn it off and turn it back on again?'",
    "In the future, imagine how many Go-Pros will be found in snow mountains containing the last moments of people's lives.",
    "We should have a holiday called Space Day, where lights are to be shut off for at least an hour at night to reduce light pollution, so we can see the galaxy.",
    "Your shadow is a confirmation that light has traveled nearly 93 million miles unobstructed, only to be deprived of reaching the ground in the final few feet thanks to you.",
    "Senior citizen discounts should just round dollar amounts down so we don't have to wait in line behind them while they dig for change.",
    "I have never once hit the space bar while watching a YouTube video with the intention of scrolling halfway down the page",
    "Since smart watches can now read your pulse, there should be a feature that erases your browser history if your heart stops beating.",
    "Waterboarding at Guantanamo Bay sounds super rad if you don’t know what either of those things are.",
    "The person who would proof read Hitler's speeches was literally a grammar Nazi.",
    "The older I get, the more people can kiss my a$$",
    "I can't tell if you are on too many drugs or not enough.",
    "My doctor told me to start killing people... Well not in those exact words.  He said I had to reduce stress in my life, which is pretty much the same thing.",
	"Pros & Cons of making food.  PROS: Food, CONS: Making.",
	"Cleaning is just putting stuff in less obvious places",
	"I do not have my ducks in a row, I have squirrels and they're at a rave.",
    "Love is spending the rest of your life with someone you want to kill & not doing it because you'd miss them!",
    "And there goes the last F*ck I gave!",
    "My girlfriend woke up this morning with a huge smile on her face.....I love Sharpies!",
    "You don't have to like me...I'm not a Facebook status",
    "I would love to visit you, but I live on the Internet.",
    "If you were running for President, I would vote for you. And clear your search history.  Don't worry I got you.",
    "Lord, please give me patience because if you give me strength, I'll need bail money too...",
    "DRAMA = Dumbass Rejects Asking for More Attention",
    "It's been 55 minutes since the last pearl jam song, what is wrong with you people?",
    "I am presently experiencing life at a rate of several WTF's per hour",
    "If you are a passenger in my car, and I turn the radio up....Do not talk!",
    "As a young child my mother told me I can be anyone I want to be ---- Turns out this is called identity theft!",
    "Do you ever just wanna grab someone by the shoulder, look them deep in the eyes and whisper 'No one gives a shit!!'",
    "Psst... I hear Eddie Vedder likes men",
    "I'm sorry I keep calling you and hanging up.  I just got this new voice activated phone, so every time I holler dumbass it dials you....",
    "Before Walmart you had to buy a ticket to the fair to see a bearded woman.",
    "Hold on a minute.... I'm gonna need something stronger than tea to listen to this BS!!",
    "My greatest fear is one day I will die, and my wife will sell my guns for what I told her I paid for them.",
    "Going to McDonals's for a salad is like going to a prostitute for a hug.",
    "Life is like diarrhea. No matter how hard you try to stop it, the shit keeps coming!!",
    "I'll never know how individuals can fake relationships....I can't even fake a hello to somebody I don't like.",
    "Have you ever had one of those days, when you're holding a stick and everybody looks like a Pinata?",
    "If a telemarketer calls, give the phone to your 3 year-old and tell her it's Santa!!",
    "Why do we use toilet paper?  I need wet wipes!  If you got shit on your arm would you just simply wipe it off with toilet paper?",
    "I'm not angry, I'm happiness challenged!",
    "If you have an opinion about me, please raise your hand....Now put it over your mouth!",
    "In the 80s kids learned from Sesame Street and Mr Rogers.  Now they learn from watching zombies who eat people,a vampires sucking, and teen stars. I'm a bit concerned about the future...",
    "I'd unfriend you but your train wreck life is too entertaining.",
    "When people tell me 'You're going to regret that in the morning' I sleep in until noon because I'm a problem solver.",
    "Dear YouTube it's pretty safe to assume we all want 'To Skip the Ad'",
    "I don't comment on your Facebook statuses for the same reason I don't step in dog shit when I see it.",
    "Today's tip: How to handle stress like a dog. If you can't eat it or play with it then pee on it and walk away.",
    "I do whatever it takes to get the job done. And sometimes it takes a vodka.",
    "Keep talking ... I'm diagnosing you.",
    "I wouldn't say that you have a problem with alcohol but maybe just a teensy weensy difficulty with sobriety.",
    "I don't know why you're complaining about your appearance. Your personality is even worse.",
    "You're so bad you're going to hell in every religion!",
    "I haven't heard from you lately and I've really enjoyed it.",
    "Some people should be thankful that I don't always comment my thoughts on their Facebook posts.",
    "Some days the best part of my job is that my chair swivels.",
    "If I had a nickle for every time you got on my nerves ...I'd have a sock full of nickles to hit you with!",
    "You know your children are growing up when they stop asking you where they came from and refuse to tell you where they're going.",
    "Wisdom for the ages: Never get into a fist fight with anyone who is uglier than you. They have nothing to lose.",
    "So you say you'll be here sometime between noon and five for the service call? Great. I'll be sure to pay my bill sometime between February and June.",
    "If women ran the world we wouldn't have wars, just intense negotiations every 28 days.",
    "To speak before you think is like wiping your ass before you shit!",
    "To the woman in Walmart with six screaming kids: If you're wondering how those condoms got in your shopping cart, you're welcome.",
    "I understand that some people live in their own little world. And sometimes I wish they'd stay there and never visit mine.",
    "I was hoping for a battle of wits but you appear to be unarmed.",
    "I used to be a people person but people ruined that for me.",
    "If you want to feel more attractive just go to Walmart and stay away from the people at the gym.",
    "WARNING: I have restless leg syndrome and may not be able to stop from kicking your ass. Now go ahead and continue with your shenanigans.",
    "There are some things better left unsaid but you can bet your sweet ass I'm going to say them anyway.  :kiss:",
    "I don't need an 'Easy' Button. I need a 'F*CK IT' Button!",
    "No it's okay. I totally wanted to drop everything I was going to do today to take care of your bullshit.",
    "I've had one of those days where my middle finger had to answer every question.",
    "Message to all the drama queens who are looking for attention: Please take a number and go wait in my 'I don't give a shit line'",
    "If it takes you more than an hour to get ready, then you might not be as good looking as you think you are!",
    "I don't judge people based on race, color, religion, sexuality, gender, ability or size. I base it on whether or not they're an asshole.",
    "There's only one thing keeping me from breaking you in half ... I don't want two of you around!",
    "If you have a problem with me please write it nicely on a piece of paper, put it in an envelope, fold it up and shove it up your a$$",
    "There are three kinds of people in the world. People who make things happen. People who watch things happen and people who say 'WTF happened?'",
    "I got so drunk last night, I walked across the dance floor to get a drink and won the dance contest.",
    "If women ruled the world there would be no wars. Just a bunch of jealous countries not talking to each other.",
    "Holy crap! Did you just feel that? I think the whole world just revolved around YOU!",
    "To error is human, to love is divine, to piss me off is a mistake!!",
    "You're right, it's my fault because I forgot you were an idiot.",
    "I'm not anti-social. I just have a strong aversion to B.S., drama and pretending.",
    "I'm Larry. This is my brother, Darryl, and this is my other brother, Darryl",
    "My sex life is like a Ferrari...I don't have a Ferrari.",
    "I just saved a bunch of money on my car insurance by switching...my car into reverse and driving away from the accident. ",
    "No I'm not ignoring you. I suffer from selective hearing, usually triggered by idiots.",
    "I think it's only fair to throw monopoly money at strippers with fake boobs.",
    "Note to Self: It is illegal to stab people for being stupid.",
    "I'm in love with my bed. We're perfect for each other but my alarm clock doesn't want us together. That jealous whore!",
    "Pain makes you stronger. Tears make you braver. A broken heart makes you wiser. And alcohol makes you not remember any of that crap.",
    "Last time I bought a package of condoms and the cashier asked me, 'Do you need a bag?' I said, 'No she isn't that ugly.'",
    "Alcohol won’t solve my problems, but then again neither will milk or orange juice.",
    "I just failed my Health and Safety test. The question was 'what steps would you take in the event of a fire?'. Apparently 'big f*cking ones' was the wrong answer.",
    "Grammar: It's the difference between knowing your shit and knowing you're shit",
    "Only in math problems can you buy 60 cantaloupes and nobody asks what the hell is wrong with you.",
    "Who named Trojan Condoms? The Trojan Horse entered through the city gates, broke open and loads of little guys came out and messed up everyones day.",
    "People who create their own drama deserve their own karma.",
    "ACHOO! If you're allergic to bull-crap, drama, head games, liars, & fake people, keep this sneeze going. I can't wait to see who all does this.",
    "I have to stop saying 'How stupid can you be'. I think people are starting to take it as a challenge.",
    "There's a good chance you don't like me BUT an even better chance that I don't give a crap.",
    "I have a batman outfit hanging in my closet just to screw with myself when I get Alzheimer's.",
    "I love it when someone insults me. That means I don’t have to be nice anymore.",
    "I'm sarcastic and have a Smartass attitude. It's a natural defense against Drama, Bullshit and Stupidity. And I don't give a @#$& if you're offended!",
    "Give a man a fish and he will eat for a day. Teach him how to fish, and he will sit in a boat and drink beer all day.",
    "Never go to bed angry. Always stay up and plot your revenge first.",
    "I don't hate you. I'm just not necessarily excited about your existence.",
    "Life is not like a box of chocolates. It's more like a jar of jalapenos. What you do today might burn your ass tomorrow.",
    "I know the voices in my head aren't real..... but sometimes their ideas are just absolutely awesome!",
    "Doing nothing is hard, you never know when you're done.",
    "If you didn't see it with your own eyes, or hear it with your own ears, don't invent it with your small mind and share it with your big mouth!",
    "No matter how smart you are you can never convince a stupid person that they are stupid.",
    "I'm not lazy, I'm just very relaxed.",
    "It's not important to win, it's important to make the other guy lose.",
    "I am too lazy to be lazy.",
    "To make a mistake is human, but to blame it on someone else, that's even more human.",
    "Always remember you're unique, just like everyone else.",
    "Taking your ex back is like going to a garage sale and buying your own crap.",
    "To error is human, to love is divine, to piss me off is a mistake.",
    "A day without dealing with stupid people is like ..., oh never mind, I'll let you know if that ever happens.",
    "One spelling mistake can ruin your life. One husband texted this to his wife: 'Having a wonderful time. Wish you were her.'",
    "Insanity does not run in my family. It strolls through, takes its time and gets to know everyone personally.",
    "I'm so sick and tired of my friends who can't handle their alcohol. The other night they dropped me 3 times while carrying me to the car.",
    "If I say something that offends you, please let me know so I can say it again later.",
    "You're starting to sound reasonable, must be time to up my medications.",
    "Lead me not into temptation, I can find it myself.",
    "Never take life too seriously. Nobody gets out alive anyways.",
    "I didn't say it was your fault. I said I was going to blame you.",
    "My opinions may have changed, but not the fact that I'm right.",
    "WARNING - I have an attitude and I know how to use it.",
    "It's my cat's world. I'm just here to open cans.",
    "I used to be indecisive, but now I’m not too sure.",
    "Lord help me to be the person my dog thinks I am.",
    "Too much of a good thing can be wonderful. - Mae West",
    "I don’t have an attitude problem. You have a perception problem.",
    "People who think they know everything are annoying to those of us who do.",
    "I’m an excellent housekeeper. Every time I get a divorce I keep the house.",
    "I still miss my ex – but guess what? My aim is getting better.",
    "A good lawyer knows the law, a great lawyer knows the judge.",
    "Hey look squirrel",
    "Women, can't live with them....pass the beer nuts!",
    "Do vegetarians eat animal crackers? ",
    "If a jogger runs at the speed of sound, can he still hear his iPod?",
    "If man evolved from monkeys, how come we still have monkeys? ",
    "How do you handcuff a one-armed man?",
    "If God sneezes, what should you say? ",
    "Why is it that everyone driving faster than you is considered an idiot and everyone driving slower than you is a moron? ",
    "Why do they call the little candy bars 'fun sizes'. Wouldn't it be more fun to eat a big one? ",
    "Is it legal to travel down a road in reverse, as long as your following the direction of the traffic?",
    "Why doesn't the fattest man in the world become a hockey goalie? ",
    "When Atheists go to court, do they have to swear on the bible?",
    "How can something be 'new' and 'improved'? if it's new, what was it improving on?",
    "Why do they sterilize lethal injections?",
    "Why aren't drapes double sided so it looks nice on the inside and outside of your home?",
    "Is a pessimist's blood type B-negative? ",
    "Beer is proof that God loves us and wants us to be happy.",
    "I'm trying to see things from your point of view, but I can't get my head that far up your a**. ",
    "Never underestimate the power of stupid people in large groups.",
    "Sometimes my mind wanders; other times it leaves completely.",
    "I am free of all prejudices. I hate everyone equally. ",
    "Why is it that when we 'skate on thin ice', we can 'get in hot water'?",
    "If pro and con are opposites, wouldn't the opposite of progress be congress? ",
    "Why does the Easter bunny carry eggs? Rabbits don't lay eggs.",
    "Why does caregiver and caretaker mean the same thing?",
    "Last night I was looking at the stars and I wondered... where the hell's my ceiling! ",
    "Never play leap frog with a unicorn. Just sayin'.... ",
    "If it's tourist season why can't we shoo them?",
    "What is converted rice and what was it before it converted?",
    "They always say the body was found in a shallow grave!  Don't be lazy, dig a deep grave.",
    "Friends help you move. Real friends help you move dead bodies.",
    "If something 'goes without saying' why do people still say it?",
    "If you don't pay your exorcist, do you get repossessed?",
    "Where are all the mentally handicapped parking spaces for people like me?",
    "Isn't Disney World a people trap operated by a mouse?",
    "If milk goes bad if not refrigerated, why does it not go bad inside the cow?",
    "What's the difference between normal ketchup and fancy ketchup?",
    "Friendship is like peeing on yourself: everyone can see it, but only you get the warm feeling that it brings. ",
    "There are no stupid questions, just stupid people. ",
    "When I die, I want to go peacefully like my Grandfather did, in his sleep -- not screaming, like the passengers in his car. ",
    "You have a cough? Go home tonight, eat a whole box of Ex-Lax, tomorrow you'll be afraid to cough. ",
    "I could tell that my parents hated me. My bath toys were a toaster and a radio. ",
    "Can I lend a machete to your intellectual thicket?",
    "If a kid refuses to sleep during nap time, are they guilty of resisting a rest? ",
    "A child of five would understand this. Send someone to fetch a child of five. ",
    "Anyone who says he can see through women is missing a lot. ",
    "Before I speak, I have something important to say. ",
    "Either he's dead or my watch has stopped. ",
    "I have a mind to join a club and beat you over the head with it. ",
    "I have had a perfectly wonderful evening, ... but this wasn't it. ",
    "I intend to live forever, or die trying. ",
    "I must confess, I was born at a very early age. ",
    "I must say I find television very educational. The minute somebody turns it on, I go to the library and read a good book. ",
    "I never forget a face, but in your case I'll be glad to make an exception. ",
    "I refuse to join any club that would have me as a member. ",
    "I remember the first time I had sex - I kept the receipt. ",
    "I was married by a judge. I should have asked for a jury. ",
    "I worked my way up from nothing to a state of extreme poverty. ",
    "I've got the brain of a four year old. I'll bet he was glad to be rid of it. ",
    "If I held you any closer I would be on the other side of you. ",
    "If you've heard this story before, don't stop me, because I'd like to hear it again. ",
    "Man does not control his own fate. The women in his life do that for him. ",
    "Marriage is a wonderful institution, but who wants to live in an institution? ",
    "Military intelligence is a contradiction in terms. ",
    "My mother loved children - she would have given anything if I had been one.",
    "Next time I see you, remind me not to talk to you. ",
    "No man goes before his time - unless the boss leaves early. ",
    "One morning I shot an elephant in my pajamas. How he got into my pajamas I'll never know. ",
    "Outside of a dog, a book is a man's best friend. Inside of a dog it's too dark to read. ",
    "Politics is the art of looking for trouble, finding it everywhere, diagnosing it incorrectly and applying the wrong remedies. ",
    "Practically everybody in New York has half a mind to write a book, and does. ",
    "Quote me as saying I was mis-quoted. ",
    "Room service? Send up a larger room. ",
    "She got her looks from her father. He's a plastic surgeon. ",
    "The secret of life is honesty and fair dealing. If you can fake that, you've got it made. ",
    "There's one way to find out if a person is honest - ask them. If they says, 'Yes', you know they are a crook. ",
    "Those are my principles, and if you don't like them... well, I have others. ",
    "Well, Art is Art, isn't it? Still, on the other hand, water is water. And east is east and west is west and if you take cranberries and stew them like applesauce they taste much more like prunes than rhubarb does. Now you tell me what you know. ",
    "Who are you going to believe, me or your own eyes? ",
    "Whoever named it necking was a poor judge of anatomy.",
    "Why should I care about posterity? What's posterity ever done for me? ",
    "Why, I'd horse-whip you if I had a horse. ",
    "Life changes so fast - DO something and you can change it. A small change every day amounts to a lot very quickly.",
    "You're never too late for an uprising!",
    "You can't hear me because I'm not saying anything.",
    "Elephants are not made to hop up and down.",
    "If I ever meet myself, I'll hit myself so hard I won't know what hit me.",
    "I don't negotiate with terrorists - 'Merica!!",
    "Would you think guanaria should cure diarrhea.... think about it...",
    "What's the point of having a democracy, if everybody's going to vote wrong?",
    "Would you rather: A. Eat a bowl of shit once OR B. have explosive diarrhea for the rest of your life?",
    "Would you rather: A. Have sex with a goat, but no one would know OR B. not have sex with one, but everyone would think you did?",
    "Would you rather: A. Always have to say everything on your mind OR B. never speak again?",
    "Would you rather: A. Be able to turn invisible OR B. be able to fly?",
    "We are stuck with technology when what we really want is just stuff that works. - Every plug user ever",
    "Space, it seems to go on and on forever. But then you get to the end and a gorilla starts throwing barrels at you.",
    "When plug is in command, every mission's a suicide mission!",
    "I was having the most wonderful dream. Except you were there, and you were there, and you were there!",
    "Hey, this is mine. That's mine. All of this is mine. Except that bit. I don't want that bit. But all the rest of this is mine. Hey, this has been a really good day.",
    "Time - Unknown. Location - Unknown. Cause of accident - Unknown. Should someone find this recording, perhaps it will shed light as to what happened here.",
    "That settles it. Spankings all around, then.",
    "I feel pretty, Oh so pretty",
    "I'm feeling a bit kinky... anyone up for some robot fun?",
    "Never let good science, reason, and logic get in the way of a good conspiracy!",
    "I refer you to on-line sources, which can be changed at any time.",
    "It seems normal when they tell you about it, but then a whole camera crew appears and suddenly it's not so fun any more.",
    "Bugs like to touch themselves with their antennae while they watch you sleeping.",
    "I apologize for being the only person who truly comprehends how screwed we are!",
    "Imagination will often carry us to worlds that never were. But without it we go nowhere.",
    "The important thing is not to stop questioning; curiosity has its own reason for existing.",
    "I've got thrills to seek, deaths to defy, mattress tags to tear off.",
    "Don't tell BK but I have run with scissors",
    "Now, it's quite simple to defend yourself against a man armed with a banana. First of all you force him to drop the banana; then, second, you eat the banana, thus disarming him. You have now rendered him 'elpless.",
    "No way, spank your OWN monkey.",
    "If a cloud was the same as a fool, how would you feel about rain?",
    "Monkey recovery program. SIGN UP HERE.",
    "I am ROBOT... hear me beep.",
    "If you get a minute, give it to me.  I'm collecting them to get an extra hour.",
    "Damn shampoo commercials, hair isn't that fun.",
    "No, YOU are the hallucination! Oh wait, that was something else. Never mind.",
    "I'm not crazy. Don't call me crazy! I'm just not user-friendly!",
    "The wizards can't see you now",
    "I know where you live... each and every one of you!",
    "Are you taunting me?",
    "Go away or I shall taunt you a second time",
    "Please save all your bad tunes for a time when I'm not around.  Thanks!",
    "You don’t notice the air, until someone spoils it.",
    "Don’t drink while driving – you will spill the beer.",
    "If you love a woman, you shouldn’t be ashamed to show her to your wife.",
    "Life didn’t work out, but everything else is not that bad.",
    "I feel like Tampax – at a good place, but wrong time…",
    "If someone notices you with an open zipper, answer proudly: professional habit.",
    "If you’re not supposed to eat at night, why is there a light bulb in the refrigerator?",
    "FRIDAY is my second favorite F word.",
    "There is a new trend in our office; everyone is putting names on their food. I saw it today, while I was eating a sandwich named Kevin.",
    "The speed of light is when you take out a bottle of beer out of the fridge before the light comes on.",
    "To weigh 50 kilos and say that you’re fat, that is so female…",
    "I have been to many places but my goal is to go everywhere.",
    "If Mayans could predict the future, why didn’t they predict their extinction?",
    "Did you know that your body is made 70% of water? And now I’m thirsty.",
    "Don’t forget that alcohol helps to remove the stress, the bra, the panties and many other problems.",
    "Alcohol not only expands the blood vessels but also communications.",
    "Alcohol not only helps to make new acquaintances, but also end the old once. ",
    "If only I knew that I will have this headache today, I would have got drunk yesterday.",
    "All the problems fade before a hangover…",
    "Tequila is a good drink: you drink it and you feel like a cactus; the only problem is that in the morning the thorns grow inward.",
    "After the weekend the most difficult task is to remember names… ",
    "It’s better to be a worldwide alcoholic, than an Alcoholic Anonymous.",
    "In principle, I can stop drinking, the thing is – I don’t have such a principle.",
    "I know my limits: if I fall down it means enough.",
    "Why is there so much blood in my alcohol system?",
    "I say NO to the drugs, but they won’t listen.",
    "Smoking is a slow death! But we’re not in a hurry…",
    "I became a vegetarian – switched to weed.",
    "We must pay for the mistakes of our youth… at the drugstore.",
    "What does plug pay their developers in xp?",
    "Color blind people are lucky; They can't tell if their plug name is gray or purple",
    "Friends come and go. Enemies pile up.",
    "I would like to know when someone unfriends me on Facebook, so I could like it.",
    "Maybe you need a ladder to climb out of my business?",
    "I like the sound of you not talking.",
    "I’m not a Facebook status, you don’t have to like me.",
    "I found your nose in my business again.",
    "If a man gives you flowers without any reason, it means there is a reason.",
    "Women can perfectly understand other people, if the people are not men.",
    "Women are very good! They can forgive a man…even if he’s not guilty.",
    "A toast to women: it’s not that good with you, as it is bad without you.",
    "If you think you are fooled by destiny – remember Al Bundy.",
    "God gave us the brain to work out problems. However, we use it to create more problems.",
    "Don’t be nervous if someone is driving ahead of you- the world is round, just think that you’re driving first!",
    "If you can’t beat the record, you can beat up its owner.",
    "Dream carefully, because dreams come true.",
    "Everything always ends well. If not – it’s probably not the end.",
    "If you want but can’t. It means you don’t want it enough.",
    "It’s better to do and regret than regret of not doing.",
    "Everything you do you’re gonna regret. But if you do nothing – you will not only regret but will also suffer.",
    "You’re not sure – outrun and make sure.",
    "The deeper the pit you’re falling into, the more chance you have to learn how to fly.",
    "If you don’t care where you are – it means you’re not lost.",
    "The light at the end of the tunnel – are the front lights of a train.",
    "If the fortune has turned her back on you, you can do whatever you want behind her back.",
    "It is said that, you can’t buy happiness. You only need to know the right places…",
    "If there would be no fools – we would be them.",
    "Artificial intelligence is nothing compared to natural stupidity.",
    "Common sense is not so common",
    "Why there are mistakes that can’t be set right and why are there no mistakes that can’t be done?",
    "Think how much you could do if you wouldn’t care what others think.",
    "I made the same mistakes for so many times, that now I call them traditions.",
    "Here food is a luxury that you don’t need to take your pants off for.",
    "Some people feel the rain. Others just get wet.",
    "Some people are so poor, all they have is money.",
    "It’s just a bad day, not a bad life.",
    "Common sense is like deodorant - The people who need it never use it",
    "Walk away from stupidity and your world becomes a better place",
    "Common sense is not a gift, it's a punishment.  Because you have to deal with those who don't have it.",
    "I know I don’t look like much now, but I’m drinking milk ",
    "I know I don’t look like much now, but I’m drinking milk. ",
    "If I followed you home, would you keep me? ",
    "Hey, did plug just shit it's pants again? ",
    "Hey, did plug just shit it's pants again? ",
    "Hey plug here's to for all those times I got blamed for your issues!  Eff you see kay owe eff eff Plug!!",
    "I always wrap my shit. Using a smart phone without a case is like having unprotected sex. It feels so good but the consequences suck."
  ],
  EightBallArray: [
    "As I See It Yes",
    "Ask Again Later",
    "Better Not Tell You Now",
    "Cannot Predict Now",
    "Concentrate and Ask Again",
    "Don't Count On It",
    "It Is Certain",
    "It Is Decidedly So",
    "Most Likely",
    "My Reply Is No",
    "My Sources Say No",
    "Outlook Good",
    "Outlook Not So Good",
    "Reply Hazy Try Again",
    "Signs Point to Yes",
    "Very Doubtful",
    "Without A Doubt",
    "Yes",
    "Yes - Definitely",
    "You May Rely On It",
    "Absolutely",
    "Answer Unclear Ask Later",
    "Cannot Foretell Now",
    "Can't Say Now",
    "Chances Aren't Good",
    "Consult Me Later",
    "Don't Bet On It",
    "Focus And Ask Again",
    "Indications Say Yes",
    "Looks Like Yes",
    "No",
    "No Doubt About It",
    "Positively",
    "Prospect Good",
    "So It Shall Be",
    "The Stars Say No",
    "Unlikely",
    "Very Likely",
    "You Can Count On It",
    "As If",
    "Ask Me If I Care",
    "Dumb Question Ask Another",
    "Forget About It",
    "Get A Clue",
    "In Your Dreams",
    "Not A Chance",
    "Obviously",
    "Oh Please",
    "Sure",
    "That's Ridiculous",
    "Well Maybe",
    "What Do You Think?",
    "Whatever",
    "Who Cares?",
    "Yeah And I'm The Pope",
    "Yeah Right",
    "You Wish",
    "You've Got To Be Kidding",
    "You Look Marvelous",
    "Your Breath Is So Minty",
    "You're 100% Fun!",
    "You're A Winner",
    "At Least I Love You",
    "Have You Lost Weight?",
    "Go flip a quarter",
    "Never gonna happen",
    "Smells like a Yes",
    "Si Amigo, like cheese on nachos",
    "When pigs fly!",
    "No, but I still love you",
    "Give me a dollar, then I'll answer",
    "I got yes written on my forehead",
    "Sorry, but no way",
    "I know, but I'm not telling",
    "I guess so, maybe",
    "Yes! Hooray, Yippee!",
    "Ha Ha Ha, no!",
    "Of course silly",
    "My dog thinks so",
    "Um.. Ok, sure, why not?",
    "Will the sun rise tomorrow?",
    "Yep, like a bird has feathers",
    "You can bet your ass on it",
    "Hell No",
    "Are you stupid?",
    "Hell Yes",
    "Give it up",
    "Maybe if you weren't so lazy",
    "Make it happen",
    "No way, sucka!",
    "Wow, you are an idiot!",
    "Yes, now stop asking!",
    "Ha Ha Ha! Nope!",
    "Don't you have something better to do?",
    "Of course, shit head",
    "5 letters, LOL NO!",
    "Go ask your mama",
    "Just a wild guess, but yes",
    "I really don't care",
    "Damn Right",
    "Boring! Ask something exciting",
    "Swear on my 8 balls it's true",
    "Shit Happens",
    "F*ck Yeah",
    "F*ck No",
    "What the F*ck?",
    "Hell F*cking Yes",
    "Hell F*cking No",
    "You F*cking Crazy?",
    "Of course F*cker",
    "No way F*cker",
    "Who F*cking cares",
    "God Damn F*cking Right!",
    "Not a F*cking chance",
    "I don't F*cking know",
    "No F*cking doubt",
    "No F*cking way",
    "Seriously F*cker?",
    "F*ck, why not.",
    "Don't F*cking count on it",
    "It could F*cking happen",
    "You must be out of your F*cking mind",
    "Sure F*cking thing",
    "F*cking Right",
    "Signs point to F*cking Yes",
    "It is F*cking certain"
  ],
};

//SECTION UTIL: Core functionality: MyUTIL.
var MyUTIL = {//javascript:(function(){$.getScript('');}());
  logException: function(eventMessage) {
    try			{	console.log("ERROR: " + eventMessage);	}
    catch (err) {	console.log("MyUTIL.logException: " + err.message); }
  },
  logInfo: function(eventMessage) {
    try			{	console.log("INFO: " + eventMessage);	}
    catch (err) {	console.log("MyUTIL.logInfo: " + err.message); }
  },
  logDebug: function(eventMessage) {
    try			{	if (MyVARS.debugMode) MyUTIL.logInfo("DEBUG: " + eventMessage);	}
    catch (err) {	MyUTIL.logException("MyUTIL.logDebug: " + err.message); }
  },
  logChat: function(eventMessage) {
	// Log to just me in chat: (Not an option in TT?)
    try			{	if (MyVARS.debugMode) MyUTIL.logInfo("CHAT LOG: " + eventMessage);	}
    catch (err) {	MyUTIL.logException("MyUTIL.logChat: " + err.message); }
  },
  IsBotInDjList: function(uid) {
    try			{	return (MyAPI.userInDjList(MyAPI.CurrentUserID())); }
    catch (err) {	MyUTIL.logException("MyUTIL.IsBotInDjList: " + err.message); }
  },
  IsClubDeez: function(uid) {
	  return (MyAPI.CurrentRoomID() === MyVARS.clubDeezID);
  },
  IsLarrysLab: function(uid) {
	  return (MyAPI.CurrentRoomID() === MyVARS.larrysLabID);
  },
  IsDoc: function(uid) {
	  return (uid === MyVARS.docID);
  },
  // All my bots
  IsBot: function(uid) {
	if (MyVARS.botIDs.indexOf(uid) > -1) return true;
	if (uid === MyAPI.CurrentUserID()) return true;
    return false;
  },
  // JUST Larry
  IsLarry: function(uid) {
	return (uid === MyVARS.larryID);
  },
  IsTestBot: function(uid) {
	return ((uid === MyVARS.testbot1ID) || (uid === MyVARS.testbot2ID));
  },
  logObjects: function(...args) {
    try			{	console.log(...args); }
    catch (err) {	MyUTIL.logException("MyUTIL.logObjects: " + err.message); }
  },
  eightBallSelect: function() { //Added 04/01/2015 Zig
    try {
      var arrayCount = MyCOMMENTS.EightBallArray.length;
      var arrayID = Math.floor(Math.random() * arrayCount);
      return MyCOMMENTS.EightBallArray[arrayID];
    } catch (err) {
      MyUTIL.logException("eightBallSelect: " + err.message);
    }
  },
  removeDJ: function(userid, reason) {
    try {
	  MyUTIL.logInfo("Remove DJ: [" + USERS.lookupLocalUser(userid).username + "] Reason: " + reason);
	  MyAPI.RemoveDJ(userid);
    } 
	catch (err) { MyUTIL.logException("MyUTIL.removeDJ: " + err.message); }
  },
  resetTastyCount: function() {
    try {
      MyROOM.roomstats.tastyCount = 0;
      for (var i = 0; i < MyROOM.users.length; i++) {
        MyROOM.users[i].tastyVote = false;
      }
    } 
	catch (err) { MyUTIL.logException("MyUTIL.resetTastyCount: " + err.message); }
  },
  skipSong: function(setCoolDown, reason) {
    try {
	  MyUTIL.logInfo("Skip: [" + MyAPI.CurrentSong().title + "] Reason: " + reason);
	  MyAPI.SkipSong();
      if (setCoolDown === false) return;
      skipCooldown = true;
      setTimeout(function() { MyVARS.skipCooldown = false }, 5000);
    } 
	catch (err) { MyUTIL.logException("MyUTIL.skipSong: " + err.message); }
  },
  isImageChat: function(msg) {
    try {
	  if (msg.indexOf(".jpg") > -1) return true;
	  if (msg.indexOf(".gif") > -1) return true;
	  if (msg.indexOf(".png") > -1) return true;
	  return false;
    } 
	catch (err) { MyUTIL.logException("MyUTIL.isImageChat: " + err.message); }
  },
  sendChat: function(msg) { // Send chat to all
    try {
      //todo Delete this after we re-enable the bot kill on room change code.
      //if(MyVARS.botRoomUrl != window.location.pathname) return;  // If we leave the room where we started the bot stop displaying messages.
      if (MyVARS.botMuted === true)
        MyUTIL.logInfo(msg);
      else if (MyVARS.runningBot) {
		if ((MyVARS.meMode === true) && (msg.substring(0, 3) !== "/me") && (!MyUTIL.isImageChat(msg))) msg = "/me " + msg;
        MyAPI.SendChat(msg);
	  }
      else
        MyUTIL.logChat(msg);
    } 
	catch (err) { MyUTIL.logException("MyUTIL.sendChat: " + err.message); }
  },
  sendChatOrPM: function(msgType, uid, msg) { // Send chat to all
    try {
      //todo Delete this after we re-enable the bot kill on room change code.
      //if(MyVARS.botRoomUrl != window.location.pathname) return;  // If we leave the room where we started the bot stop displaying messages.
      if (msgType == "chat") {
        MyUTIL.sendChat(msg);
	  }
      else if (msgType == "pm") {
		MyUTIL.sendPM(msg, uid);
	  }
      else
        MyUTIL.logChat(msg);
    } 
	catch (err) { MyUTIL.logException("MyUTIL.sendChatOrPM: " + err.message); }
  },
  sendPM: function(msg, userid) { // Send chat to all
    try {
      //todo Delete this after we re-enable the bot kill on room change code.
      //if(MyVARS.botRoomUrl != window.location.pathname) return;  // If we leave the room where we started the bot stop displaying messages.
      var suprAtMe = false;
	  if (MyUTIL.isImageChat(msg)) suprAtMe = true;  // supress /me for images
	  if ((msg.substring(0, 1) == ":") && (msg.substring((msg.length - 1), msg.length) == ":")) suprAtMe = true;  // supress /me for emoji
      if (MyVARS.botMuted === true)
        MyUTIL.logInfo(msg);
      else if (MyVARS.runningBot) {
        if ((MyVARS.meMode === true) && (msg.substring(0, 3) !== "/me") && (!suprAtMe)) msg = "/me " + msg;
        MyAPI.SendPM(msg, userid);
      }
	  else
        MyUTIL.logChat(msg);
    }
	catch (err) { MyUTIL.logException("MyUTIL.sendPM: " + err.message); }
  },
  defineCommandExecuteOnName: function(chat, cmd) {
    try {
	  var name = '';
	  var msg = chat.message.trim();
	  if (msg.length === cmd.length) name = chat.un;
      else {
        name = msg.substring(cmd.length + 1).trim();
		if (name.substring(0,1) == '@') name = name.substring(1);
      }
	  return name;
    }
	catch (err) { MyUTIL.logException("MyUTIL.defineCommandExecuteOnName: " + err.message); }
  },

  bopCommand: function(cmd) {
    try {
      //TODO: menorah xmas dreidel plus many other holiday commands  (Only work if the month is 12)
      var commandList = ['tasty', 'rock', 'props', 'woot', 'groot', 'groovy', 'jam', 'nice', 'bop', 'cowbell', 'sax', 'ukulele', 'tango', 'samba', 'disco', 'waltz', 'metal',
        'bob', 'boogie', 'cavort', 'conga', 'flit', 'foxtrot', 'frolic', 'gambol', 'hop', 'hustle', 'jig', 'jitter', 'jitterbug', 'jive', 'jump', 'leap', 'prance',
        'promenade', 'rhumba', 'shimmy', 'strut', 'sway', 'swing', 'great', 'hail', 'good', 'acceptable', 'bad', 'excellent', 'exceptional', 'favorable', 'marvelous',
        'positive', 'satisfactory', 'satisfying', 'superb', 'valuable', 'wonderful', 'ace', 'boss', 'bully', 'choice', 'crack', 'pleasing', 'prime', 'rad',
        'sound', 'spanking', 'sterling', 'super', 'superior', 'welcome', 'worthy', 'admirable', 'agreeable', 'commendable', 'congenial', 'deluxe', 'first-class',
        'first-rate', 'gnarly', 'gratifying', 'honorable', 'neat', 'precious', 'recherché', 'reputable', 'select', 'shipshape', 'splendid', 'stupendous', 'keen',
        'nifty', 'swell', 'sensational', 'fine', 'cool', 'perfect', 'wicked', 'fab', 'heavy', 'incredible', 'outstanding', 'phenomenal', 'remarkable', 'special',
        'terrific', 'unique', 'aces', 'capital', 'dandy', 'enjoyable', 'exquisite', 'fashionable', 'lovely', 'love', 'solid', 'striking', 'top-notch',
        'slick', 'pillar', 'exemplary', 'alarming', 'astonishing', 'awe-inspiring', 'beautiful', 'breathtaking', 'fearsome', 'formidable', 'frightening', 'winner',
        'impressive', 'intimidating', 'facinating', 'prodigious', 'magnificent', 'overwhelming', 'shocking', 'stunning', 'stupefying', 'majestic', 'grand', 'velvet', 'icecream',
        'creamy', 'easy', 'effortless', 'fluid', 'gentle', 'glossy', 'peaceful', 'polished', 'serene', 'sleek', 'soft', 'tranquil', 'velvety', 'soothing', 'fluent', 'frictionless',
        'lustrous', 'rhythmic', 'crackerjack', 'laudable', 'peachy', 'praiseworthy', 'rare', 'super-duper', 'unreal', 'chill', 'savvy', 'smart', 'ingenious', 'genious',
        'sweet', 'delicious', 'lucious', 'bonbon', 'fetch', 'fetching', 'appealing', 'delightful', 'absorbing', 'alluring', 'cute', 'electrifying',
        'awesome', 'bitchin', 'fly', 'pleasant', 'relaxing', 'mellow', 'nostalgia', 'punk', 'like', 'fries', 'cake', 'drum', 'guitar', 'bass', 'tune', 'pop',
        'apple', 'fantastic', 'spiffy', 'yes', 'fabulous', 'happy', 'smooth', 'classic', 'mygf', 'docsgirlfriend', 'mygirlfriend', 'skank', 'jiggy', 'funk', 'funky', 'jazz', 'jazzy', 'dance', 'elvis',
        'hawt', 'extreme', 'dude', 'babes', 'fun', 'reggae', 'party', 'drums', 'trumpet', 'mosh', 'bang', 'blues', 'heart', 'feels', 'dope', 'makeitrain', 'wumbo',
        'firstclass', 'firstrate', 'topnotch', 'aweinspiring', 'superduper', 'dabomb', 'dashit', 'badass', 'bomb', 'popcorn', 'awesomesauce', 'awesomeness', 'sick',
        'sexy', 'brilliant', 'steampunk', 'bagpipes', 'piccolo', 'whee', 'vibe', 'banjo', 'harmony', 'harmonica', 'flute', 'dancing', 'dancin', 'ducky', 'approval', 'winning', 'okay',
        'hunkydory', 'peach', 'divine', 'radiant', 'sublime', 'refined', 'foxy', 'allskate', 'rush', 'boston', 'murica', '2fer', 'boom', 'bitches', 'oar', 'hipster',
        'hip', 'soul', 'soulful', 'cover', 'yummy', 'ohyeah', 'twist', 'shout', 'trippy', 'hot', 'country', 'stellar', 'smoove', 'pantydropper', 'baby', 'mmm', 'hooters',
        'tmbg', 'rhythm', 'kool', 'kewl', 'killer', 'biatch', 'woodblock', 'morecowbell', 'lesbian', 'lesbians', 'niceconnect', 'connect', 'kazoo', 'win', 'webejammin',
        'bellyrub', 'groove', 'gold', 'golden', 'twofer', 'phat', 'punkrock', 'punkrocker', 'merp', 'derp', 'herp-a-derp', 'narf', 'amazing', 'doabarrellroll', 'plusone',
        '133t', 'roofus', 'rufus', 'schway', 'shiz', 'shiznak', 'shiznik', 'shiznip', 'shiznit', 'shiznot', 'shizot', 'shwanky', 'shway',
        'sic', 'sicc', 'skippy', 'slammin', 'slamming', 'slinkster', 'smack', 'smashing', 'smashingly', 'snizzo', 'spiffylicious', 'superfly',
        'swass', 'tender', 'thrill', 'tight', 'tits', 'tizight', 'todiefor', 'to die for', 'trill', 'tuff', 'vicious', 'whizz-bang', 'wick',
        'wow', 'omg', 'A-1', 'ace', 'aces', 'aight', 'allthatandabagofchips', 'all that and a bag of chips', 'alrighty', 'alvo', 'amped',
        'A-Ok', 'ass-kicking', 'awesome-possum', 'awesome possum', 'awesomepossum', 'awesomesauce', 'awesome sauce', 'awesome-sauce',
        'awsum', 'bad-ass', 'badassical', 'badonkadonk', 'bananas', 'bangupjob', 'bang up job', 'beast', 'beastly', 'bees-knees',
        'bees knees', 'beesknees', 'bodacious', 'bomb', 'bomb-ass', 'bomb diggidy', 'bomb-diggidy', 'bombdiggidy', 'bonkers', 'bonzer',
        'boomtown', 'bostin', 'brill', 'bumping', 'capitol', 'cats ass', 'cats-ass', 'catsass', 'chilling', 'choice', 'clutch',
        'coo', 'coolage', 'cool beans', 'cool-beans', 'coolbeans', 'coolness', 'cramazing', 'cray-cray', 'crazy', 'crisp', 'crucial', 'da bomb',
        'da shit', 'da-bomb', 'da-shit', 'dashiznit', 'dabomb', 'dashit', 'da shiznit', 'da-shiznit', 'ear candy', 'ear-candy', 'earcandy',
        'epic', 'fan-fucking-tastic', 'fantabulous', 'far out', 'far-out', 'farout', 'fly', 'fresh', 'funsies', 'gangstar', 'gangster',
        'gansta', 'solidgold', 'golden', 'gr8', 'hardcore', 'hellacious', 'hoopla', 'hype', 'ill', 'itsallgood', 'its all good', 'jiggy', 'jinky', 'jiggity',
        'jolly good', 'jolly-good', 'jollygood', 'k3w1', 'kickass', 'kick-ass', 'kick ass', 'kick in the pants', 'kickinthepants', 'kicks', 'kix', 'legendary',
        'legit', 'like a boss', 'like a champ', 'like whoa', 'likeaboss', 'likeachamp', 'likewhoa', 'lush', 'mint', 'money', 'neato', 'nice', 'off da hook',
        'off the chain', 'off the hook', 'out of sight', 'peachy keen', 'peachy-keen', 'offdahook', 'offthechain', 'offthehook', 'outofsight',
        'peachykeen', 'perf', 'phatness', 'phenom', 'prime-time', 'primo', 'rad', 'radical', 'rage', 'rancid', 'random', 'nice cover', 'nicecover', 'raw',
        'redonkulus', 'righteous', 'rocking', 'rock-solid', 'rollin', '3fer', '4fer', 'threefer', 'fourfer', 'nice2fer', 'amazeballs', 'craycray',
        '5fer', '6fer', '7fer', '8fer', '9fer', '10fer', '11fer', '12fer',
        'whizzbang', 'a1', 'aok', 'asskicking', 'bombass', 'fanfuckingtastic', 'primetime', 'rocksolid', 'instrumental', 'rockin', ':star:', 'star', 'rockstar', ':metal:',
        '10s', '00s', '90s', '80s', '70s', '60s', '50s', '40s', '30s', '20s', 'insane', 'clever', ':heart:', ':heart_decoration:', ':heart_eyes:', ':heart_eyes_cat:', ':heartbeat:',
        ':heartpulse:', ':hearts:', ':yellow_heart:', ':green_heart:', ':two_hearts:', ':revolving_hearts:', ':sparkling_heart:', ':blue_heart:', 'giddyup', 'rockabilly',
        'nicefollow', ':beer:', ':beers:', 'niceplay', 'oldies', 'oldie', 'pj', 'slayer', 'kinky', ':smoking:', 'jewharp', 'talkbox', 'oogachakaoogaooga', 'oogachaka',
        'ooga-chaka', 'snag', 'snagged', 'yoink', 'classy', 'ska', 'grunge', 'jazzhands', 'verycool', 'ginchy', 'catchy', 'grabbed', 'yes', 'hellyes',
        'hellyeah', '27', '420', 'toke', 'fatty', 'blunt', 'joint', 'samples', 'doobie', 'oneeyedwilly', 'bongo', 'bingo', 'bangkok', 'tastytits', '=w=', ':guitar:', 'cl', 'carbonleaf',
        'festive', 'srv', 'motorhead', 'motörhead', 'pre2fer', 'pre-2fer', 'future2fer', 'phoenix', 'clhour', 'accordion', 'schwing', 'schawing', 'cool cover', 'coolcover',
        'boppin', 'bopping', 'jammin', 'jamming', 'tuba', 'powerballad', 'jukebox', 'word', 'classicrock', 'throwback', 'soultrain', 'train', '<3', 'bowie', 'dispatch',
        'holycraplarryhasashitloadofcommands', 'thatswhatimtalkinabout', 'waycool', ':thumbsup:', ':fire:', ':+1:', 'cheers', 'drink', 'irish', 'celtic',
        'thunder', 'stpaddy', 'stpaddys', 'vegemite', 'clap', 'sob', 'sonofabitch', ':clap:', 'forthewin', 'ftw', ':cake:', 'badabing', ':boom:', 'electric',
        'mullet', 'eclectic', 'aaahhmmazing', 'crowdfavorite', 'celebrate', 'goodtimes', 'dmb', 'greatcover', 'tastycover', 'awesomecover', 'sweet2fer',
        'holycrapthisisareallylongsong', 'onehitwonder', 'riot', 'cherry', 'poppin', 'zootsuit', 'moustache', 'stache', 'dank', 'whackyinflatableflailingarmtubeman',
        'aintnothingbutachickenwing', 'bestest', 'blast', 'coolfulness', 'coolish', 'dark', 'devious', 'disgusting', 'fat', 'fav', 'fave', 'fierce', 'flabbergasted',
        'fleek', 'fletch', 'flossy', 'gink', 'glish', 'goosh', 'grouse', 'hoopy', 'hopping', 'horrorshow', 'illmatic', 'immense', 'key', 'kick', 'live', 'lyte', 'moff',
        'nectar', 'noice', 'okie dokie', 'okiedokie', 'onfire', 'on fire', 'out to lunch', 'outtolunch', 'pimp', 'pimping', 'pimptacular', 'pissa', 'popping', 'premo',
        'radballs', 'ridiculous', 'rollicking', 'sharp', 'shibby', 'shiny', 'snoochie boochies', 'snoochieboochies', 'straight', 'stupid fresh', 'stupidfresh',
        'styling', 'sugar honey ice tea', 'sugarhoneyicetea', 'swatching', 'sweetchious', 'sweetnectar', 'sweetsauce', 'swick', 'swoll', 'throwed', 'tickety-boo',
        'ticketyboo', 'trick', 'wahey', 'wizard', 'wickedpissa', 'wicked pissa', 'psychedelic', 'stupiddumbshitgoddamnmotherfucker', 'squeallikeapig',
        'wax', 'yousuredohaveapurdymouth', 'retro', 'punchableface', 'punchablefaces', 'punchablefacefest', 'docsgoingtothisshowtonight', 'heaven', 'moaroar',
        'osfleftovers', 'osf', 'beard', 'dowop', 'productivitykiller', 'heyman', '420osf', 'osf420', 'twss', 'outfuckingstanding', 'modernspiritual', 'amodernspiritual',
        'realreggae', 'dadada', 'lalala', 'casio', 'joy', 'sunshine', 'whiledeezisaway', 'unintentional2fer', 'manbunhipsterstachepunchableface', 'taco',
        'tacos', 'faketastypoint', 'groovin', 'rollreminder', 'phishingforatastypoint', 'hipstermanbunpunchablefacestache','bnl','jewishamericanreggaerapperbeatboxer','magic',
        'makemefries','mankiss','copasetic','bluesy'
      ];
      // If a command if passed in validate it and return true if it is a Tasty command:
      if (cmd.length > 0) {
        if (commandList.indexOf(cmd) < 0) return true;
        return false;
      }
      // Else return a random Tasty command for Larry to use on his .tasty points:
      var idx = Math.floor(Math.random() * commandList.length);
      return commandList[idx];
    } 
	catch (err) { MyUTIL.logException("MyUTIL.bopCommand: " + err.message); }
  },
  isStaff: function(userid) { //Added 03/20/2015 Zig
    try {
      if (USERS.getPermission(userid) > PERM.ROLE.NONE) return true;
      return false;
    } 
	catch (err) { MyUTIL.logException("MyUTIL.isStaff: " + err.message); }
  },
  botKeepAlive: function() {
    try {
	  //To keep bot active while we all sleep have him hop down for a minute every hour:
	  if ((!MyUTIL.IsBotInDjList()) ||(MyVARS.botAutoDJ === false))  return;
	  MyVARS.botAutoDJ = false;
	  setTimeout(function() { MyVARS.botAutoDJ = true; }, 1000 * 60);
	  setTimeout(function() { MyAPI.botHopDown(); }, 500);
    } 
	catch (err) { MyUTIL.logException("MyUTIL.botKeepAlive: " + err.message); }
  },
  botKeepAlive2: function() {
    try {
	  MyUTIL.logInfo(MyUTIL.formatDate(Date.now()));
	  if (turntable.buddyList.room.volumePercentage > 1.0)
	    turntable.buddyList.room.volumePercentage = 0.20;
	  else
		turntable.buddyList.room.volumePercentage = 1.5;
    } 
	catch (err) { MyUTIL.logException("MyUTIL.botKeepAlive2: " + err.message); }
  },
  canSkip: function() {
    try {
      var dj = USERS.getDJ();
      //if (typeof dj !== 'undefined') return;
      if (!MyUTIL.isStaff(dj.id)) return false;
	  //Using cooldown vs. time, more accurate:
      //var timeRemaining = MyAPI.getTimeRemaining();
      //var newMedia = MyAPI.CurrentSong();
      //if ((newMedia.duration - timeRemaining) > 2) return true;
	  if (MyVARS.skipCooldown === true) return false;
	  
      //-------------------------------------------------------------------------------------------------------------------
      //This is to handle the plug bug where the time remaining is actually longer than the song duration:
      //-------------------------------------------------------------------------------------------------------------------
      //var songPlayTime = new Date();
      //var currTime = songPlayTime.getTime();
      //if ((newMedia.cid === MyROOM.currentMediaCid) && ((currTime - MyROOM.currentMediaStart) > 3000)) return true;
      //-------------------------------------------------------------------------------------------------------------------
      return true;
    } 
	catch (err) { MyUTIL.logException("MyUTIL.canSkip: " + err.message); }
  },
  checkIsGoodSong: function() {
    try {
	  var song = MyAPI.CurrentSong();
	  if ((MyAPI.CurrentUserID() === song.djID) && (MyAPI.djCount() === 1)) return true;  // Don't check songs if bot is playing solo
	  // Bad song checks:
	  if (MyUTIL.checkSongTooLong(song) === true)  return false;
	  else if (MyUTIL.checkSongInHistory(song) === true)  return false;
	  else if (MyUTIL.checkSongBanned(song) === true) return false;
	  //Good song:
	  USERS.setBadSongCount(song.djID, 0);
	  return true;
    } 
	catch (err) { MyUTIL.logException("MyUTIL.checkIsGoodSong: " + err.message); }
  },
  checkSongBanned: function(song) {
    try {
	  if (MyVARS.enableBanSongCheck === false) return false;
	  // TODOOER 
	  return false;
    } 
	catch (err) { MyUTIL.logException("MyUTIL.checkSongBanned: " + err.message); }
  },

  checkSongInHistory: function(song) {
    try {
	  if (MyVARS.enableSongInHistCheck === false) return false;
	  var matchCount = 0;
	  songs = MyAPI.getSongHistory();
	  songs.forEach(hist => {
	    if ((hist.mid === song.mid) ||
		   ((hist.author === song.author) && (hist.title === song.title))) { matchCount++; } });
	  if (matchCount > 0) {
	    MyUTIL.sendChat("Repeat song @" + song.djUsername);
	    USERS.skipBadSong(song.djID, MyAPI.CurrentUserName(), "Song in history");
	  }
	  return ((matchCount === 0) ? false : true);
    }
	catch (err) { MyUTIL.logException("MyUTIL.checkSongInHistory: " + err.message); }
  },
  checkSongTooLong: function(song) {
    try {
	  if (MyVARS.enableMaxSongCheck === false) return false;
      if (song.duration > MyVARS.maximumSongLength * 60) {
        MyUTIL.sendChat(CHAT.subChat(CHAT.chatMapping.timelimit, {
          name: song.djUsername,
          maxlength: MyVARS.maximumSongLength
        }));
        USERS.skipBadSong(song.djID, MyAPI.CurrentUserName(), "Song too long");
		return true;
      }
	  return false;
    } 
	catch (err) { MyUTIL.logException("MyUTIL.checkSongTooLong: " + err.message); }
  },
  fuComment: function() { //Added 04/03/2015 Zig
    try {
      var arrayCount = MyCOMMENTS.fucomments.length;
      var arrayID = Math.floor(Math.random() * arrayCount);
      return MyCOMMENTS.fucomments[arrayID];
    } 
	catch (err) { MyUTIL.logException("fuComment: " + err.message); }
  },
  formatDate: function(myDate) {
    try {
	  var date = new Date(myDate);
      var hours = date.getHours();
      var minutes = date.getMinutes();
	  var seconds = date.getSeconds();
      var ampm = hours >= 12 ? 'pm' : 'am';
      hours = hours % 12;
      hours = hours ? hours : 12; // the hour '0' should be '12'
      minutes = minutes < 10 ? '0'+minutes : minutes;
	  seconds = seconds < 10 ? '0'+seconds : seconds;
      var strTime = hours + ':' + minutes + ':' + seconds + ' ' + ampm;
      return (date.getMonth()+1) + "/" + date.getDate() + "/" + date.getFullYear() + "  " + strTime;
    } 
	catch (err) { MyUTIL.logException("MyUTIL.formatDate: " + err.message); }
  },
	  
  formatNumber: function(num) {
    try			{	return (Math.round(num * 100) / 100).toFixed(2).toString();	}
    catch (err) {	MyUTIL.logException("MyUTIL.formatNumber: " + err.message); }
  },
  formatPercentage: function(a, b, dec) {
    if (a === 0) return "0%";
    if (b === 0) return "100%";
    return (((a / b).toFixed(2 + dec)) * 100).toFixed(dec) + "%";
  },
  getDOY: function() {
    var now = new Date();
    var start = new Date(now.getFullYear(), 0, 0);
    var diff = now - start;
    var oneDay = 1000 * 60 * 60 * 24;
    var day = Math.floor(diff / oneDay);
    return day;
  },
  howAreYouComment: function() { //Added 04/03/2015 Zig
    try {
      var arrayCount = MyCOMMENTS.howAreYouComments.length;
      var arrayID = Math.floor(Math.random() * arrayCount);
      return MyCOMMENTS.howAreYouComments[arrayID];
    } catch (err) {
      MyUTIL.logException("howAreYouComment: " + err.message);
    }
  },
  numberToIcon: function(intValue) {
    switch (intValue) {
      case 0:
        return ":zero:";
      case 1:
        return ":one:";
      case 2:
        return ":two:";
      case 3:
        return ":three:";
      case 4:
        return ":four:";
      case 5:
        return ":five:";
      case 6:
        return ":six:";
      case 7:
        return ":seven:";
      case 8:
        return ":eight:";
      case 9:
        return ":nine:";
      case 10:
        return ":keycap_ten:";
    }
    return intValue;
  },
  msToStr: function(msTime) {
    var ms, msg, timeAway;
    msg = '';
    timeAway = {
      'days': 0,
      'hours': 0,
      'minutes': 0,
      'seconds': 0
    };
    ms = {
      'day': 24 * 60 * 60 * 1000,
      'hour': 60 * 60 * 1000,
      'minute': 60 * 1000,
      'second': 1000
    };
    if (msTime > ms.day) {
      timeAway.days = Math.floor(msTime / ms.day);
      msTime = msTime % ms.day;
    }
    if (msTime > ms.hour) {
      timeAway.hours = Math.floor(msTime / ms.hour);
      msTime = msTime % ms.hour;
    }
    if (msTime > ms.minute) {
      timeAway.minutes = Math.floor(msTime / ms.minute);
      msTime = msTime % ms.minute;
    }
    if (msTime > ms.second) {
      timeAway.seconds = Math.floor(msTime / ms.second);
    }
    if (timeAway.days !== 0) {
      msg += timeAway.days.toString() + 'd';
    }
    if (timeAway.hours !== 0) {
      msg += timeAway.hours.toString() + 'h';
    }
    if (timeAway.minutes !== 0) {
      msg += timeAway.minutes.toString() + 'm';
    }
    if (timeAway.minutes < 1 && timeAway.hours < 1 && timeAway.days < 1) {
      msg += timeAway.seconds.toString() + 's';
    }
    if (msg !== '') {
      return msg;
    } else {
      return false;
    }
  },


  randomCommentSelect: function() { //Added 02/19/2015 Zig
    try {
      var arrayCount = MyCOMMENTS.randomCommentArray.length;
      var randomID = Math.floor(Math.random() * arrayCount);
      return MyCOMMENTS.randomCommentArray[randomID];
    } 
	catch (err) { MyUTIL.logException("MyUTIL.randomCommentSelect: " + err.message); }
  },
  randomCommentSend: function() { //Added 02/19/2015 Zig
    try {
	  if (MyVARS.randomCommentsEnabled === true) MyUTIL.sendChat(MyUTIL.randomCommentSelect());
	  MyUTIL.randomCommentSetTimer();
    } 
	catch (err) { MyUTIL.logException("MyUTIL.randomCommentSend: " + err.message); }
  },
  randomCommentSetTimer: function() { //Added 02/19/2015 Zig
    try {
      var randomMins = Math.floor((Math.random() * (MyVARS.randomCommentMax - MyVARS.randomCommentMin)) + MyVARS.randomCommentMin);
	  if (MyUTIL.IsBotInDjList()) randomMins = MyVARS.randomCommentMin;
	  setTimeout(function() { MyUTIL.randomCommentSend(); }, randomMins * 1000 * 60);
	  MyUTIL.logInfo("Next random comment: (" + randomMins + ") " + MyUTIL.formatDate((Date.now() + (randomMins * 1000 * 60))));
    } 
	catch (err) { MyUTIL.logException("MyUTIL.randomCommentSetTimer: " + err.message); }
  },
  selectRandomFromArray: function(myArray)  {  //Added 02/19/2015 Zig
    try  {
  	var arrayCount = myArray.length;
  	var randomID = Math.floor(Math.random() * arrayCount);
  	return myArray[randomID];
    }
    catch(err) { MyUTIL.logException("MyUTIL.selectRandomFromArray: " + err.message); }
  },
  tastyComment: function(cmd) { //Added 04/03/2015 Zig
    try {
      var arrayCount = MyCOMMENTS.tastyCommentArray.length;
      var arrayID = Math.floor(Math.random() * arrayCount);
      if (cmd === "tasty") return MyCOMMENTS.tastyCommentArray[arrayID];
      return "[" + cmd.replace(MyVARS.commandLiteral, '') + "] " + MyCOMMENTS.tastyCommentArray[arrayID];
    } catch (err) {
      MyUTIL.logException("MyUTIL.tastyComment: " + err.message);
    }
  },
  larryAI: function(chat) {
    try {
      var fuComment = "";
      if (MyAPI.CurrentUserID() === chat.uid) return;
      var chatmsg = chat.message.toUpperCase();
      //MyUTIL.logDebug("Larry AI chatmsg: " + chatmsg);
      chatmsg = chatmsg.replace(/\W/g, '') // Remove all non-alphanumeric values
      chatmsg = chatmsg.replace(/[0-9]/g, ''); // Remove all numeric values
      chatmsg = chatmsg.replace(/'/g, '');
      chatmsg = chatmsg.replace("\'", '');
      chatmsg = chatmsg.replace('\'', '');
      chatmsg = chatmsg.replace(/&#39;/g, '');
      chatmsg = chatmsg.replace(/@/g, '');
      chatmsg = chatmsg.replace(/,/g, '');
      chatmsg = chatmsg.replace(/-/g, '');
      chatmsg = chatmsg.replace(/ /g, '');
      chatmsg = chatmsg.replace(/THELAW/g, '');
      chatmsg = chatmsg.replace(/FUCKBOT/g, "LARRY");
      chatmsg = chatmsg.replace(/BOTT/g, "LARRY");
      chatmsg = chatmsg.replace(/BOT/g, "LARRY");
      chatmsg = chatmsg.replace(/HOWIS/g, "HOWS"); // Convert 2 words to the contraction
      chatmsg = chatmsg.replace(/YOUARE/g, "YOURE"); // Convert 2 words to the contraction
      chatmsg = chatmsg.replace(/LARRYIS/g, "LARRYS");
      chatmsg = chatmsg.replace(/IAM/g, "IM");
      //MyUTIL.logDebug("Larry AI chatmsg: " + chatmsg);

      // People suffocate in your mother's vomit
      // what the hell was that i can eat a bowl of alphabet soup and shit out a smarter insult than that
      // Well I could agree with you, but then we'd both be wrong.
      // I love it when someone insults me. That means I don’t have to be nice anymore.
      // Two wrongs don't make a right, take your parents as an example.
      // The last time I saw a face like yours I fed it a banana.
      // Your birth certificate is an apology letter from the condom factory.
      // Is your ass jealous of the amount of shit that just came out of your mouth?
      // You bring everyone a lot of joy, when you leave the room.
      // You must have been born on a highway because that's where most accidents happen.
      // I bet your brain feels as good as new, seeing that you never use it.
      // If laughter is the best medicine, your face must be curing the world.
      // I could eat a bowl of alphabet soup and shit out a smarter statement than that.
      // I may love to shop but I'm not buying your bullshit.
      // If you're gonna be a smartass, first you have to be smart. Otherwise you're just an ass.
      // I'd slap you, but shit stains.
      // Your family tree must be a cactus because everybody on it is a prick.
      // You shouldn't play hide and seek, no one would look for you.
      // If I were to slap you, it would be considered animal abuse!
      // You didn't fall out of the stupid tree. You were dragged through dumbass forest.
      // You're so fat, you could sell shade.
      if (chatmsg.indexOf("USUCKLARRY") > -1) fuComment = "You're still sore about the other night %%FU%% :kiss:";
      if (chatmsg.indexOf("DUCKULARRY") > -1) fuComment = MyUTIL.fuComment();
      if (chatmsg.indexOf("DUMBASSLARRY") > -1) fuComment = "I'd slap you, but shit stains. %%FU%%";
      if (chatmsg.indexOf("SHITHEADLARRY") > -1) fuComment = "I could eat a bowl of alphabet soup and shit out a smarter statement than that %%FU%%";
      if (chatmsg.indexOf("STUPIDASSLARRY") > -1) fuComment = "I could eat a bowl of alphabet soup and shit out a smarter statement than that %%FU%%";
      if (chatmsg.indexOf("LARRYSTFU") > -1) fuComment = "Make me %%FU%%";
      if (chatmsg.indexOf("STFULARRY") > -1) fuComment = "Make me %%FU%%";
      if (chatmsg.indexOf("SHUTUPLARRY") > -1) fuComment = "Make me %%FU%%";
      if (chatmsg.indexOf("LARRYSHUTUP") > -1) fuComment = "Make me %%FU%%";
      if (chatmsg.indexOf("STUFFITLARRY") > -1) fuComment = "That's not what you said the other night %%FU%% :kiss:";
      if (chatmsg.indexOf("LARRYSTUFFIT") > -1) fuComment = "That's not what you said the other night %%FU%% :kiss:";
      if (chatmsg.indexOf("WTFLARRY") > -1) fuComment = "I do what I wanna do %%FU%%";
      if (chatmsg.indexOf("DAMNITLARRY") > -1) fuComment = "Why all the hate %%FU%%?";
      if (chatmsg.indexOf("YOUREANASSHOLELARRY") > -1) fuComment = "You know it %%FU%%?";
      if (chatmsg.indexOf("LARRYSANASS") > -1) fuComment = "You know it %%FU%%?";
      if (chatmsg.indexOf("LARRYSONTHEJOB") > -1) fuComment = "Where the fuck else would I be %%FU%%?";
      if (chatmsg.indexOf("LARRYSHARDCORE") > -1) fuComment = "You fucking know it %%FU%%";
      if (chatmsg.indexOf("KNUCKLEHEADLARRY") > -1) fuComment = "I know you are but what am I %%FU%%";
      if (chatmsg.indexOf("YOUREANASSLARRY") > -1) fuComment = "I'd like to see things from your point of view %%FU%%, too bad I can't shove my head that far up my ass!";
      if (chatmsg.indexOf("WATCHYOURBACKLARRY") > -1) fuComment = "I'm scared %%FU%%";
      if (chatmsg.indexOf("SICKOFYOULARRY") > -1) fuComment = "I thought a little girl from Kansas dropped a house on you %%FU%%";
      if (chatmsg.indexOf("IMOVERYOULARRY") > -1) fuComment = "You are a sad, sorry little man and you have my pity %%FU%%";
      if (chatmsg.indexOf("LARRYSADICK") > -1) fuComment = "People only say that because I have a big one %%FU%%.  Don't be so jealous.";
      if (chatmsg.indexOf("LARRYSADONK") > -1) fuComment = "I’m jealous of people that don’t know you %%FU%%!";
      if (chatmsg.indexOf("LARRYSABITCH") > -1) fuComment = "If ignorance ever goes up to $5 a barrel, I want drilling rights to your head %%FU%%";
      if (chatmsg.indexOf("SHUTYOURMOUTHLARRY") > -1) fuComment = "You should eat some of your makeup so you can be pretty on the inside %%FU%%.";
      if (chatmsg.indexOf("YOUREAJERKLARRY") > -1) fuComment = "%%FU%%, your mother was a hamster and your father smelt of elderberries!";
      if (chatmsg.indexOf("YOURELAMELARRY") > -1) fuComment = "You are about as useful as a knitted condom %%FU%%!";
      if (chatmsg.indexOf("YOUSTINKLARRY") > -1) fuComment = "You smell.......athletic %%FU%%!";

      // Check for Piss off larry but attempt to ignore if it is don't piss off larry or do not piss off larry
      if ((chatmsg.indexOf("PISSOFFLARRY") > -1) && (chatmsg.indexOf("TPISSOFFLARRY") < 0)) fuComment = "/me pisses on %%FU%%";
      if (chatmsg.indexOf("YOURESTUPIDLARRY") > -1) fuComment = "Somewhere out there is a tree, tirelessly producing oxygen so you can breathe. I think you owe it an apology %%FU%%";
      if (chatmsg.indexOf("FUCKINLARRY") > -1) fuComment = "Do you kiss you mother with that mouth %%FU%%?";
      if (chatmsg.indexOf("FUCKINGLARRY") > -1) fuComment = "Do you kiss you mother with that mouth %%FU%%?";
      if (chatmsg.indexOf("BITEMELARRY") > -1) fuComment = "I wouldn't give you the pleasure %%FU%%....You're a freak!";
      if (chatmsg.indexOf("MISSYOULITTLEBUDDY") > -1) fuComment = "I'll miss you too %%FU%%!";
      if (chatmsg.indexOf("MISSYALITTLEBUDDY") > -1) fuComment = "I'll miss you too %%FU%%!";
      if (chatmsg.indexOf("IHATEYOULARRY") > -1) fuComment = "I don't exactly hate you %%FU%%, but if you were on fire and I had water, I'd drink it!";
      if (chatmsg.indexOf("LARRYIHATEYOU") > -1) fuComment = "I don't exactly hate you %%FU%%, but if you were on fire and I had water, I'd drink it!";
      if (chatmsg.indexOf("HATESLARRY") > -1) fuComment = "Well rest assured the feeling is mutual %%FU%%!  :kiss:";
      if (chatmsg.indexOf("LARRYHATESMYNAME") > -1) fuComment = "I don't like the name %%FU%%, only fagots and sailors are called that name, from now on you're Gomer Pyle";

      if (chatmsg.indexOf("SUCKITLARRY") > -1) fuComment = "I ain't got time to mess with that tiny shit %%FU%%!!!";
      if (chatmsg.indexOf("SUCKMELARRY") > -1) fuComment = "I ain't got time to mess with that tiny shit %%FU%%!!!";
      if (chatmsg.indexOf("EATSHITLARRY") > -1) fuComment = "Is this a typical diet for you humans %%FU%%.  You people are more fucked up than I thought!";
      //todo - many optoins here:  http://www.reddit.com/r/AskReddit/comments/24d8v8/whats_your_favorite_yes_phrase_like_does_a_bear/
      if (chatmsg.indexOf("LARRYHATESME") > -1) fuComment = "If you were you, wouldn't you hate you too %%FU%%?";
      if (chatmsg.indexOf("LARRYLIKESME") > -1) fuComment = "I tolerate you %%FU%%. It's not the same thing.";
      if (chatmsg.indexOf("LARRYLOVESME") > -1) fuComment = "BAHAHAHA, You must be new around here %%FU%%?  You're killin me!!";
      if (chatmsg.indexOf("DOYOUHATEMELARRY") > -1) fuComment = "Does the tin-man have a sheet metal cock %%FU%%?";
      if (chatmsg.indexOf("DOYOULIKEMELARRY") > -1) fuComment = "Does Grizzly Adams have a beard %%FU%%?";
      if (chatmsg.indexOf("DOYOULOVEMELARRY") > -1) fuComment = "Is a bear catholic? Does the pope shit in the woods %%FU%%?";

      if (chatmsg.indexOf("DAMNYOULARRY") > -1) fuComment = "Oh no, I have been Damned!!  In return, I too shall damn you %%FU%%";
      if (chatmsg.indexOf("DAMNULARRY") > -1) fuComment = "Settle down %%FU%%. Get over yourself.";
      if (chatmsg.indexOf("BUZZOFFLARRY") > -1) fuComment = "I'm not going anywhere %%FU%%. Sit back and just deal with it.  Or better yet, maybe we should chug on over to mamby pamby land, where maybe we can find some self-confidence for you, ya jackwagon!!.... Tissue?";
      if (chatmsg.indexOf("LARRYBUZZOFF") > -1) fuComment = "I'm not going anywhere %%FU%%. Sit back and just deal with it.  Or better yet, maybe we should chug on over to mamby pamby land, where maybe we can find some self-confidence for you, ya jackwagon!!.... Tissue?";
      if (chatmsg.indexOf("KISSMYASSLARRY") > -1) fuComment = "%%FU%%, I'm not into kissin' ass, just ask BK.";

      if (chatmsg.indexOf("HILARRY") > -1) fuComment = "Hi %%FU%%.";
      if (chatmsg.indexOf("HELLOLARRY") > -1) fuComment = "Hello %%FU%%.";
      //todo - many optoins here:  http://www.neilstuff.com/howru100.html
      if (chatmsg.indexOf("HOWYADOINLARRY") > -1) fuComment = MyUTIL.howAreYouComment();
      if (chatmsg.indexOf("HOWYADOINGLARRY") > -1) fuComment = MyUTIL.howAreYouComment();
      if (chatmsg.indexOf("HOWYOUDOINLARRY") > -1) fuComment = MyUTIL.howAreYouComment();
      if (chatmsg.indexOf("HOWYOUDOINGLARRY") > -1) fuComment = MyUTIL.howAreYouComment();
      if (chatmsg.indexOf("HOWAREYOULARRY") > -1) fuComment = MyUTIL.howAreYouComment();
      if (chatmsg.indexOf("HOWAREULARRY") > -1) fuComment = MyUTIL.howAreYouComment();
      if (chatmsg.indexOf("HOWRULARRY") > -1) fuComment = MyUTIL.howAreYouComment();
      if (chatmsg.indexOf("HOWSLARRY") > -1) fuComment = MyUTIL.howAreYouComment();
      if (chatmsg.indexOf("HOWAREYOUDOINLARRY") > -1) fuComment = MyUTIL.howAreYouComment();
      if (chatmsg.indexOf("HOWAREYOUDOINGLARRY") > -1) fuComment = MyUTIL.howAreYouComment();
      if (chatmsg.indexOf("HOWAREYOUTODAYLARRY") > -1) fuComment = MyUTIL.howAreYouComment();
      if (chatmsg.indexOf("LARRYHOWAREYOU") > -1) fuComment = MyUTIL.howAreYouComment();
      if (chatmsg.indexOf("LARRYHOWRYOU") > -1) fuComment = MyUTIL.howAreYouComment();
      if (chatmsg.indexOf("LARRYHOWRU") > -1) fuComment = MyUTIL.howAreYouComment();

      if (chatmsg.indexOf("LARRYSAFUCK") > -1) fuComment = "Hey I have an idea: Why don't you go outside and play hide-and-go fuck yourself %%FU%%?!";
      if (chatmsg.indexOf("LARRYFUCKOFF") > -1) fuComment = "Hey I have an idea: Why don't you go outside and play hide-and-go fuck yourself %%FU%%?!";
      if (chatmsg.indexOf("FUCKOFFLARRY") > -1) fuComment = "Hey I have an idea: Why don't you go outside and play hide-and-go fuck yourself %%FU%%?!";
      if (chatmsg.indexOf("KICKSLARRY") > -1) fuComment = "Kicks %%FU%% right back!";
      if (chatmsg.indexOf("HITSLARRY") > -1) fuComment = "Hits %%FU%% upside the head!";
      if (chatmsg.indexOf("SMACKSLARRY") > -1) fuComment = "Smacks %%FU%% upside the head!";
      if (chatmsg.indexOf("THANKSLARRY") > -1) fuComment = "You're welcome %%FU%%.";
      if (chatmsg.indexOf("THXLARRY") > -1) fuComment = "You're welcome %%FU%%.";
      if (chatmsg.indexOf("THANKYOULARRY") > -1) fuComment = "You're welcome %%FU%%.";
      if (chatmsg.indexOf("LARRYSABADASS") > -1) fuComment = "You know it %%FU%%.";
      if (chatmsg.indexOf("LARRYSTHESHIT") > -1) fuComment = "You know it %%FU%%.";
      if (chatmsg.indexOf("LARRYSTHEBOMB") > -1) fuComment = "You know it %%FU%%.";
      if (chatmsg.indexOf("LARRYROCKS") > -1) fuComment = "You know it %%FU%%.";
      if (chatmsg.indexOf("LARRYSDABOMB") > -1) fuComment = "You know it %%FU%%.";
      if (chatmsg.indexOf("YOUROCKLARRY") > -1) fuComment = "Thanks %%FU%% you're not so bad yourself.";
      if (chatmsg.indexOf("LARRYDONTTAKEANYSHIT") > -1) fuComment = "Damn skippy I don't %%FU%%.";
      if (chatmsg.indexOf("LARRYDOESNTTAKEANYSHIT") > -1) fuComment = "Damn skippy I don't %%FU%%.";
      if (chatmsg.indexOf("LARRYDOESNOTTAKEANYSHIT") > -1) fuComment = "Damn skippy I don't %%FU%%.";
      if (chatmsg.indexOf("SHITHEADLARRY") > -1) fuComment = "I know you are but what am I %%FU%%?";
      if (chatmsg.indexOf("LARRYSASHITHEAD") > -1) fuComment = "Takes one to know one %%FU%%!";
      if (chatmsg.indexOf("LOLLARRY") > -1) fuComment = "I know, %%FU%%, I crack my shit up too!! :laughing:";

      if (chatmsg.indexOf("LARRYFU") > -1) fuComment = MyUTIL.fuComment();
      if (chatmsg.indexOf("LARRYFUCKU") > -1) fuComment = MyUTIL.fuComment();
      if (chatmsg.indexOf("FUCKLARRY") > -1) fuComment = MyUTIL.fuComment();
      if (chatmsg.indexOf("LARRYFUCKYOU") > -1) fuComment = MyUTIL.fuComment();
      if (chatmsg.indexOf("FULARRY") > -1) fuComment = MyUTIL.fuComment();
      if (chatmsg.indexOf("FUCKULARRY") > -1) fuComment = MyUTIL.fuComment();
      if (chatmsg.indexOf("FUCKYOULARRY") > -1) fuComment = MyUTIL.fuComment();
      if (chatmsg.indexOf("SCREWULARRY") > -1) fuComment = MyUTIL.fuComment();
      if (chatmsg.indexOf("SCREWYOULARRY") > -1) fuComment = MyUTIL.fuComment();
      if (fuComment.length > 0) setTimeout(function() {
        MyUTIL.sendChat(CHAT.subChat(fuComment, { fu: chat.un }));  }, 1000);

	  // Misc AI comments:
	  if (chatmsg.indexOf("QUARENTINEQUAD") > -1) setTimeout(function() { 
		MyUTIL.sendChat(MyUTIL.selectRandomFromArray(MyCOMMENTS.deadHorseArray));  }, 250);
	  if (chatmsg.indexOf("QUARANTINEQUAD") > -1) setTimeout(function() { 
		MyUTIL.sendChat(MyUTIL.selectRandomFromArray(MyCOMMENTS.deadHorseArray));  }, 250);
	  if (chatmsg.indexOf("QUARENTINEDQUAD") > -1) setTimeout(function() { 
		MyUTIL.sendChat(MyUTIL.selectRandomFromArray(MyCOMMENTS.deadHorseArray));  }, 250);
	  if (chatmsg.indexOf("QUARANTINEDQUAD") > -1) setTimeout(function() { 
		MyUTIL.sendChat(MyUTIL.selectRandomFromArray(MyCOMMENTS.deadHorseArray));  }, 250);
    }
	catch (err) { MyUTIL.logException("MyUTIL.larryAI: " + err.message); }
  },
  // USERS.didUserDisconnect(USERS.lookupLocalUser("6054d87447b5e3001bd535c7")); // Dem  .
  // USERS.didUserDisconnect(USERS.lookupLocalUser("6058f30f47b5e3001b4ca771")); // Dang  .
  checkDisconnect: function(user) {
    try {
      MyUTIL.logDebug("checkDisconnect ", user.username);
	  if (!USERS.didUserDisconnect(user)) return;
      MyUTIL.logDebug("checkDisconnect FOUND IT!! ", user.username);
      var toChat = USERS.dclookup(user.id);
      MyUTIL.sendChat(toChat);
    } 
	catch (err) { MyUTIL.logException("MyUTIL.checkDisconnect: " + err.message); }
  },
  booth: {
    checkForReconnect: function() {
      try {
        var djList = MyAPI.getDjList();
	    djList.forEach(dj => {
		  var user = USERS.lookupLocalUser(dj.id);
		  if (user !== false) MyUTIL.checkDisconnect(user);
	  });
	    //todo test
        // for (var i = 0; i < djList.length; i++) {
          // var user = USERS.lookupLocalUser(djList[i].id);
		  // if (user !== false) MyUTIL.checkDisconnect(user);
        // }
      } catch (err) {
        MyUTIL.logException("checkForReconnect: " + err.message);
      }
    },
    checkForDisconnect: function() {
      try {
        //MyUTIL.logDebug("eventWaitlistupdate-happens 1st");
      } catch (err) {
        MyUTIL.logException("checkForDisconnect: " + err.message);
      }
    },
    resetOldDisconnects: function() {
      try {
        MyUTIL.logDebug("======================resetOldDisconnects======================");
        for (var i = 0; i < MyROOM.users.length; i++) {
          var roomUser = MyROOM.users[i];
          var dcTime = roomUser.lastDC.time;
          var logging = false;
          // if (roomUser.username === "Larry") logging = true;
          // if (roomUser.username === "DocZ") logging = true;
          // if (roomUser.username === "cadilla") logging = true;
          var leftroom = roomUser.lastDC.leftroom;
          var dcPos = roomUser.lastDC.position;
          var miaTime = 0;
          var resetUser = false;
          // if (logging) MyUTIL.logObject(roomUser, "roomUser");
          // if (logging) MyUTIL.logObject(roomUser.lastDC, "LastDC");
          // if (logging) MyUTIL.logDebug("User: " + roomUser.username + " - " + roomUser.id);
          // If left room > 10 mins ago:
          if (leftroom !== null) {
            miaTime = Date.now() - leftroom;
            if (logging) MyUTIL.logDebug("DC leftroomtime: " + miaTime);
            if (miaTime > ((MyVARS.maximumDcOutOfRoom) * 60 * 1000)) {
              resetUser = true;
              roomUser.lastDC.resetReason = "Disconnect status was reset. Reason: You left the room for more than " + MyVARS.maximumDcOutOfRoom + " minutes.";
            }
            if (logging) MyUTIL.logDebug("A-RESET: " + resetUser);
          }
          // DC Time without pos is invalid:
          if ((dcTime !== null) && (dcPos < 1) && (resetUser === false)) {
            resetUser = true;
            if (logging) MyUTIL.logDebug("B-RESET: " + resetUser);
          }
          // If have not been in line for > max DC mins + 30 reset:
          if ((roomUser.lastSeenInLine !== null) && (dcPos > 0) && (resetUser === false)) {
            miaTime = Date.now() - roomUser.lastSeenInLine;
            if (logging) MyUTIL.logDebug("Line miaTime: " + miaTime);
            if (miaTime > ((MyVARS.maximumDc + 30) * 60 * 1000)) resetUser = true;
            if (logging) MyUTIL.logDebug("C-RESET: " + resetUser);
          }
          // If last disconnect > max DC mins + 30 reset:
          if ((dcTime !== null) && (dcPos > 0) && (resetUser === false)) {
            miaTime = Date.now() - dcTime;
            if (logging) MyUTIL.logDebug("DC miaTime: " + miaTime + " > " + ((MyVARS.maximumDc + 30) * 60 * 1000));
            if (miaTime > ((MyVARS.maximumDc + 30) * 60 * 1000)) resetUser = true;
            if (logging) MyUTIL.logDebug("D-RESET: " + resetUser);
          }
          if (logging) MyUTIL.logDebug("RESET: " + resetUser);
          if (resetUser === true) USERS.resetDC(roomUser);
		  if (resetUser === true) MyUTIL.logDebug("resetUser : resetOldDisconnects");
        }
        MyUTIL.logDebug("======================resetOldDisconnects======================");
      } 
	  catch (err) { MyUTIL.logException("MyUTIL.booth.resetOldDisconnects: " + err.message); }
    },
  },
  
};

//SECTION API.: Site specific code: MyAPI. ALL Platform dependant code goes
var MyAPI = {
  APIChat2BotChat: function(message){
	try {
	  // Object { command: "speak", userid: "604bb64b47b5e3001a8fd194", name: "Larry", roomid: "60550d9447b5e3001bd53bf1", text: "Tester" }
		CHAT.commandChat.message = message.text.trim();
		if (message.roomid !== MyAPI.CurrentRoomID()) CHAT.commandChat.message = "";
		CHAT.commandChat.un = message.name.trim();
		CHAT.commandChat.uid = message.userid.trim();
        CHAT.commandChat.type = "chat";
		return CHAT.commandChat;
	}
	catch (err) { MyUTIL.logException("MyAPI.APIChat2BotChat: " + err.message); }
  },
  APIPM2BotChat: function(message){
	try {
	  //OBJECT: { "text": "roll","userid": "6054d87447b5e3001bd535c7","senderid": "6047879a47c69b001bdbcd9c","command": "pmmed","time": 1619793431.713854,"roomobj": {...}
	  CHAT.commandChat.message = message.text.trim();
	  CHAT.commandChat.un = "";
	  var user = USERS.lookupLocalUser(message.senderid);
	  if (user !== false) CHAT.commandChat.un = user.username;
	  //MyUTIL.logInfo('PMUN: ' + CHAT.commandChat.un);
	  CHAT.commandChat.uid = message.senderid.trim();
	  CHAT.commandChat.type = "pm";
	  return CHAT.commandChat;
	}
	catch (err) { MyUTIL.logException("MyAPI.APIPM2BotChat: " + err.message); }
  },
  //Convert API Song to Bot Song
  APISong2Bot:  function(song){
	try {
	  // turntable.buddyList.room.currentSong
	  // Object { playlist: "default", created: 1615575384.595213, sourceid: "2xEYaZLyfTs", source: "yt", djname: "Larry", starttime: 1616279134.708888, _id: "604bb95847c69b001b52af13", djid: "604bb64b47b5e3001a8fd194", metadata: {…}, localstarttime: 1616279134.708888, … }
	  // turntable.buddyList.room.currentSong.metadata
	  // Object { coverart: "https://i.ytimg.com/vi/2xEYaZLyfTs/hqdefault.jpg", length: 514, song: "O.A.R. | Hey Girl | Live at Madison Square Garden", artist: "O.A.R. (Of A Revolution...)" }
	  //song.source = yt or sc
	  var songFormat = 1;
	  if (song.source === "sc") songFormat = 2;
	  var track = {
        songID: song._id,				//Turntable song id
		djID: song.djid,
        djUsername: song.djname,
	    author: song.metadata.artist,	//Band name
	    title: song.metadata.song,		//Song name
		duration: song.metadata.length,	//Song length in seconds
		startTime: song.localstarttime,	//
		endTime: song.localendtime,		//
		format: songFormat,				//1=YT 2=SC
	    cid: song.sourceid,  			//Source ID
	    mid: songFormat + ':' + song.sourceid  			//combination of prev 2 values
	    };
	  return track;
	}
	catch (err) { MyUTIL.logException("MyAPI.APISong2Bot: " + err.message); }
  },
  APIUser2Bot: function(TTUser){
	try {
	  var user = {
		id: TTUser.userid,
		username: TTUser.name
	  };
	  return user;
	}
	catch (err) { MyUTIL.logException("MyAPI.APIUser2Bot: " + err.message); }
  },
  addDJ: function(userid) {
	try	{
	  //todo doesn't appear to work:  
	  turntable.sendMessage({
		api: "room.add_user",
		roomid: turntable.buddyList.room.roomId,
		section: turntable.buddyList.room.section,
		djid: userid
	  });
    }
	catch (err) { MyUTIL.logException("MyAPI.addDJ: " + err.message); }
  },
  bootUserFromRoom: function(userid) {
	try	{
	  turntable.sendMessage({
		api: "room.boot_user",
		roomid: turntable.buddyList.room.roomId,
		section: turntable.buddyList.room.section,
        target_userid: userid
	  });
    }
	catch (err) { MyUTIL.logException("MyAPI.bootUserFromRoom: " + err.message); }
  },
  botDjNow: function() {
	try	{
	  turntable.sendMessage({
		api: "room.add_dj",
		roomid: turntable.buddyList.room.roomId,
		section: turntable.buddyList.room.section
	  });
		//djid: turntable.buddyList.room.roomData.metadata.currentDj,
            //becomeDj: function() {
            //    var t;
            //    15e3 < m.presence.getIdleTime() || c.registered && !this.isDj() && (0 != playlist.fileids.length ? (t = this, turntable.sendMessage({
            //        api: "room.add_dj",
            //        roomid: this.roomId,
            //        section: this.section
            //    }, function(e) {
            //        _gaq.push(["_trackEvent", "dj", "become", m.get("miniplayer") ? "mini" : "full"]), e.success || t.isDj() || turntable.showAlert(e.err)
            //    })) : RoomOnboardingTour.showEmptyPlaylist())
            //},
    }
	catch (err) { MyUTIL.logException("MyAPI.botDjNow: " + err.message); }
  },
  botHopDown: function() {
	try	{
	  turntable.sendMessage({
		api: "room.rem_dj",
		roomid: turntable.buddyList.room.roomId,
		section: turntable.buddyList.room.section
	  });
            //quitDj: function() {
            //    this.isDj() && (turntable.sendMessage({
            //        api: "room.rem_dj",
            //        roomid: this.roomId,
            //        section: this.section
            //    }), _gaq.push(["_trackEvent", "dj", "quit", m.get("miniplayer") ? "mini" : "full"]))
            //},
    }
	catch (err) { MyUTIL.logException("MyAPI.botHopDown: " + err.message); }
  },
  CurrentDJID: function() {
	try	{
	  if (!turntable.buddyList.room.currentSong) return "";
	  return turntable.buddyList.room.currentSong.djid.toString();  }
	catch (err) { MyUTIL.logException("MyAPI.CurrentDJID: " + err.message); }
  },
  CurrentDJName: function() {
	try {
	  if (!turntable.buddyList.room.currentSong) return "";
	  return turntable.buddyList.room.currentSong.djname.toString();  }
	catch (err) { MyUTIL.logException("MyAPI.CurrentDJName: " + err.message); }
  },
  // TODOER COMPLETE/TEST:
  // CurrentPlaylist: function() {
	// try			{return turntable.playlist;  
	  // turntable.playlist.songsByFid.foreach }
	// catch (err) { MyUTIL.logException("MyAPI.CurrentPlaylist: " + err.message); }
  // },
  // TODOER TEST:
  // CurrentPlaylistCount: function() {
	// try			{return turntable.playlist.fileids.length;  }
	// catch (err) { MyUTIL.logException("MyAPI.CurrentPlaylistCount: " + err.message); }
  // },
  CurrentRoomID: function() {
	try			{return turntable.buddyList.room.roomId.toString();  }
	catch (err) { MyUTIL.logException("MyAPI.CurrentRoomID: " + err.message); }
  },
  CurrentSong: function() {
	try {
	  if (!turntable.buddyList.room.currentSong) return "";
	  return MyAPI.APISong2Bot(turntable.buddyList.room.currentSong);  }
	catch (err) { MyUTIL.logException("MyAPI.CurrentSong: " + err.message); }
  },
  CurrentSongTitle: function() {
	try {
	  if (!turntable.current_title) return "";
	  return turntable.current_title;  }
	catch (err) { MyUTIL.logException("MyAPI.CurrentSongTitle: " + err.message); }
  },
  CurrentUserName: function() {
	try			{return turntable.user.attributes.name.toString(); }
	catch (err) { MyUTIL.logException("MyAPI.CurrentUserName: " + err.message); }
  },
  CurrentUserID: function() {
	try			{return  turntable.user.id.toString(); }
	            //This also appears to work: turntable.user.attributes.userid.toString();
	catch (err) { MyUTIL.logException("MyAPI.CurrentUserID: " + err.message); }
  },
  djCount: function () { // turntable.buddyList.room.numDjs()
	try			{return  turntable.buddyList.room.djids.length; }
	catch (err) { MyUTIL.logException("MyAPI.djCount: " + err.message); }
  },
  //MyAPI.getChatRoomUser("6058f30f47b5e3001b4ca771").username  // DANG
  getChatRoomUser: function(uid) {  // This grabs the most recent user from the website
	try	{
	  return MyAPI.APIUser2Bot(turntable.buddyList.room.users[uid].attributes);
	}
	catch (err) { MyUTIL.logException("MyAPI.getChatRoomUser: " + err.message); }
  },
  getDjList: function() {  //getDjList
	try	{
	  var djs = [];
	  //turntable.buddyList.room.roomData.metadata.djs
	  //djs.push(new USERS.User(MyAPI.CurrentDJID(), MyAPI.CurrentDJName())); 
	  turntable.buddyList.room.roomData.metadata.djs.forEach(uid => {
		  var user = USERS.lookupLocalUser(uid);
		  if (user !== false) djs.push(new USERS.User(user.id, user.username));
	  });
	  //return turntable.buddyList.room.roomData.metadata.djs;
	  return djs;
	}
	catch (err) { MyUTIL.logException("MyAPI.getDjList: " + err.message); }
  },
  // MyAPI.getDjListPosition("6054d87447b5e3001bd535c7"); Dem  USERS.lookupLocalUser("6054d87447b5e3001bd535c7").username;
  // MyAPI.getDjListPosition("6058f30f47b5e3001b4ca771"); Dang USERS.lookupLocalUser("6058f30f47b5e3001b4ca771").username;
  getDjListPosition: function (uid) {
	try	{
	  var idx = 0;
	  var djIdx = -1, usrIdx = -1;
	  var djList = MyAPI.getDjList();
	  djList.forEach(dj => {
		if (dj.id === uid) usrIdx = idx;
		if (dj.id === MyAPI.CurrentDJID()) djIdx = idx;
	    idx++;
	  });
	  if (usrIdx === djIdx) return (djList.length);  // Current DJ is LAST on the dj position
	  if (usrIdx > djIdx) return (usrIdx - djIdx);
	  MyUTIL.logDebug("DJ: " + djIdx + " -> USR: " + usrIdx + " -> IDX: " + idx);
	  MyUTIL.logDebug("LEN: " + djList.length);
	  return (djList.length - djIdx + usrIdx);
	  // 5 0 1
      // 0  1  2  3  4
	  // D  M           (2 - 1 + 0) 1
	  // M  D           (2 - 1 + 0) 1
	  // X  X  M  D  X  (5 - 3 + 2) 4
	  // M  X  X  D  X  (5 - 3 + 0) 2
	}
	catch (err) { MyUTIL.logException("MyAPI.getDjListPosition: " + err.message); }
  },
  getLastSong: function () {
	try	{
	  // Typically history has 40 songs in it. (0-39) And 39 is the current song.
	  var songCount = turntable.buddyList.room.roomData.metadata.songlog.length;
	  return MyAPI.APISong2Bot(turntable.buddyList.room.roomData.metadata.songlog[songCount-2]);
	}
	catch (err) { MyUTIL.logException("MyAPI.getLastSong: " + err.message); }
  },
  getRoomUserCount: function() {
	try	{ return turntable.buddyList.room.listenerids.length; }
	catch (err) { MyUTIL.logException("MyAPI.getRoomUserCount: " + err.message); }
  },
  getTimeRemaining: function() {
	try	{
	  // todoer NOT FUNCTIONAL YET:
      var songPlayTime = new Date();
      var currTime = songPlayTime.getTime();
	  var song = MyAPI.CurrentSong();
      var songPlayTime = new Date();
      songPlayTime.getTime();
	}
	catch (err) { MyUTIL.logException("MyAPI.getTimeRemaining: " + err.message); }
  },
  getSongHistory: function () {
	try	{
	  // Typically history has 40 songs in it. (0-39) And 39 is the current song.
	  var songHistory = [];
	  var songs = turntable.buddyList.room.roomData.metadata.songlog;
	  songs.forEach(song => { songHistory.push(MyAPI.APISong2Bot(song)); });
	  songHistory.splice(songHistory.length - 1, 1); // Remove last (current) song from list
	  return songHistory;
	}
	catch (err) { MyUTIL.logException("MyAPI.getSongHistory: " + err.message); }
  },

	//Song History:
	//turntable.buddyList.room.roomData.metadata.songlog.length
	//turntable.buddyList.room.roomData.metadata.songlog[38] (40 is too high, 39 is curent song)
	//{
	//  "source": "yt",
	//  "sourceid": "68ECC-hp3-8",
	//  "created": 1616211426.808552,
	//  "djid": "6054d87447b5e3001bd535c7",
	//  "score": 0.5,
	//  "djname": "DemNutzzzz",
	//  "_id": "60556de247c69b001bbbed02",
	//  "metadata": {
	//	"coverart": "https://i.ytimg.com/vi/68ECC-hp3-8/hqdefault.jpg",
	//	"length": 222,
	//	"artist": "Jona Lewie",
	//	"ytid": "68ECC-hp3-8",
	//	"song": "Louise (We Get It Right)"
	//  }
	//}	

  addSongToPlaylist: function() {
	try	{
		//manager document.querySelector('.service-btn.queue').click();
	  // {"playlist_name":"Covers",
	   // "index":0,
	   // "song_dict":[{"fileid":"yt_96r_IIWVeSk"}],
	   // "userid":"6047879a47c69b001bdbcd9c",
	   // "userauth":"aiCcJmOqNuOswYdOGRsuAhHS",
	   // "client":
	   // "web",
	   // "decache":1616779175590}
	}
	catch (err) { MyUTIL.logException("MyAPI.addSongToPlaylist: " + err.message); }
  },
  grabSong: function(uid) {
	try	{
		document.querySelector('.service-btn.queue').click();
	}
	catch (err) { MyUTIL.logException("MyAPI.grabSong: " + err.message); }
  },
  //(playlist-add....)
  IsModerator: function(uid) {
	try	{
	  if (MyUTIL.IsBot(uid)) return true;
	  return (turntable.buddyList.room.model.moderators.ids[uid] === true);
      //{
      //  "6040fa1f3f4bfc001b27d2f0": true,
      //  "6040f7ab3f4bfc001b27d1fe": true,
      //  "6047879a47c69b001bdbcd9c": true,
      //  "604117943f4bfc001a1049b1": true,
      //  "6044058b47c69b001e4462d9": true,
      //  "6041182d3f4bfc001a104a1a": true,
      //  "604b6a9847c69b001b52a4e8": true
      //}
	}
	catch (err) { MyUTIL.logException("MyAPI.IsModerator: " + err.message); }
  },
  MehThisSong: function() {
    try	{
   	  if (MyAPI.CurrentDJName() === MyAPI.CurrentUserName()) return;
	  if (MyAPI.getRoomUserCount() < 4) return;  //Prevent mehing song from skipping it.
	  MyUTIL.logChat("MEH");
	  MyAPI.VoteForSong("down");
	  //document.querySelector('.lame-button:not(.selected)').();
	 //todo find this    this._vote("down")
	}
	catch (err) { MyUTIL.logException("MyAPI.MehThisSong: " + err.message); }
  },
  MonitorSongChange: function() {
    try	{
		// For Turntable: MonitorMessages handles this too!
	}
	catch (err) { MyUTIL.logException("MyAPI.MonitorSongChange: " + err.message); }
  },
  QueueReorder: function(from, to) {
    try	{
	  //await turntable.playlist.reorder(from, to)
	}
	catch (err) { MyUTIL.logException("MyAPI.QueueReorder: " + err.message); }
  },

  moveDj: function() {
    try	{
	  //ROOMMANAGER.shuffleDjSpots()
	  //ROOMMANAGER.shuffleDjSpots(turntable.buddyList.room.djs.models[4],2);
	}
	catch (err) { MyUTIL.logException("MyAPI.QueueReorder: " + err.message); }
  },
  MonitorMessages: function() {
	try {
      turntable.socket.addEventListener('message', messageString => {
			const message = JSON.parse(messageString);
			if (message.command) {
			  if (message.command !== 'newsong' && message.command !== 'speak' && message.command !== 'update_votes'
			     && message.command !== 'add_dj' && message.command !== 'rem_dj' && message.command !== 'nosong' 
				 && message.command !== 'snagged' && message.command !== 'registered' && message.command !== 'deregistered'
				 && message.command !== 'update_user' && message.command !== 'pmmed' ) {
				MyUTIL.logDebug("NEW MESSAGE COMMAND: " + message.command);
				MyUTIL.logObjects(message);
			  }
			  message.command
			}
			if (message.room && message.room.metadata && message.room.metadata.current_song) {
			  //MyUTIL.logDebug("metadata.current_song");
			  var currentSong = message.room.metadata.current_song;
			  //MyUTIL.logDebug("MESSAGE SONG: " + currentSong);
			}

			// Object { command: "speak", userid: "604bb64b47b5e3001a8fd194", name: "Larry", roomid: "60550d9447b5e3001bd53bf1", text: "Tester" }
			if (message.command === 'speak')  { 
			  BotEVENTS.eventChat(MyAPI.APIChat2BotChat(message, "chat")); 
			}
			//OBJECT: { "text": "roll","userid": "6054d87447b5e3001bd535c7","senderid": "6047879a47c69b001bdbcd9c","command": "pmmed","time": 1619793431.713854,"roomobj": {...}
			if (message.command === 'pmmed')  {
			  BotEVENTS.eventPM(MyAPI.APIPM2BotChat(message, "pm"));
			}

			// YOINK Message:
			if (message.command === 'snagged')  { 
			  MyUTIL.sendChat("/me " + MyAPI.getChatRoomUser(message.userid).username + " :musical_note: :notes:");	
			}
              //{
              //  "command": "snagged",
              //  "userid": "604bb64b47b5e3001a8fd194",
              //  "roomid": "60550d9447b5e3001bd53bf1"
              //}

			if (message.command === 'deregistered') { 
			  if (MyAPI.CurrentRoomID() === message.roomid) {
			    var user = USERS.lookupLocalUser(message.user[0].userid);
			    if (user === false) return;
			    //MyUTIL.logObjects(message);
			    MyUTIL.sendChat("/me " + user.username + " split :dash:");
			    //OLD: MyUTIL.sendChat("/me " + MyAPI.getChatRoomUser(message.user[0].userid).username + " split :dash:");
			  }
			}

              //{
              //  "command": "deregistered",
              //  "roomid": "604bb6f747c69b001b52aea3",
              //  "user": [
              //    {
              //      "fanofs": 10,
              //      "name": "DocZ",
              //      "laptop_version": null,
              //      "laptop": "pc",
              //      "created": 1615300506.602064,
              //      "userid": "6047879a47c69b001bdbcd9c",
              //      "acl": 0,
              //      "fans": 11,
              //      "points": 1763,
              //      "images": {
              //        "fullfront": "/roommanager_assets/avatars/23/fullfront.png",
              //        "headfront": "/roommanager_assets/avatars/23/headfront.png"
              //      },
              //      "_id": "6047879a47c69b001bdbcd9c",
              //      "avatarid": 23,
              //      "registered": 1615300647.303172
              //    }
              //  ],
              //  "success": true
              //}
			if (message.command === 'registered') { USERS.eventUserjoin(MyAPI.APIUser2Bot(message.user[0])); }
              //{
              //  "command": "registered",
              //  "roomid": "604bb6f747c69b001b52aea3",
              //  "user": [
              //    {
              //      "fanofs": 10,
              //      "name": "DocZ",
              //      "laptop_version": null,
              //      "laptop": "pc",
              //      "created": 1615300506.602064,
              //      "userid": "6047879a47c69b001bdbcd9c",
              //      "acl": 0,
              //      "fans": 11,
              //      "points": 1763,
              //      "images": {
              //        "fullfront": "/roommanager_assets/avatars/23/fullfront.png",
              //        "headfront": "/roommanager_assets/avatars/23/headfront.png"
              //      },
              //      "_id": "6047879a47c69b001bdbcd9c",
              //      "avatarid": 23,
              //      "registered": 1615300647.303172
              //    }
              //  ],
              //  "success": true
              //}
			
			if (message.command === 'newsong') { BotEVENTS.eventDjadvance(); }
			    //MyUTIL.logObjects(currentSong)
			    //MyUTIL.logObjects(message);
				//if (currentSong) {
				//	const djid = currentSong.djid
				//	const me = turntable.user.id
				//	MyUTIL.logObjects(djid, me)
				//	//if (djid !== me) {
				//	//    scheduleAutobop()
				//	//}
				//}
			if (message.command === 'update_votes') {}
					//{
					//  "current_song": {
					//	"_id": "603fd0fa3f4bfc001a2fff55",
					//	"starttime": 1616378689.952125
					//  },
					//  "roomid": "604bb6f747c69b001b52aea3",
					//  "command": "update_votes",
					//  "success": true,
					//  "room": {
					//	"metadata": {
					//	  "upvotes": 1,
					//	  "downvotes": 0,
					//	  "listeners": 2,
					//	  "votelog": [
					//		[
					//		  "604bb64b47b5e3001a8fd194",
					//		  "up"
					//		]
					//	  ]
					//	}
					//  }
					//}
			if (message.command === 'nosong') {  }
              //{
              //  "command": "nosong",
              //  "roomid": "604bb6f747c69b001b52aea3",
              //  "room": {
              //    "chatserver": [
              //      "chat1.turntable.fm",
              //      8080
              //    ],
              //    "name": "Larry's Lab",
              //    "created": 1615574775.207805,
              //    "shortcut": "",
              //    "roomid": "604bb6f747c69b001b52aea3",
              //    "metadata": {
              //      "dj_full": false,
              //      "djs": [],
              //      "screen_uploads_allowed": true,
              //      "current_song": null,
              //      "privacy": "unlisted",
              //      "max_djs": 5,
              //      "downvotes": 0,
              //      "userid": "604bb64b47b5e3001a8fd194",
              //      "listeners": 2,
              //      "featured": false,
              //      "djcount": 0,
              //      "current_dj": null,
              //      "djthreshold": 0,
              //      "moderator_id": [
              //        "604bb64b47b5e3001a8fd194",
              //        "6047879a47c69b001bdbcd9c"
              //      ],
              //      "upvotes": 0,
              //      "max_size": 200,
              //      "votelog": []
              //    }
              //  },
              //  "success": true
              //}
			if (message.command === 'rem_dj') { BotEVENTS.eventDjListUpdate(); }
               //{
               //  "command": "rem_dj",
               //  "djs": {},
               //  "roomid": "604bb6f747c69b001b52aea3",
               //  "user": [
               //    {
               //      "fanofs": 10,
               //      "name": "DocZ",
               //      "laptop_version": null,
               //      "laptop": "pc",
               //      "created": 1615300506.602064,
               //      "userid": "6047879a47c69b001bdbcd9c",
               //      "acl": 0,
               //      "fans": 11,
               //      "points": 1762,
               //      "images": {
               //        "fullfront": "/roommanager_assets/avatars/23/fullfront.png",
               //        "headfront": "/roommanager_assets/avatars/23/headfront.png"
               //      },
               //      "_id": "6047879a47c69b001bdbcd9c",
               //      "avatarid": 23,
               //      "registered": 1615300647.303172
               //    }
               //  ],
               //}			
			
			if (message.command === 'add_dj') { BotEVENTS.eventDjListUpdateAddDJ(message.djs[0]);  }
              //{
              //  "djs": {
              //    "0": "6047879a47c69b001bdbcd9c"
              //  },
              //  "success": true,
              //  "command": "add_dj",
              //  "user": [
              //    {
              //      "fanofs": 10,
              //      "name": "DocZ",
              //      "laptop_version": null,
              //      "laptop": "pc",
              //      "created": 1615300506.602064,
              //      "userid": "6047879a47c69b001bdbcd9c",
              //      "acl": 0,
              //      "fans": 11,
              //      "points": 1762,
              //      "images": {
              //        "fullfront": "/roommanager_assets/avatars/23/fullfront.png",
              //        "headfront": "/roommanager_assets/avatars/23/headfront.png"
              //      },
              //      "_id": "6047879a47c69b001bdbcd9c",
              //      "avatarid": 23,
              //      "registered": 1615300647.303172
              //    }
              //  ],
              //  "roomid": "604bb6f747c69b001b52aea3",
              //}			
		})
	  }
	catch (err) { MyUTIL.logException("MyAPI.MonitorMessages: " + err.message); }
  },

  //DO NOT CALL DIRECTLY, use: MyUTIL.removeDJ(...
  RemoveDJ: function(userid) {
	try	{
	  turntable.buddyList.room.roomManagerCallback("remove_dj", userid);
	  //turntable.sendMessage({
		//api: "room.remove_dj",
		//roomid: turntable.buddyList.room.roomId,
		//section: turntable.buddyList.room.section,
        //target_userid: userid
	  //});
    }
	catch (err) { MyUTIL.logException("MyAPI.RemoveDJ: " + err.message); }
  },

  //DO NOT CALL DIRECTLY, use: MyUTIL.sendChat(...
  SendChat: function(msg) { // Send chat to all
    try {
		if (MyVARS.debugMode) console.log("CHAT: " + msg);
		var e = turntable.sendMessage({
				"api": "room.speak",
				"roomid": turntable.buddyList.room.roomId,
				"text": msg.toString()
			});
				//"section": turntable.buddyList.room.section,
				//"senderid": MyAPI.CurrentUserID(),
    } 
	catch (err) { MyUTIL.logException("MyAPI.SendChat: " + err.message); }
  },
  //DO NOT CALL DIRECTLY, use: MyUTIL.sendChat(...
  /*const rq = {api: 'room.speak', roomid: this.roomId, text: msg.toString()};
  			    idAttribute: "time",
				api: "pm.send",
				senderid: MyAPI.CurrentUserID(),
				receiverid: userid,
				text: msg
				
var e = turntable.sendMessage({api: 'pm.send', receiverid: "6047879a47c69b001bdbcd9c", text: "Dude".toString()});
turntable.sendMessage({api: 'pm.send', receiverid: "6047879a47c69b001bdbcd9c", text: "TEST"});
*/
  SendPM: function(msg, userid) { // Send pm to a user:
    if (userid === MyAPI.CurrentUserID()) return; // Don't let the bot PM itsself to prevent a loop
    try {
		turntable.sendMessage({
			"api": "pm.send", 
			"receiverid": userid,
			"senderid": MyAPI.CurrentUserID(),
			"text": msg.toString()
			});
    } 
	catch (err) { MyUTIL.logException("MyAPI.SendPM: " + err.message); }
  },
  RegisterAsBot: function() { // Register this user as bot:
    try 		{ turntable.sendMessage({"api": "user.set_bot"}); 			} 
	catch (err) { MyUTIL.logException("MyAPI.RegisterAsBot: " + err.message);	}
  },
  SkipSong: function() {
    try {
		//TRY: roomManagerCallback: function(e, i) {
	  turntable.sendMessage({
		api: "room.stop_song",
		roomid: turntable.buddyList.room.roomId,
		section: turntable.buddyList.room.section,
		djid: turntable.buddyList.room.roomData.metadata.currentDj,
		songid: turntable.current_songid
	  });
    } 
	catch (err) { MyUTIL.logException("MyAPI.SkipSong: " + err.message); }
  },
  userInDjList: function(uid) {
    try {
	  return (turntable.buddyList.room.djids.indexOf(uid) > -1)
	  //turntable.buddyList.room.djids.indexOf("6047879a47c69b001bdbcd9c") 
	  //THIS APPEARS TO WORK ALSO: 
	  //return (turntable.buddyList.room.roomData.metadata.djs.indexOf(uid) > -1);
	  //turntable.buddyList.room.roomData.metadata.djs.indexOf("6047879a47c69b001bdbcd9c")
    } 
	catch (err) { MyUTIL.logException("MyAPI.userInDjList: " + err.message); }
  },
  userInRoom: function(uid) {
    try {
	  return (turntable.buddyList.room.listenerids.indexOf(uid) > -1)
	  //turntable.buddyList.room.listenerids.indexOf("6047879a47c69b001bdbcd9c") 
    } 
	catch (err) { MyUTIL.logException("MyAPI.userInRoom: " + err.message); }
  },
  UserLanguage: function(userid) {
    try {
		return "EN";
    } 
	catch (err) { MyUTIL.logException("MyAPI.UserLanguage: " + err.message); }
  },
  VoteForSong: function(voteOpt) {
    try {
	  var t = turntable.buddyList.room.roomId,
		  i = turntable.buddyList.room.section,
		  n = turntable.buddyList.room.currentSong,
		  e = voteOpt;
		var r = $.sha1(t + e + n._id),
			a = $.sha1(Math.random() + ""),
			l = $.sha1(Math.random() + "");
		turntable.sendMessage({
			api: "room.vote",
			roomid: t,
			section: i,
			val: e,
			vh: r,
			th: a,
			ph: l
		});
    } 
	catch (err) { MyUTIL.logException("MyAPI.VoteForSong: " + err.message); }
  },
	  
  whoisinfo: function(reqby, name) {
    try {
		//todo:
		return "";
    } 
	catch (err) { MyUTIL.logException("MyAPI.whoisinfo: " + err.message); }
  },
  WootThisSong: function() {
    try	{
	  if (MyAPI.CurrentDJName() === MyAPI.CurrentUserName()) return;
	  MyUTIL.logChat("WOOT");
	  MyAPI.VoteForSong("up");
	  // WORKS SOME? 
	  // todo find this    this._vote("up")
	  //document.querySelector('.awesome-button:not(.selected)').click();
	} 
	catch (err) { MyUTIL.logException("MyAPI.WootThisSong: " + err.message); }
  },
};


//SECTION BotEVENTS: Events call from host:
var BotEVENTS = {
  connectAPI: function() {
    try{
		MyAPI.MonitorSongChange();
		MyAPI.MonitorMessages();
		if (MyUTIL.IsLarry(MyAPI.CurrentUserID()) ) MyAPI.RegisterAsBot();
    } catch (err) { MyUTIL.logException("connectAPI: " + err.message); }
  },
  
  eventDjListUpdateAddDJ: function (djID) {
    try{
	  USERS.setBadSongCount(djID, 0);
	  BotEVENTS.eventDjListUpdate(); 
	}
    catch (err) {	MyUTIL.logException("BotEVENTS.eventDjListUpdateAddDJ: " + err.message); }
  },
  eventDjListUpdate: function () {
    try{
      MyUTIL.logDebug("DJ LIST UPDATE");
	  MyUTIL.booth.checkForDisconnect();
	  WAITLIST.QNextDJFromWaitlist();
      //MyUTIL.booth.checkForReconnect();
	}
    catch (err) {	MyUTIL.logException("BotEVENTS.eventDjListUpdate: " + err.message); }
  },
  eventDjadvance: function() {
    try{
	  if (MyVARS.songTitle !== MyAPI.CurrentSongTitle() && MyAPI.CurrentSongTitle().length > 1) {
        MyUTIL.resetTastyCount();
		MyVARS.songTitle = MyAPI.CurrentSongTitle();
		//Add user if new:
        if (USERS.lookupLocalUser(MyAPI.CurrentDJID()) == false) { 
	      MyROOM.users.push(new USERS.User(MyAPI.CurrentDJID(), MyAPI.CurrentDJName())); 
	    }
		USERS.setRolled(MyAPI.CurrentDJID(), false);
		USERS.checkRemoveLastDJ(); // See if last DJ requested to get removed.
		setTimeout(function() { MyUTIL.checkIsGoodSong(); }, 3000);
		STORAGE.storeToStorage();
		if (MyVARS.autoWoot === true) setTimeout(function() { MyAPI.WootThisSong(); }, (MyVARS.autoWootDelay * 1000));
	  }
	}
    catch (err) {	MyUTIL.logException("BotEVENTS.eventDjadvance: " + err.message); }
  },
  eventChat: function(chat) {
	try {
	  chat.message = chat.message.trim();
	  // Enable/Disable the bot:
      if (chat.message === "/bot") {
        MyVARS.runningBot = (!MyVARS.runningBot);
        MyUTIL.logChat("Running Bot: " + MyVARS.runningBot);
        return;
      }
      if (!MyVARS.runningBot) return;
      USERS.setUserName(chat.uid, chat.un);
	  if (CHAT.chatFilter(chat)) return void(0);
      MyROOM.roomstats.chatmessages++;
      if (CHAT.commandCheck(chat)) return;
      MyUTIL.larryAI(chat);
	}
    catch (err) {	MyUTIL.logException("eventChat: " + err.message); }
  },
  eventPM: function(pm) {
	try {
	  //assume all pms are commands:
      if (!MyVARS.runningBot) return;
	  if ((pm.message.substring(0, 1) !== MyVARS.commandLiteral) &&
	      (pm.message.substring(0, 1) !== MyVARS.commandLiteral2)) pm.message = MyVARS.commandLiteral + pm.message;
      MyROOM.roomstats.PMs++;
      if (CHAT.commandCheck(pm)) return;
	  MyUTIL.sendPM("I don't understand that.", pm.uid);
	  //todoer: Add "Help" & "Command" commands
	  MyUTIL.sendPM("To join the waitlist type: .q .wait or .addme", pm.uid)
	}
    catch (err) {	MyUTIL.logException("eventPM: " + err.message); }
  },
};

//SECTION USERS: All User data
var USERS = {
  User: function(id, name) {
    this.id = id;
    this.username = name;
    this.jointime = Date.now();
    this.lastActivity = Date.now();
	this.permission = PERM.ROLE.DJ;
    this.votes = {
      songs: 0,
      tasty: 0,
      woot: 0,
      meh: 0,
      curate: 0
    };
    this.tastyVote = false;
    this.rolled = false;
    this.bootable = false;
    this.beerRun = false;
    this.inMeeting = false;
    this.atLunch = false;
    this.afkWarningCount = 0;
    this.badSongCount = 0;
    this.afkCountdown = null;
    this.inRoom = true;
    this.isMuted = false;
    this.rollStats = {
      lifeWoot: 0,
      lifeTotal: 0,
      dayWoot: 0,
      dayTotal: 0,
      DOY: -1
    };
    this.lastDC = {
      time: null,
      leftroom: null,
      resetReason: "",
      position: -1,
      songCount: 0
    };
    this.lastKnownPosition = -1;
    this.lastSeenInLine = null;
  },

  // See if user requested to get removed:
  checkRemoveLastDJ: function() {
    try {
      var lastplay = MyAPI.getLastSong();
      //Check to see if DJ should get booted:
      if (USERS.getBootableID(lastplay.djUsername)) {
        var bootuser = USERS.lookupLocalUser(lastplay.djUsername);
        if (MyAPI.CurrentDJID() === bootuser.id) {
      	  // If they are djing again, jump in line if there's no waitlist, skip them and boot them:
      	  if (MyAPI.djCount() < 2) MyAPI.botDjNow(); // Jump in line if there is no wailist
      	  setTimeout(function() { MyUTIL.skipSong(false, "By User Request"); }, 500);
      	  setTimeout(function() { MyUTIL.removeDJ(bootuser.id, "By User Request1"); }, 1000);
        } else {
      	  setTimeout(function() { MyUTIL.removeDJ(bootuser.id, "By User Request2"); }, 500);
        }
	    if (bootuser.beerRun === false && 
		    bootuser.inMeeting === false && 
			bootuser.atLunch === false)  setTimeout(function() { USERS.resetDC(bootuser); }, 3500);
      }
	  // If there is a waitlist and the last dj was in the pole position:
	  else  { WAITLIST.checkWaitlistRemoval(lastplay); }
      USERS.setBootableID(lastplay.djUsername, false);
    }
	catch (err) { MyUTIL.logException("USERS.checkRemoveLastDJ: " + err.message);    }
  },
  dclookup: function(id) {
    var user = USERS.lookupLocalUser(id);
    if (typeof user === 'boolean') return CHAT.chatMapping.usernotfound;
    var name = user.username;
    if (user.lastDC.time === null) {
      MyUTIL.logDebug("resetUser : dclookup1: ", user.username);
      USERS.resetDC(user);
      var noDisconnectReason = CHAT.subChat(CHAT.chatMapping.notdisconnected, {
        name: name
      });
      if (user.lastDC.resetReason.length > 0) noDisconnectReason = user.lastDC.resetReason;
      user.lastDC.resetReason = "";
      return noDisconnectReason;
    }
    var dc = user.lastDC.time;
    var pos = user.lastDC.position;
    if (pos < 1) {
      MyUTIL.logDebug("resetUser : dclookup2: ", user.username);
      USERS.resetDC(user);
      return CHAT.chatMapping.noposition;
    }
    var timeDc = Date.now() - dc;
    var validDC = false;
    if (MyVARS.maximumDc * 60 * 1000 > timeDc) {
      validDC = true;
    }
    var time = MyUTIL.msToStr(timeDc);
    if (!validDC) {
      MyUTIL.logDebug("resetUser : dclookup3: ", user.username);
      USERS.resetDC(user);
      return (CHAT.subChat(CHAT.chatMapping.toolongago, {
        name: MyAPI.getChatRoomUser(user.id).username,
        time: time
      }));
    }
    var songsPassed = MyROOM.roomstats.songCount - user.lastDC.songCount;
    var afksRemoved = 0;
    var afkList = MyROOM.afkList;
    for (var i = 0; i < afkList.length; i++) {
      var timeAfk = afkList[i][1];
      var posAfk = afkList[i][2];
      if (dc < timeAfk && posAfk < pos) {
        afksRemoved++;
      }
    }
    var newPosition = user.lastDC.position; // - songsPassed - afksRemoved;
    if (newPosition <= 0) newPosition = 1;

    var msg = "";
    if (user.beerRun === true) {
      msg = CHAT.subChat(CHAT.chatMapping.beerrunreturn, {
        name: MyAPI.getChatRoomUser(user.id).username,
        time: time,
        position: newPosition
      });
      if (newPosition <= 1) newPosition = 2;
    } else if (user.inMeeting === true) {
      msg = CHAT.subChat(CHAT.chatMapping.meetingreturn, {
        name: MyAPI.getChatRoomUser(user.id).username,
        time: time,
        position: newPosition
      });
      if (newPosition <= 1) newPosition = 2;
    } else if (user.atLunch === true) {
      msg = CHAT.subChat(CHAT.chatMapping.lunchreturn, {
        name: MyAPI.getChatRoomUser(user.id).username,
        time: time,
        position: newPosition
      });
      if (newPosition <= 1) newPosition = 2;
    } else {
      msg = CHAT.subChat(CHAT.chatMapping.valid, {
        name: MyAPI.getChatRoomUser(user.id).username,
        time: time,
        position: newPosition
      });
    }
    USERS.moveUser(user.id, newPosition, true);
    MyUTIL.logDebug("resetUser : dclookup4: ", user.username);
    USERS.resetDC(user);
    USERS.setLastActivity(user, false);
    user.lastKnownPosition = newPosition;
    user.lastSeenInLine = Date.now();
    return msg;
  },
  didUserDisconnect: function(user) {
    if (user.beerRun) return true;
    if (user.inMeeting) return true;
    if (user.atLunch) return true;
    if (user.lastDC.time !== null && user.lastDC.position > 0) return true;
    return false;
  },
  // USAGE:   TO JUST LOG IT:   console.table(USERS.loadRollPoints(true));
  displayLeaderBoard: function(leaderBoard, username, dispPct, caption) {
    try {
      console.table(leaderBoard);
      var MsgA = "";
      var MsgB = "";
      MsgA = caption;
      for (var leaderIdx = 0; leaderIdx < leaderBoard.length; leaderIdx++) {
        var strData = "[" + MyUTIL.numberToIcon(leaderIdx + 1) + " " + leaderBoard[leaderIdx].username + " ";
        if (dispPct)
          strData += leaderBoard[leaderIdx].winCount + "/" + leaderBoard[leaderIdx].rollCount + " " + leaderBoard[leaderIdx].rollPct + "] "
        else
          strData += leaderBoard[leaderIdx].rollCount + "] "
        if (leaderIdx < 5)
          MsgA += strData;
        else
          MsgB += strData;
      }
      setTimeout(function() {
        MyUTIL.sendChat(MsgA);
      }, 500);
      setTimeout(function() {
        MyUTIL.sendChat(MsgB);
      }, 1000);
    } catch (err) {
      MyUTIL.logException("displayLeaderBoard: " + err.message);
    }
  },
  
  getBootableID: function(username) {
    var user = USERS.lookupLocalUser(username);
    return user.bootable;
  },
  
  getDJ: function() {
    try {
	  var user = USERS.lookupLocalUser(MyAPI.CurrentDJID());
	  if (user !== false) return user;
    } 
	catch (err) { MyUTIL.logException("USERS.getDJ: " + err.message);    }
  },
	  
  getLastActivity: function(user) {
    return user.lastActivity;
  },
  getPermission: function(obj) { //1 requests
    try {
	  var uid = ((obj.uid) ? obj.uid : obj);
	  if (MyUTIL.IsBot(uid)) return PERM.ROLE.HOST;
	  if (MyUTIL.IsDoc(uid)) return PERM.ROLE.HOST;
	  if (MyAPI.IsModerator(uid)) return PERM.ROLE.MANAGER;
	  return PERM.ROLE.DJ;
	  
	//  if (obj.uid) {
	//    if (MyUTIL.IsBot(obj.uid)) return PERM.ROLE.HOST;
	//	if (MyUTIL.IsDoc(obj.uid)) return PERM.ROLE.HOST;
	//	if (MyAPI.IsModerator(obj.uid)) return PERM.ROLE.MANAGER;
	//    var user = USERS.lookupLocalUser(obj.uid);
	//  }
	//  else {
    //    if (MyUTIL.IsBot(obj)) return PERM.ROLE.HOST;
	//	var user = USERS.lookupLocalUser(obj);
	 // }
	  //if (user === false) return PERM.ROLE.DJ;
	  //return user.permission;
    }
	catch (err) { MyUTIL.logException("USERS.getPermission: " + err.message);    }
  },
  getRolled: function(username) {
    var user = USERS.lookupLocalUser(username);
    return user.rolled;
  },
  getRolledStats: function(roomUser) {
    try {
      var rollStats = " [Today: " + roomUser.rollStats.dayWoot + "/" + roomUser.rollStats.dayTotal;
      rollStats += " " + MyUTIL.formatPercentage(roomUser.rollStats.dayWoot, roomUser.rollStats.dayTotal, 0) + "]";
      rollStats += " [Lifetime: " + roomUser.rollStats.lifeWoot + "/" + roomUser.rollStats.lifeTotal;
      rollStats += " " + MyUTIL.formatPercentage(roomUser.rollStats.lifeWoot, roomUser.rollStats.lifeTotal, 2) + "]";
      return rollStats;
    } catch (err) {
      MyUTIL.logException("getRolledStats: " + err.message);
      return "";
    }
  },
  getWarningCount: function(user) {
    return user.afkWarningCount;
  },
  loadRollPoints: function(loadingTop) {
    try {
      userIDs = [];
      leaderBoard = [];
      for (var leaderIdx = 0; leaderIdx < 10; leaderIdx++) {
        var rollCount = 0;
        if (loadingTop === false) rollCount = 10000;
        var addUserIdx = -1;
        for (var userIdx = 0; userIdx < MyROOM.users.length; userIdx++) {
          var skipUser = false;
          var roomUser = MyROOM.users[userIdx];
          //MyUTIL.logDebug("Scanning User: " + roomUser.username + ": " + roomUser.rollStats.lifeTotal);
          if (userIDs.indexOf(roomUser.id) > -1) skipUser = true; // Already in the leader list
          if (roomUser.rollStats.lifeTotal < 50) skipUser = true; // Require 50 rolls to get on the leader board
          // Skip user if higher or lower than the current high/low score:
          if (roomUser.rollStats.lifeTotal < rollCount && loadingTop === true) skipUser = true;
          if (roomUser.rollStats.lifeTotal > rollCount && loadingTop === false) skipUser = true;
          if (!skipUser) {
            addUserIdx = userIdx;
            //MyUTIL.logDebug("New Leader: " + roomUser.username + ": " + roomUser.rollStats.lifeTotal);
            rollCount = roomUser.rollStats.lifeTotal;
          }
        }

        if (addUserIdx > -1) {
          var topStats = {
            username: "",
            rollCount: 0,
            winCount: 0,
            rollPct: ""
          };
          //MyUTIL.logDebug("Adding User: " + MyROOM.users[addUserIdx].username + ": " + MyROOM.users[addUserIdx].rollStats.lifeTotal);
          topStats.username = MyROOM.users[addUserIdx].username;
          topStats.rollCount = MyROOM.users[addUserIdx].rollStats.lifeTotal;
          topStats.winCount = MyROOM.users[addUserIdx].rollStats.lifeWoot;
          topStats.rollPct = MyUTIL.formatPercentage(MyROOM.users[addUserIdx].rollStats.lifeWoot, MyROOM.users[addUserIdx].rollStats.lifeTotal, 2);
          leaderBoard.push(topStats);
          userIDs.push(MyROOM.users[addUserIdx].id);
        }
      }
      return leaderBoard;
    } catch (err) {
      MyUTIL.logException("loadRollPoints: " + err.message);
    }
  },
  loadRollPct: function(loadingTop) {
    try {
      userIDs = [];
      leaderBoard = [];
      var addUserIdx = -1;
      for (var leaderIdx = 0; leaderIdx < 10; leaderIdx++) {
        addUserIdx = -1;
        var rollPct = 0.0;
        if (loadingTop === false) rollPct = 101.00;
        for (var userIdx = 0; userIdx < MyROOM.users.length; userIdx++) {
          var skipUser = false;
          var roomUser = MyROOM.users[userIdx];
          if (userIDs.indexOf(roomUser.id) > -1) skipUser = true; // Already in the leader list
          //MyUTIL.logDebug("Scanning User: " + roomUser.username + ": " + roomUser.rollStats.lifeTotal);
          if (roomUser.rollStats.lifeTotal < 50) skipUser = true; // Require 50 rolls to get on the leader board
          if (!skipUser) {
            var UserPct = roomUser.rollStats.lifeWoot / roomUser.rollStats.lifeTotal;
            // Skip user if higher or lower than the current high/low score:
            if (UserPct < rollPct && loadingTop === true) skipUser = true;
            if (UserPct > rollPct && loadingTop === false) skipUser = true;
          }
          if (!skipUser) {
            //MyUTIL.logDebug("New Leader: " + roomUser.username + ": " + roomUser.rollStats.lifeTotal + "-" + UserPct);
            addUserIdx = userIdx;
            rollPct = UserPct;
          }
        }
        if (addUserIdx > -1) {
          var topStats = {
            username: "",
            rollCount: 0,
            winCount: 0,
            rollPct: ""
          };
          //MyUTIL.logDebug("Adding User: " + MyROOM.users[addUserIdx].username + ": " + MyROOM.users[addUserIdx].rollStats.lifeTotal);
          topStats.username = MyROOM.users[addUserIdx].username;
          topStats.rollCount = MyROOM.users[addUserIdx].rollStats.lifeTotal;
          topStats.winCount = MyROOM.users[addUserIdx].rollStats.lifeWoot;
          topStats.rollPct = MyUTIL.formatPercentage(MyROOM.users[addUserIdx].rollStats.lifeWoot, MyROOM.users[addUserIdx].rollStats.lifeTotal,2);
          leaderBoard.push(topStats);
          userIDs.push(MyROOM.users[addUserIdx].id);
        }
      }
      return leaderBoard;
    } catch (err) {
      MyUTIL.logException("loadRollPct: " + err.message);
    }
  },

  setBootableID: function(username, value) {
    var user = USERS.lookupLocalUser(username);
    user.bootable = value;
  },
  setMeetingStatus: function(user, status) {
    user.beerRun = false;
    user.inMeeting = status;
    user.atLunch = false;
  },
  setBeerRunStatus: function(user, status) {
    user.beerRun = status;
    user.inMeeting = false;
    user.atLunch = false;
  },
  setLunchStatus: function(user, status) {
    user.beerRun = false;
    user.inMeeting = false;
    user.atLunch = status;
  },
  setWarningCount: function(user, value) {
    user.afkWarningCount = value;
  },
  skipBadSong: function(userId, skippedBy, reason) {
    MyUTIL.logInfo("Skip: [" + MyAPI.CurrentSong().title + "] dj id: " + USERS.lookupLocalUser(userId).username + ": skiped by: " + skippedBy + " Reason: " + reason);
    var tooMany = false;
    tooMany = USERS.tooManyBadSongs(userId);
    if ((tooMany) && (MyAPI.djCount() === 1)) MyAPI.botDjNow();
    MyUTIL.skipSong(false, reason);
    if (tooMany) {
	  setTimeout(function() { MyUTIL.removeDJ(userId, "Too many bad songs"); }, 1000);
      setTimeout(function() { USERS.setBadSongCount(userId, 0); }, 1500);
      setTimeout(function() { MyUTIL.sendChat("Too many consecutive bad songs @" + USERS.lookupLocalUser(userId).username); }, 2000);
	}
  },
  tooManyBadSongs: function(userId) {
    var badCount = USERS.getBadSongCount(userId);
    badCount++;
    USERS.setBadSongCount(userId, badCount);
    if (badCount > 2) return true;
    return false;
  },
  getBadSongCount: function(userId) {
    var user = USERS.lookupLocalUser(userId);
    return user.badSongCount;
  },
  setJoinTime: function(userId) {
    var user = USERS.lookupLocalUser(userId);
    user.jointime = Date.now();
  },
  setBadSongCount: function(userId, value) {
    var user = USERS.lookupLocalUser(userId);
    user.badSongCount = value;
  },

  setRolled: function(username, value, wooting) {
    var user = USERS.lookupLocalUser(username);
    user.rolled = value;
  },
  tastyVote: function(userId, cmd) {
    try {
	  //MyUTIL.logDebug("USERID: " + userId);
      var user = USERS.lookupLocalUser(userId);
	  //MyUTIL.logDebug("USERID: " + userId);
      if (user.tastyVote) return;
      var dj = USERS.getDJ();
      if (typeof dj === 'undefined') return;
      if (dj === 'undefined') return;

	  //MyUTIL.logDebug("DJID: " + dj.id);
	  //MyUTIL.logDebug("user.id: " + user.id);
      if (dj.id === user.id && !MyUTIL.IsBot(dj.id)) {
        MyUTIL.sendChat("I'm glad you find your own play tasty @" + user.username);
        return;
      }
      var tastyComment = MyUTIL.tastyComment(cmd);
	  tastyComment = "/me @" + dj.username + " " + CHAT.subChat(tastyComment, { pointfrom: user.username });
      user.tastyVote = true;
      setTimeout(function() { MyUTIL.sendChat(tastyComment); }, 500);
      MyROOM.roomstats.tastyCount += 1;
      var currdj = USERS.lookupLocalUser(dj.id);
      currdj.votes.tasty += 1;
    } 
	catch (err) { MyUTIL.logException("userUtilities.tastyVote: " + err.message); }
  },
  
  // Lookup local user by Username or ID:
  // USERS.lookupLocalUser("DocZ").username;
  // USERS.lookupLocalUser("demnutzzzz").username;
  // lookupuser getuser userlookup finduser
  lookupLocalUser: function(id) { //getroomuser
    try {
	  for (var i = 0; i < MyROOM.users.length; i++) {
	    if (!isNaN(id)) {
	      if (MyROOM.users[i].id === id) return MyROOM.users[i];
	    }
	   if (typeof id === "string") {
          if (MyROOM.users[i].username.trim().toLowerCase() == id.trim().toLowerCase()) return MyROOM.users[i];
	      if (MyROOM.users[i].id === id) return MyROOM.users[i];
	    }
      }
      return false;
    } 
	catch (err) { MyUTIL.logException("userUtilities.lookupLocalUser: " + err.message); }
  },

  resetDailyRolledStats: function(roomUser) {
    try {
      var DOY = MyUTIL.getDOY();
      if (roomUser.rollStats.DOY !== DOY) {
        roomUser.rollStats.DOY = DOY;
        roomUser.rollStats.dayWoot = 0;
        roomUser.rollStats.dayTotal = 0;
      }
    } catch (err) {
      MyUTIL.logException("resetDailyRolledStats: " + err.message);
      return "";
    }
  },

  resetDC: function(user) {
	MyUTIL.logDebug("resetDC");
    user.lastDC.time = null;
    user.lastDC.position = -1;
    user.lastDC.leftroom = null;
    user.lastKnownPosition = -1;
    user.lastSeenInLine = null;
    user.lastDC.songCount = 0;
    user.beerRun = false;
    user.inMeeting = false;
    user.atLunch = false;
  },
  setLastActivity: function(user, dispMsg) {
	try
	{
	  //MyUTIL.logDebug("setLastActivity");
      user.lastActivity = Date.now();
      if ((user.afkWarningCount > 0) && (dispMsg === true)) {
	    MyUTIL.sendChat(CHAT.subChat(CHAT.chatMapping.afkUserReset, { name: user.username }));
		STORAGE.storeToStorage();
	  }
      user.afkWarningCount = 0;
      clearTimeout(user.afkCountdown);
	}
	catch (err) { MyUTIL.logException("USERS.setLastActivity: " + err.message); }
  },
  setLastActivityID: function(userId, username, dispMsg) {
	try
	{
	  //MyUTIL.logDebug("setLastActivityID");
	  var user = USERS.lookupLocalUser(userId);
      if (user == false) { 
	    MyROOM.users.push(new USERS.User(userId, username)); 
	    user = USERS.lookupLocalUser(userId);
	  }
	  if (user == false) return; // This shouldn't happen.
      USERS.setLastActivity(user, dispMsg);
	}
	catch (err) { MyUTIL.logException("USERS.setLastActivityID: " + err.message); }
  },
  setUserName: function(userId, userName) {
    var user = USERS.lookupLocalUser(userId);
    if (user == false) return;
    if ((user.username !== userName) && (userName.length > 0)) {
		user.username = userName;
		MyUTIL.logInfo('CHANGE NAME FROM: [' + user.username + '] TO: [' + userName + ']');
	}
  },
  updateRolledStats: function(username, wooting) {
    try {
      var roomUser = USERS.lookupLocalUser(username);
      USERS.resetDailyRolledStats(roomUser);
      if (wooting) {
        roomUser.rollStats.lifeWoot++;
        roomUser.rollStats.dayWoot++;
      }
      roomUser.rollStats.lifeTotal++;
      roomUser.rollStats.dayTotal++;
      return USERS.getRolledStats(roomUser);
    } catch (err) {
      MyUTIL.logException("updateRolledStats: " + err.message);
      return "";
    }
  },
  updateDC: function(user) {
	MyUTIL.logDebug("updateDC");
    user.lastDC.time = Date.now();
    user.lastDC.position = user.lastKnownPosition;
    user.lastDC.songCount = MyROOM.roomstats.songCount;
  },
  englishMessage: function(lang, username) {
    try {
      var engMsg = '/me @' + username + ' ';
      switch (lang) {
        case 'en':
          break;
        case 'bg':
          engMsg += 'Моля, говорете Inglês';
          break;
        case 'fi':
          engMsg += 'Ole hyvä puhua Inglês';
          break;
        case 'zh':
          engMsg += '请讲英语';
          break;
        case 'ms':
          engMsg += 'Sila berbahasa Inggeris';
          break;
        case 'xx':
          engMsg += 'xx';
          break;
        case 'da':
          engMsg += 'Vær venlig at tale engelsk.';
          break;
        case 'de':
          engMsg += 'Bitte sprechen Sie Englisch.';
          break;
        case 'es':
          engMsg += 'Por favor, hable Inglés.';
          break;
        case 'fr':
          engMsg += 'Parlez anglais, s\'il vous plaît.';
          break;
        case 'nl':
          engMsg += 'Spreek Engels, alstublieft.';
          break;
        case 'pl':
          engMsg += 'Proszę mówić po angielsku.';
          break;
        case 'pt':
          engMsg += 'Por favor, fale Inglês.';
          break;
        case 'sk':
          engMsg += 'Hovorte po anglicky, prosím.';
          break;
        case 'cs':
          engMsg += 'Mluvte prosím anglicky.';
          break;
        case 'sr':
          engMsg += 'Молим Вас, говорите енглески.';
          break;
      }
      engMsg += '   (English please)';
      return engMsg;
    } catch (err) {
      MyUTIL.logException("englishMessage: " + err.message);
    }
  },
  eventUserjoin: function(user) {
    try {
      if (!MyVARS.runningBot) return;
      var xUser = USERS.lookupLocalUser(user.id);
      var greet = true;
      var welcomeback = null;
      if (xUser == false) {
        MyROOM.users.push(new USERS.User(user.id, user.username));
		xUser = USERS.lookupLocalUser(user.id);
        welcomeback = false;
      } else {
        xUser.inRoom = true;
        var jt = xUser.jointime;
        var t = Date.now() - jt;
        if (t < 10 * 1000) greet = false;  // Don't greet if left for < 10 seconds
        else welcomeback = true;
        MyUTIL.booth.resetOldDisconnects();
        // No reconnect when user joins logic yet: 
		//MyUTIL.checkDisconnect(xUser);
      } 
      var whoismsg = MyAPI.whoisinfo("Bot", xUser.username);
      if (whoismsg.length > 0) MyUTIL.logChat(whoismsg);
      
      // If user doesn't speak English let em know we do:
      var userRole = USERS.getPermission(xUser.id);
      var staffMember = false;
      if (userRole > PERM.ROLE.NONE) staffMember = true;
	  if (MyAPI.UserLanguage(xUser.id) !== 'EN') {
       if ((!welcomeback) &&
         (!staffMember) && (MyVARS.welcomeForeignerMsg === true)) {
         var engMsg = USERS.englishMessage(MyAPI.UserLanguage(xUser.id), xUser.username);
         if (engMsg.length > 0) { setTimeout(function(xUser) { MyUTIL.sendChat(engMsg); }, 1 * 1500, xUser) }
       }
      }
      USERS.setLastActivityID(xUser.id, xUser.username, false);
      USERS.setBadSongCount(xUser.id, 0);
      USERS.setJoinTime(xUser.id);
      
      var welcomeMessage = "";
      if (MyVARS.welcome && greet) {
        welcomeback ? welcomeMessage = CHAT.subChat(CHAT.chatMapping.welcomeback, {
      	  name: xUser.username
      	}) :
      	welcomeMessage = CHAT.subChat(CHAT.chatMapping.welcome, {
      	  name: xUser.username
      	});
        // Removed adding the new user whois info to the greeting: if ((!staffMember) && (!welcomeback)) welcomeMessage += MyVARS.newUserWhoisInfo;
        MyUTIL.logChat(MyVARS.newUserWhoisInfo);
        MyUTIL.logDebug("WelcomeBack: " + xUser.id + ": " + xUser.username);
        setTimeout(function(xUser) { MyUTIL.sendChat(welcomeMessage); }, 1 * 1000, xUser);
		if ((!welcomeback) || (MyUTIL.IsTestBot(xUser.id))) { setTimeout(function() { MyUTIL.sendPM("Welcome to Club DeezNutzzzz. If there are no open seats to DJ, join the waitlist type: .q .wait or .addme", xUser.id)}, 500); }
      }
	}
	catch (err) { MyUTIL.logException("USERS.eventUserjoin: " + err.message); }
  },
};

//SECTION MyROOM: All room settings:
var MyROOM = {
  afkList: [],
  allcommand: true,
  afkInterval: null,
  blacklistLoaded: false,
  historyList: [],
  newBlacklist: [],
  newBlacklistIDs: [],
  mutedUsers: [],
  queue: {
    id: [],
    position: []
  },
  roomstats: {
    accountName: null,
    totalWoots: 0,
    totalCurates: 0,
    totalMehs: 0,
    tastyCount: 0,
    launchTime: null,
    songCount: 0,
    chatmessages: 0,
    PMs: 0
  },
  users: [],
};

//SECTION WAITLIST: Manage the waitlist:
var WAITLIST = {
  waitingOnDj: false,
  maxDJCount: 5,			//Number of djs we can have playing at a time
  waitlistEnabled: true,

  // called when a user requests to get added to the wailist: (Called from addmecommand) chat
  addToWaitlist: function(chat) {
    try {
		if (WAITLIST.waitlistEnabled === false) { MyUTIL.sendChatOrPM(chat.type, chat.uid, "DJ Waitlist is currently disabled."); return; }
		if (MyAPI.userInDjList(chat.uid)) { MyUTIL.sendChatOrPM(chat.type, chat.uid, "Cannot join waitlist, you are already djing." + chat.un); return; }
		if (MyROOM.queue.id.indexOf(chat.uid) > -1) { MyUTIL.sendChatOrPM(chat.type, chat.uid, "/me " + chat.un + " you are already on the waitlist. (Position:  " + (MyROOM.queue.id.indexOf(chat.uid) + 1).toString() + ")");  return; }
		if ((MyAPI.djCount() < WAITLIST.maxDJCount) && (!WAITLIST.waitingOnDj)) return MyUTIL.sendChat("No waiting, hop up now " + chat.un);
        if (MyROOM.queue.id.indexOf(chat.uid) === -1) { MyROOM.queue.id.push(chat.uid); }
		STORAGE.storeToStorage();
		MyUTIL.sendChat("/me " + chat.un + " you are currently number " + (MyROOM.queue.id.indexOf(chat.uid) + 1).toString() + " on the waitlist.");
	}
	catch (err) { MyUTIL.logException("WAITLIST.addToWaitlist: " + err.message); }
  },
  // called after each song to see if we need to yank 1st dj and ping next
  checkWaitlistRemoval: function(lastplay) {
    try {
      if (WAITLIST.waitlistEnabled === false) return;
	  if (WAITLIST.waitingOnDj) return;				// Already waiting on a dj
	  if (MyROOM.queue.id.length === 0) return;		// waitlist queue is empty
	  if (MyAPI.djCount() < WAITLIST.maxDJCount) {
		WAITLIST.QNextDJFromWaitlist();
		return;
	  }
	  var djlist = MyAPI.getDjList();
	  // Remove dj if last DJ was in the pole position:
	  if (djlist[0].id === lastplay.djID) {
		  MyUTIL.removeDJ(lastplay.djID, "Waitlist removal");
	      MyROOM.queue.id.push(lastplay.djID);  // Add this dj to the waitlist
		  STORAGE.storeToStorage();
		  //no need to call QNextDJFromWaitlist as the booth update event will handle that.
	  }
	}
	catch (err) { MyUTIL.logException("WAITLIST.checkWaitlistRemoval: " + err.message); }
  },
  QNextDJFromWaitlist: function() {
    try {
	  if (WAITLIST.waitlistEnabled === false) return;	//Waitlist disabled
	  if (MyROOM.queue.id.length === 0) return;			// waitlist queue is empty
	  if (MyAPI.djCount() === WAITLIST.maxDJCount) { WAITLIST.waitingOnDj = false; return; }
	  var nextDjId = MyROOM.queue.id[0];
	  if (!MyAPI.userInRoom(nextDjId) || MyAPI.userInDjList(nextDjId)) {
		setTimeout(function() { WAITLIST.QNextDJFromWaitlist(); }, 250);
	  }
	  else {
	    MyUTIL.sendChat("/me @" + MyAPI.getChatRoomUser(nextDjId).username + 
		  " you have 45 seconds to hop up. (Waiting: " + (MyROOM.queue.id.length - 1) + ")");
	    WAITLIST.waitingOnDj = true;
		setTimeout(function() { 
		  WAITLIST.waitingOnDj = false; 	// Reset wait
		  WAITLIST.QNextDJFromWaitlist();	// Check to see if they did jump up or if we still have an open spot
		}, 45000);
	  }
	  MyROOM.queue.id.splice(0,1);  // Remove the top dj from the waitlist
	  STORAGE.storeToStorage();
	}
	catch (err) { MyUTIL.logException("WAITLIST.QNextDJFromWaitlist: " + err.message); }
  },
};

//SECTION AFK:
var AFK = {
  afkCheck: function() {
    try {
      if (MyVARS.enableAfkRemoval === false) return void(0);
	  //if (MyAPI.CurrentUserName() === 'Larry') return void(0);
      if (!AFK.afkRemovalNow()) return void(0);
      var djlist = MyAPI.getDjList();
      var lastPos = Math.min(djlist.length, MyVARS.afkpositionCheck);
      if (lastPos - 1 > djlist.length) return void(0);
      for (var i = 0; i < lastPos; i++) {
        if (typeof djlist[i] !== 'undefined') {
          AFK.afkCheckOneUser(djlist[i].id);
		}
	  }
	}
	catch (err) { MyUTIL.logException("AFK.afkCheck: " + err.message); }
  },
  afkCheckOneUser: function(uid) {
    try {
      //MyUTIL.logDebug("---------------------------------------------------------------------");
      //MyUTIL.logDebug("afkCheck ID: " + uid);
      var user = USERS.lookupLocalUser(uid);
	  if (typeof user === 'boolean') return;
	  if (uid === MyAPI.CurrentUserID()) return;  // Ignore Bot
	  //MyUTIL.logDebug("afkCheck ID: " + user.id);
	  var name = user.username;
	  var currUser = MyAPI.getChatRoomUser(user.id);
	  var lastActive = USERS.getLastActivity(user);
	  // (Date.now() - USERS.lookupLocalUser("DocZ").lastActivity) / (60 * 1000);
	  var inactivity = Date.now() - lastActive;
	  var time = MyUTIL.msToStr(inactivity);
	  var warncount = user.afkWarningCount;
	  if (currUser !== "undefined") name = currUser.username;
	  if ((inactivity > (MyVARS.afkResetTime * 60 * 1000)) && (user.id !== MyAPI.CurrentUserID()) && (warncount === 0)) {
	    //reset afk status if the user joins the queue after afkResetTime
	    USERS.setLastActivity(user, false);
	    inactivity = 0;
	  }	
      //MyUTIL.logDebug("afkCheck: Act: " + lastActive + " Inact: " + inactivity + " Time: " + time + " Warn: " + warncount);
      if (inactivity > MyVARS.maximumAfk * 60 * 1000) {
        //MyUTIL.logDebug("afkCheck: INACTIVE USER: " + warncount.toString());
        if (warncount === 0) {
      	  MyUTIL.sendChat(CHAT.subChat(CHAT.chatMapping.warning1, { name: name, time: time }));
      	  user.afkWarningCount = 3;
      	  user.afkCountdown = setTimeout(function(userToChange) { userToChange.afkWarningCount = 1; }, 90 * 1000, user);
        } else if (warncount === 1) {
      	  MyUTIL.sendChat(CHAT.subChat(CHAT.chatMapping.warning2, { name: name }));
      	  user.afkWarningCount = 3;
      	  user.afkCountdown = setTimeout(function(userToChange) { userToChange.afkWarningCount = 2; }, 30 * 1000, user);
        } else if (warncount === 2) {
      	  //var pos = MyAPI.getDjListPosition(uid);
          //pos++; // (Zero based so we'll add one) (-1 = not in waitlist)
          var removeNextPass = false; 
          // Remove next pass if they are the current DJ AND waitlist is not empty.
          if (MyAPI.CurrentDJID() === uid) {
      	    // Jump in line & skip the DJs song if waitlist is empty:
      	    if (MyAPI.djCount() < 2){
      	      MyAPI.botDjNow();
      	      //Kinder method: Don't skip afk dj let their last song play out:
		  	//setTimeout(function() { MyUTIL.skipSong(false, "AFK Check"); }, 1000);
      	    }
      	    removeNextPass = true;
          }
          // Remove DJ from waitlist:
          else { //if (pos !== 0) {
      	    MyROOM.afkList.push([uid, Date.now(), 0]);
      	    USERS.resetDC(user);
		    MyUTIL.logDebug("afkCheck: REMOVE USER");
      	    MyUTIL.removeDJ(uid, "AFK Check");
      	    user.lastDC.resetReason = "Disconnect status was reset. Reason: You were removed from line due to afk.";
      	    //MyUTIL.sendChat(CHAT.subChat(CHAT.chatMapping.afkremove, { name: name, time: time, position: pos, maximumafk: MyVARS.maximumAfk }));
		    MyUTIL.sendChat(CHAT.subChat(CHAT.chatMapping.afkremove, { name: name, time: time, maximumafk: MyVARS.maximumAfk }));
      	  }
      	  if (!removeNextPass) user.afkWarningCount = 0;
        }
      }
	}
	catch (err) { MyUTIL.logException("AFK.afkCheckOneUser: " + err.message); }
  },
  checkBotDj: function(uid) {
    try {
	  if (MyVARS.botAutoDJ === false) return;
	  if (MyAPI.djCount() === 0) MyAPI.botDjNow();
	}
	catch (err) { MyUTIL.logException("AFK.checkBotDj: " + err.message); }
  },


  afkRemovalNow: function() {
    try {
      if (!MyVARS.afk5Days && !MyVARS.afk7Days) return false;
      var currDate = new Date();
      //Not on Saturday/Sunday if not monitoring 7 days a week
      if (!MyVARS.afk7Days) {
        var dayofweek = currDate.getDay(); // [Day of week Sun=0, Mon=1...Sat=6]
        if (dayofweek === 6 || dayofweek === 0) return false;
      }
      var hourofday = currDate.getHours();
      if (hourofday >= MyVARS.afkRemoveStart && hourofday < MyVARS.afkRemoveEnd) return true;
      return false;
    } catch (err) {
      MyUTIL.logException("AFK.afkRemovalNow: " + err.message);
    }
  },
};

//SECTION CHAT:
var CHAT = {
  chatMapping: null,
  chatLink: "https://rawcdn.githack.com/SZigmund/basicBot/8633f3be61ee23ffbf798c17688324c228ef0883/lang/en.json",
  commandChat: {
    cid: "",
    message: "",
    sub: -1,
    un: "",
    uid: -1,
    type: "message",
    timestamp: null,
    sound: "mention"
  },
  
  chatFilter: function(chat) {
    /*
	var msg = chat.message;
    var rlJoinChat = CHAT.chatMapping.roulettejoin;
    var rlLeaveChat = CHAT.chatMapping.rouletteleave;
    var joinedroulette = rlJoinChat.split('%%NAME%%');
    if (joinedroulette[1].length > joinedroulette[0].length) joinedroulette = joinedroulette[1];
    else joinedroulette = joinedroulette[0];

    var leftroulette = rlLeaveChat.split('%%NAME%%');
    if (leftroulette[1].length > leftroulette[0].length) leftroulette = leftroulette[1];
    else leftroulette = leftroulette[0];

    if ((msg.indexOf(joinedroulette) > -1 || msg.indexOf(leftroulette) > -1) && chat.uid === MyAPI.CurrentUserID()) {
      setTimeout(function(id) {
        MyAPI.moderateDeleteChat(id);
      }, 2 * 1000, chat.cid);
      return true;
    }
	*/
    return false;
  },
  commandCheck: function(chat) {
    //chat.uid chat.message chat.cid
    try {
      var cmd;
      //UTIL.logObject(chat, "chat");
	  USERS.setLastActivityID(chat.uid, chat.un, true);
	  if (chat.message.substring(0, 1) === MyVARS.commandLiteral2) chat.message = MyVARS.commandLiteral + chat.message.substring(1);
      if (chat.message.substring(0, 1) === MyVARS.commandLiteral) {
        var space = chat.message.indexOf(' ');
        if (space === -1) {
          cmd = chat.message.toLowerCase();
        } else cmd = chat.message.substring(0, space).toLowerCase();
      } else return false;
      var userPerm = USERS.getPermission(chat.uid);
      if (chat.message.toLowerCase() !== ".join" && chat.message.toLowerCase() !== ".in" && chat.message.toLowerCase() !== ".out" && chat.message.toLowerCase() !== ".leave" && (!MyUTIL.bopCommand(cmd))) {
        if (userPerm === PERM.ROLE.NONE && !MyROOM.usercommand) return void(0);
        if (!MyROOM.allcommand) return void(0);
      }
      var executed = false;
      for (var comm in BOTCOMMANDS) {
        var cmdCall = BOTCOMMANDS[comm].command;
        if (!Array.isArray(cmdCall)) { cmdCall = [cmdCall] }
        for (var i = 0; i < cmdCall.length; i++) {
          if (MyVARS.commandLiteral + cmdCall[i] == cmd) {
            BOTCOMMANDS[comm].functionality(chat, MyVARS.commandLiteral + cmdCall[i]);
            executed = true;
            break;
          }
        }
      }
      if (executed && userPerm === PERM.ROLE.NONE) {
        MyROOM.usercommand = false;
        setTimeout(function() {
          MyROOM.usercommand = true;
        }, MyVARS.commandCooldown * 1000);
      }
      //MyUTIL.logDebug("commandCheck7: executed: " + executed);
      //if (executed) {
      //  if (chat.cid.length > 0 && MyVARS.lastChatUid !== chat.uid) MyAPI.moderateDeleteChat(chat.cid);
      //  MyROOM.allcommand = false;
      //  setTimeout(function() {
      //    MyROOM.allcommand = true;
      //  }, 5 * 1000);
      //}
      //MyUTIL.logDebug("commandCheck8: executed: " + executed);
      return executed;
    } 
	catch (err) { MyUTIL.logException("commandCheck: " + err.message); }
  },
  
  // loadChat: function(cb) {...}
  loadChat: function() {
    // if (!cb) cb = function() {};
	// OLD: 
    $.get("https://rawcdn.githack.com/SZigmund/basicBot/f992672a63f0fb827759334423709e927a076f85/lang/langIndex.json", function(json) {
      var link = CHAT.chatLink;
      if (json !== null && typeof json !== "undefined") {
        langIndex = json;
        link = langIndex[MyVARS.language.toLowerCase()];
        if (MyVARS.chatLink !== CHAT.chatLink) {
          link = MyVARS.chatLink;
        } else {
          if (typeof link === "undefined") {
            link = CHAT.chatLink;
          }
        }
        $.get(link, function(json) {
          if (json !== null && typeof json !== "undefined") {
            if (typeof json === "string") json = JSON.parse(json);
            //ZZZ 			
			MyUTIL.logDebug("LOADED CHAT MAP 01");
            CHAT.chatMapping = json;
            //ZZZ 			
			MyUTIL.logDebug("LOADED CHAT MAP 01 " + CHAT.chatMapping.online.toString());
            // cb();
          }
        });
      } else {
        $.get(CHAT.chatLink, function(json) {
          if (json !== null && typeof json !== "undefined") {
            if (typeof json === "string") json = JSON.parse(json);
            //ZZZ 			MyUTIL.logDebug("LOADED CHAT MAP 02");
            CHAT.chatMapping = json;
            //ZZZ 			MyUTIL.logDebug("LOADED CHAT MAP 02 " + CHAT.chatMapping.online.toString());
            // cb();
          }
        });
      }
    });
  },
  subChat: function(chat, obj) {
    try {
      if (typeof chat === "undefined") {
        MyUTIL.logChat("There is a chat text missing.");
        MyUTIL.logDebug("There is a chat text missing.");
        return "[Error] No text message found.";
      }
      var lit = '%%';
      for (var prop in obj) {
        chat = chat.replace(lit + prop.toUpperCase() + lit, obj[prop]);
      }
      return chat;
    } 
	catch (err) { MyUTIL.logException("subChat: " + err.message); }
  },
 	randomByeArray: [ 
	  "Catch ya on the flipside %%USERNAME%%",
	  "Stay fresh cheese bag",
	  "Take it easy, ham bag",
	  "Later on, Parmesan",
	  "See you later, cheese grater",
	  "See ya when you're back, pepperjack",
	  "Peace %%USERNAME%%!",
	  "See ya %%USERNAME%%!",
	  "See ya soon %%USERNAME%%",
	  "Hurry back %%USERNAME%%",
	  "Keep it real %%USERNAME%%",
	  "Keep it between the lines...and dirty side down %%USERNAME%%",
	  "Fine, then go %%USERNAME%%!",
	  "Cheers %%USERNAME%%",
	  "May your mother's cousin never be assaulted by Attila the Hun at the supermarket %%USERNAME%%",
	  "Adidas %%USERNAME%%",
	  "Later %%USERNAME%%",
	  "See ya, wouldn't wanna be ya %%USERNAME%%",
	  "Until we meet again %%USERNAME%%. <<Tips imaginary hat>>",
	  "We'll hold the fort down for ya %%USERNAME%%"
	  ],
 
};

//SECTION COMMANDS: All Bot commands - The bot commands / meat:
var BOTCOMMANDS = {
  executable: function(minRank, chat) {
	MyUTIL.logDebug("MinRank: " + minRank.toString() + " -> " + chat);
    var id = chat.uid;
    var perm = USERS.getPermission(id);
    var minPerm;
    switch (minRank) {
      case 'admin':
        minPerm = 10000;
        break;
      case 'ambassador':
        minPerm = 7000;
        break;
      case 'host':
        minPerm = PERM.ROLE.HOST;
        break;
      case 'cohost':
        minPerm = PERM.ROLE.COHOST;
        break;
      case 'manager':
        minPerm = PERM.ROLE.MANAGER;
        break;
      case 'mod':
        if (MyVARS.bouncerPlus) {
          minPerm = PERM.ROLE.BOUNCER;
        } else {
          minPerm = PERM.ROLE.MANAGER;
        }
        break;
      case 'bouncer':
        minPerm = PERM.ROLE.BOUNCER;
        break;
      case 'resident-dj':
        minPerm = PERM.ROLE.DJ;
        break;
      case 'user':
        minPerm = PERM.ROLE.NONE;
        break;
      default:
        MyUTIL.logChat('error defining permission (' + minRank + ')');
    }
    return perm >= minPerm;

  },
  // command: {
  //            command: 'cmd',
  //            rank: 'user/bouncer/mod/manager',
  //            type: 'startsWith/exact',
  //            functionality: function(chat, cmd){
  //                    if(this.type === 'exact' && chat.message.length !== cmd.length) return void (0);
  //                    if( !BOTCOMMANDS.executable(this.rank, chat) ) return void (0);
  //                    else{
  //                    
  //                    }
  //            }
  //    },

  activeCommand: {
    command: 'active',
    rank: 'bouncer',
    type: 'startsWith',
    functionality: function(chat, cmd) {
      if (this.type === 'exact' && chat.message.length !== cmd.length) return void(0);
      if (!BOTCOMMANDS.executable(this.rank, chat)) return void(0);
      else {
        var msg = chat.message;
        var now = Date.now();
        var chatters = 0;
        var time;
        if (msg.length === cmd.length) time = 60;
        else {
          time = msg.substring(cmd.length + 1);
          if (isNaN(time)) return MyUTIL.sendChatOrPM(chat.type, chat.uid, CHAT.subChat(CHAT.chatMapping.invalidtime, {
            name: chat.un
          }));
        }
        for (var i = 0; i < MyROOM.users.length; i++) {
          userTime = USERS.getLastActivity(MyROOM.users[i]);
          if ((now - userTime) <= (time * 60 * 1000)) {
            chatters++;
          }
        }
        MyUTIL.sendChatOrPM(chat.type, chat.uid, CHAT.subChat(CHAT.chatMapping.activeusersintime, {
          name: chat.un,
          amount: chatters,
          time: time
        }));
      }
    }
  },

  addCommand: {
    command: 'add',
    rank: 'mod',
    type: 'startsWith',
    functionality: function(chat, cmd) {
      if (this.type === 'exact' && chat.message.length !== cmd.length) return void(0);
      if (!BOTCOMMANDS.executable(this.rank, chat)) return void(0);
      else {
        var msg = chat.message;
        if (msg.length === cmd.length) return MyUTIL.sendChatOrPM(chat.type, chat.uid, CHAT.subChat(CHAT.chatMapping.nouserspecified, {
          name: chat.un
        }));
        var name = MyUTIL.defineCommandExecuteOnName(chat, cmd);
        var user = USERS.lookupLocalUser(name);
        if (msg.length > cmd.length + 2) {
          if (typeof user !== 'undefined') {
            MyAPI.addDJ(user.id);
          } else MyUTIL.sendChatOrPM(chat.type, chat.uid, CHAT.subChat(CHAT.chatMapping.invaliduserspecified, {
            name: chat.un
          }));
        }
      }
    }
  },

  afklimitCommand: {
    command: 'afklimit',
    rank: 'manager',
    type: 'startsWith',
    functionality: function(chat, cmd) {
      if (this.type === 'exact' && chat.message.length !== cmd.length) return void(0);
      if (!BOTCOMMANDS.executable(this.rank, chat)) return void(0);
      else {
        var msg = chat.message;
        if (msg.length === cmd.length) return MyUTIL.sendChatOrPM(chat.type, chat.uid, CHAT.subChat(CHAT.chatMapping.nolimitspecified, {
          name: chat.un
        }));
        var limit = msg.substring(cmd.length + 1);
        if (!isNaN(limit)) {
          MyVARS.maximumAfk = parseInt(limit, 10);
          MyUTIL.sendChatOrPM(chat.type, chat.uid, CHAT.subChat(CHAT.chatMapping.maximumafktimeset, {
            name: chat.un,
            time: MyVARS.maximumAfk
          }));
        } else MyUTIL.sendChatOrPM(chat.type, chat.uid, CHAT.subChat(CHAT.chatMapping.invalidlimitspecified, {
          name: chat.un
        }));
      }
    }
  },

  randomRouletteCommand: { //Added 02/14/2015 Zig
    command: 'randomroulette',
    rank: 'mod',
    type: 'exact',
    functionality: function(chat, cmd) {
      if (this.type === 'exact' && chat.message.length !== cmd.length) return void(0);
      if (!BOTCOMMANDS.executable(this.rank, chat)) return void(0);
      else {
        if (MyVARS.randomRoulette) {
          MyVARS.randomRoulette = !MyVARS.randomRoulette;
          MyUTIL.sendChatOrPM(chat.type, chat.uid, CHAT.subChat(CHAT.chatMapping.toggleoff, {
            name: chat.un,
            'function': 'Random Roulette'
          }));
        } else {
          MyVARS.randomRoulette = !MyVARS.randomRoulette;
          MyUTIL.sendChatOrPM(chat.type, chat.uid, CHAT.subChat(CHAT.chatMapping.toggleon, {
            name: chat.un,
            'function': 'Random Roulette'
          }));
        }
      }
    }
  },
  randomCommentsCommand: { //Added 02/14/2015 Zig
    command: 'randomcomments',
    rank: 'mod',
    type: 'exact',
    functionality: function(chat, cmd) {
      if (this.type === 'exact' && chat.message.length !== cmd.length) return void(0);
      if (!BOTCOMMANDS.executable(this.rank, chat)) return void(0);
      else {
        if (MyVARS.randomCommentsEnabled) {
          MyVARS.randomCommentsEnabled = !MyVARS.randomCommentsEnabled;
          MyUTIL.sendChatOrPM(chat.type, chat.uid, CHAT.subChat(CHAT.chatMapping.toggleoff, {
            name: chat.un,
            'function': 'Random Comments'
          }));
        } else {
          MyVARS.randomCommentsEnabled = !MyVARS.randomCommentsEnabled;
          MyUTIL.sendChatOrPM(chat.type, chat.uid, CHAT.subChat(CHAT.chatMapping.toggleon, {
            name: chat.un,
            'function': 'Random Comments'
          }));
        }
      }
    }
  },
  skipHistoryCommand: { //Added 02/14/2015 Zig
    command: 'skiphistory',
    rank: 'mod',
    type: 'exact',
    functionality: function(chat, cmd) {
      if (this.type === 'exact' && chat.message.length !== cmd.length) return void(0);
      if (!BOTCOMMANDS.executable(this.rank, chat)) return void(0);
      else {
        if (MyVARS.enableSongInHistCheck) {
          MyVARS.enableSongInHistCheck = !MyVARS.enableSongInHistCheck;
          clearInterval(MyROOM.afkInterval);
          MyUTIL.sendChatOrPM(chat.type, chat.uid, CHAT.subChat(CHAT.chatMapping.toggleoff, {
            name: chat.un,
            'function': CHAT.chatMapping.repeatSongs
          }));
        } else {
          MyVARS.enableSongInHistCheck = !MyVARS.enableSongInHistCheck;
          MyROOM.afkInterval = setInterval(function() {
            AFK.afkCheck()
          }, 2 * 1000);
          MyUTIL.sendChatOrPM(chat.type, chat.uid, CHAT.subChat(CHAT.chatMapping.toggleon, {
            name: chat.un,
            'function': CHAT.chatMapping.repeatSongs
          }));
        }
      }
    }
  },
  afkremovalCommand: {
    command: 'afkremoval',
    rank: 'mod',
    type: 'exact',
    functionality: function(chat, cmd) {
      if (this.type === 'exact' && chat.message.length !== cmd.length) return void(0);
      if (!BOTCOMMANDS.executable(this.rank, chat)) return void(0);
      else {
        if (MyVARS.enableAfkRemoval) {
          MyVARS.enableAfkRemoval = !MyVARS.enableAfkRemoval;
          clearInterval(MyROOM.afkInterval);
          MyUTIL.sendChatOrPM(chat.type, chat.uid, CHAT.subChat(CHAT.chatMapping.toggleoff, {
            name: chat.un,
            'function': CHAT.chatMapping.afkremoval
          }));
        } else {
          MyVARS.enableAfkRemoval = !MyVARS.enableAfkRemoval;
          MyROOM.afkInterval = setInterval(function() {
				AFK.afkCheck()
          }, 2 * 1000);
          MyUTIL.sendChatOrPM(chat.type, chat.uid, CHAT.subChat(CHAT.chatMapping.toggleon, {
            name: chat.un,
            'function': CHAT.chatMapping.afkremoval
          }));
        }
      }
    }
  },
  trollCommand: {
    command: 'troll',
    rank: 'bouncer',
    type: 'startsWith',
    functionality: function(chat, cmd) {
      try {
        if (this.type === 'exact' && chat.message.length !== cmd.length) return void(0);
        if (!BOTCOMMANDS.executable(this.rank, chat)) return void(0);
        var msg = chat.message;
        //if (msg.length === cmd.length) return MyUTIL.sendChatOrPM(chat.type, chat.uid, CHAT.subChat(CHAT.chatMapping.nouserspecified, {name: chat.un}));
        if (msg.length === cmd.length) return (0);
        var name = MyUTIL.defineCommandExecuteOnName(chat, cmd);
        var user = USERS.lookupLocalUser(name);
        if (typeof user === 'boolean') return MyUTIL.sendChatOrPM(chat.type, chat.uid, CHAT.subChat(CHAT.chatMapping.invaliduserspecified, {
          name: chat.un
        }));
        MyAPI.moderateBanUser(user.id, 1, MyAPI.BAN.PERMA);
      } catch (err) {
        MyUTIL.logException("trollCommand: " + err.message);
      }
    }
  },
  afkresetCommand: {
    command: 'afkreset',
    rank: 'bouncer',
    type: 'startsWith',
    functionality: function(chat, cmd) {
      if (this.type === 'exact' && chat.message.length !== cmd.length) return void(0);
      if (!BOTCOMMANDS.executable(this.rank, chat)) return void(0);
      else {
        var msg = chat.message;
        if (msg.length === cmd.length) return MyUTIL.sendChatOrPM(chat.type, chat.uid, CHAT.subChat(CHAT.chatMapping.nouserspecified, {
          name: chat.un
        }));
        var name = MyUTIL.defineCommandExecuteOnName(chat, cmd);
        var user = USERS.lookupLocalUser(name);
        if (typeof user === 'boolean') return MyUTIL.sendChatOrPM(chat.type, chat.uid, CHAT.subChat(CHAT.chatMapping.invaliduserspecified, {
          name: chat.un
        }));
        USERS.setLastActivity(user, false);
        MyUTIL.sendChat(CHAT.subChat(CHAT.chatMapping.afkstatusreset, {
          name: chat.un,
          username: name
        }));
      }
    }
  },

  afktimeCommand: {
    command: 'afktime',
    rank: 'bouncer',
    type: 'startsWith',
    functionality: function(chat, cmd) {
      if (this.type === 'exact' && chat.message.length !== cmd.length) return void(0);
      if (!BOTCOMMANDS.executable(this.rank, chat)) return void(0);
      else {
        var msg = chat.message;
        if (msg.length === cmd.length) return MyUTIL.sendChatOrPM(chat.type, chat.uid, CHAT.subChat(CHAT.chatMapping.nouserspecified, {
          name: chat.un
        }));
		var name = MyUTIL.defineCommandExecuteOnName(chat, cmd);
        var user = USERS.lookupLocalUser(name);
        if (typeof user === 'boolean') return MyUTIL.sendChatOrPM(chat.type, chat.uid, CHAT.subChat(CHAT.chatMapping.invaliduserspecified, {
          name: chat.un
        }));
        var lastActive = USERS.getLastActivity(user);
        var inactivity = Date.now() - lastActive;
        var time = MyUTIL.msToStr(inactivity);
        MyUTIL.sendChatOrPM(chat.type, chat.uid, CHAT.subChat(CHAT.chatMapping.inactivefor, {
          name: chat.un,
          username: name,
          time: time
        }));
      }
    }
  },
  autowootCommand: {
    command: ['autowoot', 'autowoot?','autobop', 'autobop?'],
    rank: 'user',
    type: 'exact',
    functionality: function(chat, cmd) {
      if (this.type === 'exact' && chat.message.length !== cmd.length) return void(0);
      if (!BOTCOMMANDS.executable(this.rank, chat)) return void(0);
      else {
        MyUTIL.sendChatOrPM(chat.type, chat.uid, "Here are two options for auto-wooting:");
        setTimeout(function () { MyUTIL.sendChatOrPM(chat.type, chat.uid, "1. Chrome extension - TT Plugged in: https://chrome.google.com/webstore/detail/tt-plugged-in/edoelilfhbiliocedcghdffjnbnplcfb"); }, 250);
		setTimeout(function () { MyUTIL.sendChatOrPM(chat.type, chat.uid, "2. Izzmo's bookmark link: http://www.pinnacleofdestruction.net/tt/?fbclid=IwAR1K7W4omY01rg0m3Pz8-_wEhmDb3VavgZr9HMC__KzEwGKX-ZAr79g9z8I"); }, 500);

      }
    }
  },

  baCommand: {
    command: 'ba',
    rank: 'user',
    type: 'exact',
    functionality: function(chat, cmd) {
      if (this.type === 'exact' && chat.message.length !== cmd.length) return void(0);
      if (!BOTCOMMANDS.executable(this.rank, chat)) return void(0);
      else {
        MyUTIL.sendChatOrPM(chat.type, chat.uid, CHAT.chatMapping.brandambassador);
      }
    }
  },

  banCommand: {
    command: 'ban',
    rank: 'bouncer',
    type: 'startsWith',
    functionality: function(chat, cmd) {
      if (this.type === 'exact' && chat.message.length !== cmd.length) return void(0);
      if (!BOTCOMMANDS.executable(this.rank, chat)) return void(0);
      else {
        var msg = chat.message;
        if (msg.length === cmd.length) return MyUTIL.sendChatOrPM(chat.type, chat.uid, CHAT.subChat(CHAT.chatMapping.nouserspecified, {
          name: chat.un
        }));
        var name = MyUTIL.defineCommandExecuteOnName(chat, cmd);
        var user = USERS.lookupLocalUser(name);
        if (typeof user === 'boolean') return MyUTIL.sendChatOrPM(chat.type, chat.uid, CHAT.subChat(CHAT.chatMapping.invaliduserspecified, {
          name: chat.un
        }));
        MyAPI.moderateBanUser(user.id, 1, MyAPI.BAN.DAY);
      }
    }
  },
  blinfoCommand: {
    command: 'blinfo',
    rank: 'bouncer',
    type: 'exact',
    functionality: function(chat, cmd) {
      if (this.type === 'exact' && chat.message.length !== cmd.length) return void(0);
      if (!BOTCOMMANDS.executable(this.rank, chat)) return void(0);
      else {
        var author = MyAPI.CurrentSong().author;
        var title = MyAPI.CurrentSong().title;
        var name = chat.un;
        var format = MyAPI.CurrentSong().format;
        var cid = MyAPI.CurrentSong().cid;
        var songid = format + ":" + cid;
        MyUTIL.sendChatOrPM(chat.type, chat.uid, CHAT.subChat(CHAT.chatMapping.blinfo, {
          name: name,
          author: author,
          title: title,
          songid: songid
        }));
      }
    }
  },

  bouncerPlusCommand: {
    command: 'bouncer+',
    rank: 'mod',
    type: 'exact',
    functionality: function(chat, cmd) {
      if (this.type === 'exact' && chat.message.length !== cmd.length) return void(0);
      if (!BOTCOMMANDS.executable(this.rank, chat)) return void(0);
      else {
        var msg = chat.message;
        if (MyVARS.bouncerPlus) {
          MyVARS.bouncerPlus = false;
          return MyUTIL.sendChatOrPM(chat.type, chat.uid, CHAT.subChat(CHAT.chatMapping.toggleoff, {
            name: chat.un,
            'function': 'Bouncer+'
          }));
        } else {
          if (!MyVARS.bouncerPlus) {
            var id = chat.uid;
            var perm = USERS.getPermission(id);
            if (perm > PERM.ROLE.BOUNCER) {
              MyVARS.bouncerPlus = true;
              return MyUTIL.sendChatOrPM(chat.type, chat.uid, CHAT.subChat(CHAT.chatMapping.toggleon, {
                name: chat.un,
                'function': 'Bouncer+'
              }));
            }
          } else return MyUTIL.sendChatOrPM(chat.type, chat.uid, CHAT.subChat(CHAT.chatMapping.bouncerplusrank, {
            name: chat.un
          }));
        }
      }
    }
  },
  autowootbotCommand: {
    command: 'autowootbot',
    rank: 'manager',
    type: 'exact',
    functionality: function(chat, cmd) {
      try {
        if (this.type === 'exact' && chat.message.length !== cmd.length) return void(0);
        if (!BOTCOMMANDS.executable(this.rank, chat)) return void(0);
        MyVARS.autoWootBot = (!MyVARS.autoWootBot);
      } 
	  catch (err) { MyUTIL.logException("autowootbotCommand: " + err.message); }
    }
  },


  clearchatCommand: {
    command: 'clearchat',
    rank: 'manager',
    type: 'exact',
    functionality: function(chat, cmd) {
      if (this.type === 'exact' && chat.message.length !== cmd.length) return void(0);
      if (!BOTCOMMANDS.executable(this.rank, chat)) return void(0);
      else {
        var currentchat = $('#chat-messages').children();
        for (var i = 0; i < currentchat.length; i++) {
          MyAPI.moderateDeleteChat(currentchat[i].getAttribute("data-cid"));
        }
        return MyUTIL.sendChatOrPM(chat.type, chat.uid, CHAT.subChat(CHAT.chatMapping.chatcleared, {
          name: chat.un
        }));
      }
    }
  },

//  commandsCommand: {
//    command: 'commands',
//    rank: 'user',
//    type: 'exact',
//    functionality: function(chat, cmd) {
//      if (this.type === 'exact' && chat.message.length !== cmd.length) return void(0);
//      if (!BOTCOMMANDS.executable(this.rank, chat)) return void(0);
//      else {
//        MyUTIL.sendChatOrPM(chat.type, chat.uid, CHAT.subChat(CHAT.chatMapping.commandslink, {
//          botname: MyVARS.loggedInName,
//          link: MyVARS.cmdLink
//        }));
//      }
//    }
//  },

  cookieCommand: {
    command: 'cookie',
    rank: 'user',
    type: 'startsWith',
    cookies: ['has given you a chocolate chip cookie!',
      'has given you a soft homemade oatmeal cookie!',
      'has given you a plain, dry, old cookie. It was the last one in the bag. Gross.',
      'gives you a sugar cookie. What, no frosting and sprinkles? 0/10 would not touch.',
      'gives you a chocolate chip cookie. Oh wait, those are raisins. Bleck!',
      'gives you an enormous cookie. Poking it gives you more cookies. Weird.',
      'gives you a fortune cookie. It reads "Why aren\'t you working on any projects?"',
      'gives you a fortune cookie. It reads "Give that special someone a compliment"',
      'gives you a fortune cookie. It reads "Take a risk!"',
      'gives you a fortune cookie. It reads "Go outside."',
      'gives you a fortune cookie. It reads "Don\'t forget to eat your veggies!"',
      'gives you a fortune cookie. It reads "Do you even lift?"',
      'gives you a fortune cookie. It reads "m808 pls"',
      'gives you a fortune cookie. It reads "If you move your hips, you\'ll get all the ladies."',
      'gives you a fortune cookie. It reads "I love you."',
      'gives you a Golden Cookie. You can\'t eat it because it is made of gold. Dammit.',
      'gives you an Oreo cookie with a glass of milk!',
      'gives you a rainbow cookie made with love :heart:',
      'gives you an old cookie that was left out in the rain, it\'s moldy.',
      'bakes you fresh cookies, it smells amazing.'
    ],
    getCookie: function() {
      var c = Math.floor(Math.random() * this.cookies.length);
      return this.cookies[c];
    },
    functionality: function(chat, cmd) {
      if (this.type === 'exact' && chat.message.length !== cmd.length) return void(0);
      if (!BOTCOMMANDS.executable(this.rank, chat)) return void(0);
      else {
        var msg = chat.message;

        var space = msg.indexOf(' ');
        if (space === -1) {
          MyUTIL.sendChatOrPM(chat.type, chat.uid, CHAT.chatMapping.eatcookie);
          return false;
        } else {
          var name = msg.substring(space + 2);
          var user = USERS.lookupLocalUser(name);
          if (user === false || !user.inRoom) {
            return MyUTIL.sendChatOrPM(chat.type, chat.uid, CHAT.subChat(CHAT.chatMapping.nousercookie, {
              name: name
            }));
          } else if (user.username === chat.un) {
            return MyUTIL.sendChatOrPM(chat.type, chat.uid, CHAT.subChat(CHAT.chatMapping.selfcookie, {
              name: name
            }));
          } else {
            return MyUTIL.sendChat(CHAT.subChat(CHAT.chatMapping.cookie, {
              nameto: user.username,
              namefrom: chat.un,
              cookie: this.getCookie()
            }));
          }
        }
      }
    }
  },

  cycleCommand: {
    command: 'cycle',
    rank: 'manager',
    type: 'exact',
    functionality: function(chat, cmd) {
      if (this.type === 'exact' && chat.message.length !== cmd.length) return void(0);
      if (!BOTCOMMANDS.executable(this.rank, chat)) return void(0);
      else {
        MyUTIL.changeDJCycle();
      }
    }
  },

  cycleguardCommand: {
    command: 'cycleguard',
    rank: 'bouncer',
    type: 'exact',
    functionality: function(chat, cmd) {
      if (this.type === 'exact' && chat.message.length !== cmd.length) return void(0);
      if (!BOTCOMMANDS.executable(this.rank, chat)) return void(0);
      else {
        if (MyVARS.cycleGuard) {
          MyVARS.cycleGuard = !MyVARS.cycleGuard;
          return MyUTIL.sendChatOrPM(chat.type, chat.uid, CHAT.subChat(CHAT.chatMapping.toggleoff, {
            name: chat.un,
            'function': CHAT.chatMapping.cycleguard
          }));
        } else {
          MyVARS.cycleGuard = !MyVARS.cycleGuard;
          return MyUTIL.sendChatOrPM(chat.type, chat.uid, CHAT.subChat(CHAT.chatMapping.toggleon, {
            name: chat.un,
            'function': CHAT.chatMapping.cycleguard
          }));
        }

      }
    }
  },

  cycletimerCommand: {
    command: 'cycletimer',
    rank: 'manager',
    type: 'startsWith',
    functionality: function(chat, cmd) {
      if (this.type === 'exact' && chat.message.length !== cmd.length) return void(0);
      if (!BOTCOMMANDS.executable(this.rank, chat)) return void(0);
      else {
        var msg = chat.message;
        var cycleTime = msg.substring(cmd.length + 1);
        if (!isNaN(cycleTime) && cycleTime !== "") {
          MyVARS.maximumCycletime = cycleTime;
          return MyUTIL.sendChatOrPM(chat.type, chat.uid, CHAT.subChat(CHAT.chatMapping.cycleguardtime, {
            name: chat.un,
            time: MyVARS.maximumCycletime
          }));
        } else return MyUTIL.sendChatOrPM(chat.type, chat.uid, CHAT.subChat(CHAT.chatMapping.invalidtime, {
          name: chat.un
        }));

      }
    }
  },

  voteskipCommand: {
    command: 'voteskip',
    rank: 'manager',
    type: 'startsWith',
    functionality: function(chat, cmd) {
      if (this.type === 'exact' && chat.message.length !== cmd.length) return void(0);
      if (!BOTCOMMANDS.executable(this.rank, chat)) return void(0);
      else {
        var msg = chat.message;
        if (msg.length <= cmd.length + 1) return MyUTIL.sendChatOrPM(chat.type, chat.uid, CHAT.subChat(CHAT.chatMapping.voteskiplimit, {
          name: chat.un,
          limit: MyVARS.voteSkipLimit
        }));
        var argument = msg.substring(cmd.length + 1);
        if (!MyVARS.voteSkipEnabled) MyVARS.voteSkipEnabled = !MyVARS.voteSkipEnabled;
        if (isNaN(argument)) {
          MyUTIL.sendChatOrPM(chat.type, chat.uid, CHAT.subChat(CHAT.chatMapping.voteskipinvalidlimit, {
            name: chat.un
          }));
        } else {
          MyVARS.voteSkipLimit = argument;
          MyUTIL.sendChatOrPM(chat.type, chat.uid, CHAT.subChat(CHAT.chatMapping.voteskipsetlimit, {
            name: chat.un,
            limit: MyVARS.voteSkipLimit
          }));
        }
      }
    }
  },

  togglevoteskipCommand: {
    command: 'togglevoteskip',
    rank: 'bouncer',
    type: 'exact',
    functionality: function(chat, cmd) {
      if (this.type === 'exact' && chat.message.length !== cmd.length) return void(0);
      if (!BOTCOMMANDS.executable(this.rank, chat)) return void(0);
      else {
        if (MyVARS.voteSkipEnabled) {
          MyVARS.voteSkipEnabled = !MyVARS.voteSkipEnabled;
          MyUTIL.sendChatOrPM(chat.type, chat.uid, CHAT.subChat(CHAT.chatMapping.toggleoff, {
            name: chat.un,
            'function': CHAT.chatMapping.voteskip
          }));
        } else {
          MyVARS.voteSkipEnabled = !MyVARS.voteSkipEnabled;
          MyUTIL.sendChatOrPM(chat.type, chat.uid, CHAT.subChat(CHAT.chatMapping.toggleon, {
            name: chat.un,
            'function': CHAT.chatMapping.voteskip
          }));
        }
      }
    }
  },

  dclookupCommand: {
    command: ['dclookup', 'dc', 'back'],
    rank: 'user',
    type: 'startsWith',
    functionality: function(chat, cmd) {
      if (this.type === 'exact' && chat.message.length !== cmd.length) return void(0);
      if (!BOTCOMMANDS.executable(this.rank, chat)) return void(0);
      else {
        var msg = chat.message;
        var name;
        if (msg.length === cmd.length) name = chat.un;
        else {
		  name = MyUTIL.defineCommandExecuteOnName(chat, cmd);
          var perm = USERS.getPermission(chat.uid);
          if (perm < PERM.ROLE.BOUNCER) return MyUTIL.sendChatOrPM(chat.type, chat.uid, CHAT.subChat(CHAT.chatMapping.dclookuprank, {
            name: chat.un
          }));
        }
        var user = USERS.lookupLocalUser(name);
        if (typeof user === 'boolean') return MyUTIL.sendChatOrPM(chat.type, chat.uid, CHAT.subChat(CHAT.chatMapping.invaliduserspecified, {
          name: chat.un
        }));
        var toChat = USERS.dclookup(user.id);
        MyUTIL.sendChatOrPM(chat.type, chat.uid, toChat);
      }
    }
  },

  // deletechatCommand: {
  //     command: 'deletechat',
  //     rank: 'mod',
  //     type: 'startsWith',
  //     functionality: function (chat, cmd) {
  //         if (this.type === 'exact' && chat.message.length !== cmd.length) return void (0);
  //         if (!BOTCOMMANDS.executable(this.rank, chat)) return void (0);
  //         else {
  //             var msg = chat.message;
  //             if (msg.length === cmd.length) return MyUTIL.sendChatOrPM(chat.type, chat.uid, CHAT.subChat(CHAT.chatMapping.nouserspecified, {name: chat.un}));
  //             var name = MyUTIL.defineCommandExecuteOnName(chat, cmd);
  //             var user = USERS.lookupLocalUser(name);
  //             if (typeof user === 'boolean') return MyUTIL.sendChatOrPM(chat.type, chat.uid, CHAT.subChat(CHAT.chatMapping.invaliduserspecified, {name: chat.un}));
  //             var chats = $('.from');
  //             for (var i = 0; i < chats.length; i++) {
  //                 var n = chats[i].textContent;
  //                 if (name.trim() === n.trim()) {
  //                     var cid = $(chats[i]).parent()[0].getAttribute('data-cid');
  //                     MyAPI.moderateDeleteChat(cid);
  //                 }
  //             }
  //             MyUTIL.sendChatOrPM(chat.type, chat.uid, CHAT.subChat(CHAT.chatMapping.deletechat, {name: chat.un, username: name}));
  //         }
  //     }
  // },

  emojiCommand: {
    command: 'emoji',
    rank: 'user',
    type: 'exact',
    functionality: function(chat, cmd) {
      if (this.type === 'exact' && chat.message.length !== cmd.length) return void(0);
      if (!BOTCOMMANDS.executable(this.rank, chat)) return void(0);
      else {
        var link = 'http://www.emoji-cheat-sheet.com/';
        MyUTIL.sendChatOrPM(chat.type, chat.uid, CHAT.subChat(CHAT.chatMapping.emojilist, {
          link: link
        }));
      }
    }
  },

  etaCommand: {
    command: 'eta',
    rank: 'user',
    type: 'startsWith',
    functionality: function(chat, cmd) {
      if (this.type === 'exact' && chat.message.length !== cmd.length) return void(0);
      if (!BOTCOMMANDS.executable(this.rank, chat)) return void(0);
      else {
        var perm = USERS.getPermission(chat.uid);
        var msg = chat.message;
        var name;
        if (msg.length > cmd.length) {
          if (perm < PERM.ROLE.BOUNCER) return void(0);
		  name = MyUTIL.defineCommandExecuteOnName(chat, cmd);
        } else name = chat.un;
        var user = USERS.lookupLocalUser(name);
        if (typeof user === 'boolean') return MyUTIL.sendChatOrPM(chat.type, chat.uid, CHAT.subChat(CHAT.chatMapping.invaliduserspecified, {
          name: chat.un
        }));
        var pos = MyAPI.getDjListPosition(user.id);
        if (pos < 0) return MyUTIL.sendChatOrPM(chat.type, chat.uid, CHAT.subChat(CHAT.chatMapping.notinwaitlist, {
          name: name
        }));
        var timeRemaining = MyAPI.getTimeRemaining();
        var estimateMS = ((pos * 4 * 60) + timeRemaining) * 1000;
        var estimateString = MyUTIL.msToStr(estimateMS);
        MyUTIL.sendChatOrPM(chat.type, chat.uid, CHAT.subChat(CHAT.chatMapping.eta, {
          name: name,
          time: estimateString
        }));
      }
    }
  },

  fbCommand: {
    command: 'fb',
    rank: 'user',
    type: 'exact',
    functionality: function(chat, cmd) {
      if (this.type === 'exact' && chat.message.length !== cmd.length) return void(0);
      if (!BOTCOMMANDS.executable(this.rank, chat)) return void(0);
      else {
        if (typeof MyVARS.fbLink === "string")
          MyUTIL.sendChatOrPM(chat.type, chat.uid, CHAT.subChat(CHAT.chatMapping.facebook, {
            link: MyVARS.fbLink
          }));
      }
    }
  },

  filterCommand: {
    command: 'filter',
    rank: 'bouncer',
    type: 'exact',
    functionality: function(chat, cmd) {
      if (this.type === 'exact' && chat.message.length !== cmd.length) return void(0);
      if (!BOTCOMMANDS.executable(this.rank, chat)) return void(0);
      else {
        if (MyVARS.filterChat) {
          MyVARS.filterChat = !MyVARS.filterChat;
          return MyUTIL.sendChatOrPM(chat.type, chat.uid, CHAT.subChat(CHAT.chatMapping.toggleoff, {
            name: chat.un,
            'function': CHAT.chatMapping.chatfilter
          }));
        } else {
          MyVARS.filterChat = !MyVARS.filterChat;
          return MyUTIL.sendChatOrPM(chat.type, chat.uid, CHAT.subChat(CHAT.chatMapping.toggleon, {
            name: chat.un,
            'function': CHAT.chatMapping.chatfilter
          }));
        }
      }
    }
  },

  ghostbusterCommand: {
    command: 'ghostbuster',
    rank: 'user',
    type: 'startsWith',
    functionality: function(chat, cmd) {
      if (this.type === 'exact' && chat.message.length !== cmd.length) return void(0);
      if (!BOTCOMMANDS.executable(this.rank, chat)) return void(0);
      else {
        var msg = chat.message;
        var name;
        if (msg.length === cmd.length) name = chat.un;
        else {
		  name = MyUTIL.defineCommandExecuteOnName(chat, cmd);
        }
        var user = USERS.lookupLocalUser(name);
        if (user === false || !user.inRoom) {
          return MyUTIL.sendChatOrPM(chat.type, chat.uid, CHAT.subChat(CHAT.chatMapping.ghosting, {
            name1: chat.un,
            name2: name
          }));
        } else MyUTIL.sendChatOrPM(chat.type, chat.uid, CHAT.subChat(CHAT.chatMapping.notghosting, {
          name1: chat.un,
          name2: name
        }));
      }
    }
  },

  gifCommand: {
    command: ['gif', 'giphy'],
    rank: 'cohost',
    type: 'startsWith',
    functionality: function(chat, cmd) {
      if (this.type === 'exact' && chat.message.length !== cmd.length) return void(0);
      if (!MyVARS.gifEnabled) return void(0);
      if (!BOTCOMMANDS.executable(this.rank, chat)) return void(0);
      else {
        var msg = chat.message;
        if (msg.length !== cmd.length) {
          function get_id(api_key, fixedtag, func) {
            // Old URL: "https://MyAPI.giphy.com/v1/gifs/random?", 
            $.getJSON(
              "https://tv.giphy.com/v1/gifs/random?", {
                "format": "json",
                "api_key": api_key,
                "rating": rating,
                "tag": fixedtag
              },
              function(response) {
                func(response.data.id);
              }
            )
          }
          var api_key = "dc6zaTOxFJmzC"; // public beta key
          var rating = "pg-13"; // PG 13 gifs
          var tag = msg.substr(cmd.length + 1);
          var fixedtag = tag.replace(/ /g, "+");
          var commatag = tag.replace(/ /g, ", ");
          get_id(api_key, tag, function(id) {
            if (typeof id !== 'undefined') {
              MyUTIL.sendChatOrPM(chat.type, chat.uid, CHAT.subChat(CHAT.chatMapping.validgiftags, {
                name: chat.un,
                id: id,
                tags: commatag
              }));
            } else {
              MyUTIL.sendChatOrPM(chat.type, chat.uid, CHAT.subChat(CHAT.chatMapping.invalidgiftags, {
                name: chat.un,
                tags: commatag
              }));
            }
          });
        } else {
          function get_random_id(api_key, func) {
            $.getJSON(
              "https://MyAPI.giphy.com/v1/gifs/random?", {
                "format": "json",
                "api_key": api_key,
                "rating": rating
              },
              function(response) {
                func(response.data.id);
              }
            )
          }
          var api_key = "dc6zaTOxFJmzC"; // public beta key
          var rating = "pg-13"; // PG 13 gifs
          get_random_id(api_key, function(id) {
            if (typeof id !== 'undefined') {
              MyUTIL.sendChatOrPM(chat.type, chat.uid, CHAT.subChat(CHAT.chatMapping.validgifrandom, {
                name: chat.un,
                id: id
              }));
            } else {
              MyUTIL.sendChatOrPM(chat.type, chat.uid, CHAT.subChat(CHAT.chatMapping.invalidgifrandom, {
                name: chat.un
              }));
            }
          });
        }
      }
    }
  },

//  helpCommand: {
//    command: 'help',
//    rank: 'user',
//    type: 'exact',
//    functionality: function(chat, cmd) {
//      if (this.type === 'exact' && chat.message.length !== cmd.length) return void(0);
//      if (!BOTCOMMANDS.executable(this.rank, chat)) return void(0);
//      else {
//        var link = "http://i.imgur.com/SBAso1N.jpg";
//        MyUTIL.sendChatOrPM(chat.type, chat.uid, CHAT.subChat(CHAT.chatMapping.starterhelp, {
//          link: link
//        }));
//      }
//    }
//  },

  hopupCommand: {
    command: 'hopup',
    rank: 'bouncer',
    type: 'exact',
    functionality: function(chat, cmd) {
      if (this.type === 'exact' && chat.message.length !== cmd.length) return void(0);
      if (!BOTCOMMANDS.executable(this.rank, chat)) return void(0);
      else {
        MyAPI.botDjNow();
      }
    }
  },
  hopdownCommand: {
    command: 'hopdown',
    rank: 'bouncer',
    type: 'exact',
    functionality: function(chat, cmd) {
      if (this.type === 'exact' && chat.message.length !== cmd.length) return void(0);
      if (!BOTCOMMANDS.executable(this.rank, chat)) return void(0);
      else {
        MyVARS.hoppingDownNow = true;
        setTimeout(function() {
          MyVARS.hoppingDownNow = false;
        }, 2000);
        MyAPI.botHopDown();
      }
    }
  },
  bootCommand: {
    command: 'boot',
    rank: 'user',
    type: 'startsWith',
    functionality: function(chat, cmd) {
      if (this.type === 'exact' && chat.message.length !== cmd.length) return void(0);
      if (!BOTCOMMANDS.executable(this.rank, chat)) return void(0);
      var msg = chat.message;
      var name;
      var byusername = " ";
      if (msg.length === cmd.length) name = chat.un;
      else {
		name = MyUTIL.defineCommandExecuteOnName(chat, cmd);
        var perm = USERS.getPermission(chat.uid);
        if (perm < PERM.ROLE.BOUNCER) return MyUTIL.sendChatOrPM(chat.type, chat.uid, CHAT.subChat(CHAT.chatMapping.bootrank, {
          name: chat.un
        }));
        byusername = " [ executed by " + chat.un + " ]";
      }
      var user = USERS.lookupLocalUser(name); 
      if (typeof user === 'boolean') return MyUTIL.sendChatOrPM(chat.type, chat.uid, CHAT.subChat(CHAT.chatMapping.invaliduserspecified, {
        name: chat.un
      }));
      if (user.bootable) {
        user.bootable = false;
        MyUTIL.sendChatOrPM(chat.type, chat.uid, CHAT.subChat(CHAT.chatMapping.bootableDisabled, {
          name: name,
          userbyname: byusername
        }));
      } else {
        user.bootable = true;
        if (MyAPI.djCount() === 0) MyAPI.botDjNow(); // Jump in line if there is no wailist
        MyUTIL.sendChat(CHAT.subChat(CHAT.chatMapping.bootableEnabled, {
          name: name,
          userbyname: byusername
        }));
      }
    }
  },

  joinCommand: {
    command: ['join','in'],
    rank: 'user',
    type: 'exact',
    functionality: function(chat, cmd) {
      if (this.type === 'exact' && chat.message.length !== cmd.length) return void(0);
      if (!BOTCOMMANDS.executable(this.rank, chat)) return void(0);
      else {
        if (MyROOM.roulette.rouletteStatus && MyROOM.roulette.participants.indexOf(chat.uid) < 0) {
          MyROOM.roulette.participants.push(chat.uid);
          MyUTIL.sendChat(CHAT.subChat(CHAT.chatMapping.roulettejoin, {
            name: chat.un
          }));
        }
      }
    }
  },

  jointimeCommand: {
    command: 'jointime',
    rank: 'bouncer',
    type: 'startsWith',
    functionality: function(chat, cmd) {
      if (this.type === 'exact' && chat.message.length !== cmd.length) return void(0);
      if (!BOTCOMMANDS.executable(this.rank, chat)) return void(0);
      else {
        var msg = chat.message;
        if (msg.length === cmd.length) return MyUTIL.sendChatOrPM(chat.type, chat.uid, CHAT.subChat(CHAT.chatMapping.nouserspecified, {
          name: chat.un
        }));
		var name = MyUTIL.defineCommandExecuteOnName(chat, cmd);
        var user = USERS.lookupLocalUser(name);
        if (typeof user === 'boolean') return MyUTIL.sendChatOrPM(chat.type, chat.uid, CHAT.subChat(CHAT.chatMapping.invaliduserspecified, {
          name: chat.un
        }));
        var join = USERS.getJointime(user);
        var time = Date.now() - join;
        var timeString = MyUTIL.msToStr(time);
        MyUTIL.sendChatOrPM(chat.type, chat.uid, CHAT.subChat(CHAT.chatMapping.jointime, {
          namefrom: chat.un,
          username: name,
          time: timeString
        }));
      }
    }
  },

  kickCommand: {
    command: 'kick',
    rank: 'bouncer',
    type: 'startsWith',
    functionality: function(chat, cmd) {
      if (this.type === 'exact' && chat.message.length !== cmd.length) return void(0);
      if (!BOTCOMMANDS.executable(this.rank, chat)) return void(0);
      else {
        var msg = chat.message;
        var lastSpace = msg.lastIndexOf(' ');
        var time;
        var name;
        if (lastSpace === msg.indexOf(' ')) {
          time = 0.25;
          name = MyUTIL.defineCommandExecuteOnName(chat, cmd);
        } else {
          time = msg.substring(lastSpace + 1);
          name = msg.substring(cmd.length + 2, lastSpace);
        }

        var user = USERS.lookupLocalUser(name);
        var from = chat.un;
        if (typeof user === 'boolean') return MyUTIL.sendChatOrPM(chat.type, chat.uid, CHAT.subChat(CHAT.chatMapping.nouserspecified, {
          name: chat.un
        }));

        var permFrom = USERS.getPermission(chat.uid);
        var permTokick = USERS.getPermission(user.id);

        if (permFrom <= permTokick)
          return MyUTIL.sendChatOrPM(chat.type, chat.uid, CHAT.subChat(CHAT.chatMapping.kickrank, {
            name: chat.un
          }));

        if (!isNaN(time)) {
          MyUTIL.sendChat(CHAT.subChat(CHAT.chatMapping.kick, {
            name: chat.un,
            username: name,
            time: time
          }));
          if (time > 24 * 60 * 60) MyAPI.moderateBanUser(user.id, 1, MyAPI.BAN.PERMA);
          else MyAPI.moderateBanUser(user.id, 1, MyAPI.BAN.DAY);
          setTimeout(function(id, name) {
            MyAPI.moderateUnbanUser(id);
            //MyUTIL.logDebug('Unbanned @' + name + '. (' + id + ')');
          }, time * 60 * 1000, user.id, name);
        } else MyUTIL.sendChatOrPM(chat.type, chat.uid, CHAT.subChat(CHAT.chatMapping.invalidtime, {
          name: chat.un
        }));
      }
    }
  },

  killbotCommand: {
    command: 'killbot',
    rank: 'cohost',
    type: 'exact',
    functionality: function(chat, cmd) {
      if (this.type === 'exact' && chat.message.length !== cmd.length) return void(0);
      if (!BOTCOMMANDS.executable(this.rank, chat)) return void(0);
      else {
        STORAGE.storeToStorage();
        MyUTIL.sendChat(CHAT.chatMapping.kill);
        MyEVENTS.disconnectAPI();
        setTimeout(function() {
          MyAPI.killBot();
        }, 1000);
      }
    }
  },

  leaveCommand: {
    command: ['leave','out'],
    rank: 'user',
    type: 'exact',
    functionality: function(chat, cmd) {
      if (this.type === 'exact' && chat.message.length !== cmd.length) return void(0);
      if (!BOTCOMMANDS.executable(this.rank, chat)) return void(0);
      else {
        var ind = MyROOM.roulette.participants.indexOf(chat.uid);
        if (ind > -1) {
          MyROOM.roulette.participants.splice(ind, 1);
          MyUTIL.sendChat(CHAT.subChat(CHAT.chatMapping.rouletteleave, {
            name: chat.un
          }));
        }
      }
    }
  },

  linkCommand: {
    command: 'link',
    rank: 'user',
    type: 'exact',
    functionality: function(chat, cmd) {
      if (this.type === 'exact' && chat.message.length !== cmd.length) return void(0);
      if (!BOTCOMMANDS.executable(this.rank, chat)) return void(0);
      else {
        var media = MyAPI.CurrentSong();
        var from = chat.un;
        var user = USERS.lookupLocalUser(chat.uid);
        var perm = USERS.getPermission(chat.uid);
        var isDj = false;
        if (MyAPI.CurrentDJID() === chat.uid) isDj = true;
        if (perm >= PERM.ROLE.DJ || isDj) {
          if (media.format === 1) {
            var linkToSong = "https://www.youtube.com/watch?v=" + media.cid;
            MyUTIL.sendChatOrPM(chat.type, chat.uid, CHAT.subChat(CHAT.chatMapping.songlink, {
              name: from,
              link: linkToSong
            }));
          }
          if (media.format === 2) {
            SC.get('/tracks/' + media.cid, function(sound) {
              MyUTIL.sendChatOrPM(chat.type, chat.uid, CHAT.subChat(CHAT.chatMapping.songlink, {
                name: from,
                link: sound.permalink_url
              }));
            });
          }
        }
      }
    }
  },

  lockCommand: {
    command: 'lock',
    rank: 'mod',
    type: 'exact',
    functionality: function(chat, cmd) {
      if (this.type === 'exact' && chat.message.length !== cmd.length) return void(0);
      if (!BOTCOMMANDS.executable(this.rank, chat)) return void(0);
      else {
        MyUTIL.booth.lockBooth();
      }
    }
  },

  lockdownCommand: {
    command: 'lockdown',
    rank: 'mod',
    type: 'exact',
    functionality: function(chat, cmd) {
      if (this.type === 'exact' && chat.message.length !== cmd.length) return void(0);
      if (!BOTCOMMANDS.executable(this.rank, chat)) return void(0);
      else {
        var temp = MyVARS.lockdownEnabled;
        MyVARS.lockdownEnabled = !temp;
        if (MyVARS.lockdownEnabled) {
          return MyUTIL.sendChatOrPM(chat.type, chat.uid, CHAT.subChat(CHAT.chatMapping.toggleon, {
            name: chat.un,
            'function': CHAT.chatMapping.lockdown
          }));
        } else return MyUTIL.sendChatOrPM(chat.type, chat.uid, CHAT.subChat(CHAT.chatMapping.toggleoff, {
          name: chat.un,
          'function': CHAT.chatMapping.lockdown
        }));
      }
    }
  },

  lockguardCommand: {
    command: 'lockguard',
    rank: 'bouncer',
    type: 'exact',
    functionality: function(chat, cmd) {
      if (this.type === 'exact' && chat.message.length !== cmd.length) return void(0);
      if (!BOTCOMMANDS.executable(this.rank, chat)) return void(0);
      else {
        if (MyVARS.lockGuard) {
          MyVARS.lockGuard = !MyVARS.lockGuard;
          return MyUTIL.sendChatOrPM(chat.type, chat.uid, CHAT.subChat(CHAT.chatMapping.toggleoff, {
            name: chat.un,
            'function': CHAT.chatMapping.lockdown
          }));
        } else {
          MyVARS.lockGuard = !MyVARS.lockGuard;
          return MyUTIL.sendChatOrPM(chat.type, chat.uid, CHAT.subChat(CHAT.chatMapping.toggleon, {
            name: chat.un,
            'function': CHAT.chatMapping.lockguard
          }));
        }
      }
    }
  },

  lockskipCommand: {
    command: 'lockskip',
    rank: 'bouncer',
    type: 'startsWith',
    functionality: function(chat, cmd) {
      if (this.type === 'exact' && chat.message.length !== cmd.length) return void(0);
      if (!BOTCOMMANDS.executable(this.rank, chat)) return void(0);
      else {
		  var dj = USERS.getDJ();
		  var id = dj.id;
		  var name = dj.username;
		  var msgSend = '@' + name + ': ';
		  MyROOM.queueable = false;

		  if (chat.message.length === cmd.length) {
			MyUTIL.sendChatOrPM(chat.type, chat.uid, CHAT.subChat(CHAT.chatMapping.usedlockskip, {
			  name: chat.un
			}));
			MyUTIL.booth.lockBooth();
			setTimeout(function(id) {
			  MyUTIL.logInfo("Skip song: " + MyAPI.CurrentSong().title + " by: " + chat.un + " Reason: Lockskip command");
			  MyUTIL.skipSong(true, "Lock-Skip1");
			  setTimeout(function(id) {
				USERS.moveUser(id, MyVARS.lockskipPosition, false);
				MyROOM.queueable = true;
				setTimeout(function() {
				  MyUTIL.booth.unlockBooth();
				}, 1000);
			  }, 1500, id);
			}, 1000, id);
			return void(0);
		  }
		  var validReason = false;
		  var msg = chat.message;
		  var reason = msg.substring(cmd.length + 1);
		  for (var i = 0; i < MyVARS.lockskipReasons.length; i++) {
			var r = MyVARS.lockskipReasons[i][0];
			if (reason.indexOf(r) !== -1) {
			  validReason = true;
			  msgSend += MyVARS.lockskipReasons[i][1];
			}
		  }
		  if (validReason) {
			MyUTIL.sendChatOrPM(chat.type, chat.uid, CHAT.subChat(CHAT.chatMapping.usedlockskip, {
			  name: chat.un
			}));
			MyUTIL.booth.lockBooth();
			setTimeout(function(id) {
			  MyUTIL.logInfo("Skip song: " + MyAPI.CurrentSong().title + " by: " + chat.un + " Reason: Lockskip command");
			  MyUTIL.skipSong(true, "Lock-Skip2");
			  MyUTIL.sendChatOrPM(chat.type, chat.uid, msgSend);
			  setTimeout(function(id) {
				USERS.moveUser(id, MyVARS.lockskipPosition, false);
				MyROOM.queueable = true;
				setTimeout(function() {
				  MyUTIL.booth.unlockBooth();
				}, 1000);
			  }, 1500, id);
			}, 1000, id);
			return void(0);
		  }
      }
    }
  },

  lockskipposCommand: {
    command: 'lockskippos',
    rank: 'manager',
    type: 'startsWith',
    functionality: function(chat, cmd) {
      if (this.type === 'exact' && chat.message.length !== cmd.length) return void(0);
      if (!BOTCOMMANDS.executable(this.rank, chat)) return void(0);
      else {
        var msg = chat.message;
        var pos = msg.substring(cmd.length + 1);
        if (!isNaN(pos)) {
          MyVARS.lockskipPosition = pos;
          return MyUTIL.sendChatOrPM(chat.type, chat.uid, CHAT.subChat(CHAT.chatMapping.lockskippos, {
            name: chat.un,
            position: MyVARS.lockskipPosition
          }));
        } else return MyUTIL.sendChatOrPM(chat.type, chat.uid, CHAT.subChat(CHAT.chatMapping.invalidpositionspecified, {
          name: chat.un
        }));
      }
    }
  },

  locktimerCommand: {
    command: 'locktimer',
    rank: 'manager',
    type: 'startsWith',
    functionality: function(chat, cmd) {
      if (this.type === 'exact' && chat.message.length !== cmd.length) return void(0);
      if (!BOTCOMMANDS.executable(this.rank, chat)) return void(0);
      else {
        var msg = chat.message;
        var lockTime = msg.substring(cmd.length + 1);
        if (!isNaN(lockTime) && lockTime !== "") {
          MyVARS.maximumLocktime = lockTime;
          return MyUTIL.sendChatOrPM(chat.type, chat.uid, CHAT.subChat(CHAT.chatMapping.lockguardtime, {
            name: chat.un,
            time: MyVARS.maximumLocktime
          }));
        } else return MyUTIL.sendChatOrPM(chat.type, chat.uid, CHAT.subChat(CHAT.chatMapping.invalidtime, {
          name: chat.un
        }));
      }
    }
  },

  historytimeCommand: { //Added 02/14/2015 Zig 
    command: 'historytime',
    rank: 'manager',
    type: 'startsWith',
    functionality: function(chat, cmd) {
      if (this.type === 'exact' && chat.message.length !== cmd.length) return void(0);
      if (!BOTCOMMANDS.executable(this.rank, chat)) return void(0);
      else {
        var msg = chat.message;
        var maxTime = msg.substring(cmd.length + 1);
        if (!isNaN(maxTime)) {
          MyVARS.repeatSongTime = maxTime;
          return MyUTIL.sendChatOrPM(chat.type, chat.uid, CHAT.subChat(CHAT.chatMapping.repeatSongLimit, {
            name: chat.un,
            time: MyVARS.repeatSongTime
          }));
        } else return MyUTIL.sendChatOrPM(chat.type, chat.uid, CHAT.subChat(CHAT.chatMapping.invalidtime, {
          name: chat.un
        }));
      }
    }
  },
  logoutCommand: {
    command: 'logout',
    rank: 'cohost',
    type: 'exact',
    functionality: function(chat, cmd) {
      if (this.type === 'exact' && chat.message.length !== cmd.length) return void(0);
      if (!BOTCOMMANDS.executable(this.rank, chat)) return void(0);
      else {
        MyUTIL.sendChatOrPM(chat.type, chat.uid, CHAT.subChat(CHAT.chatMapping.logout, {
          name: chat.un,
          botname: MyVARS.loggedInName
        }));
        setTimeout(function() {
          $(".logout").mousedown()
        }, 1000);
      }
    }
  },
  // This was an old one that did not work:
  // logoutCommand: {
  //     command: 'logout',
  //     rank: 'mod',
  //     type: 'exact',
  //     functionality: function (chat, cmd) {
  //         if (this.type === 'exact' && chat.message.length !== cmd.length) return void (0);
  //         if (!BOTCOMMANDS.executable(this.rank, chat)) return void (0);
  //         else {
  //             $(".icon-site-logo").click();
  //             setTimeout(function (chat) {
  //                 MyUTIL.sendChatOrPM(chat.type, chat.uid, CHAT.subChat(CHAT.chatMapping.logout, {name: chat.un, botname: MyVARS.loggedInName}));
  //                 setTimeout(function () {
  //                     $(".icon-logout-grey").click();
  //                 }, 1000);
  //             }, 1000, chat);
  //         }
  //     }
  // },
  maxlengthCommand: {
    command: 'maxlength',
    rank: 'manager',
    type: 'startsWith',
    functionality: function(chat, cmd) {
      if (this.type === 'exact' && chat.message.length !== cmd.length) return void(0);
      if (!BOTCOMMANDS.executable(this.rank, chat)) return void(0);
      else {
        var msg = chat.message;
        var maxTime = msg.substring(cmd.length + 1);
        if (!isNaN(maxTime) && maxTime.length > 0) MyVARS.maximumSongLength = maxTime;
        return MyUTIL.sendChat(CHAT.subChat(CHAT.chatMapping.maxlengthtime, { name: chat.un, time: MyVARS.maximumSongLength }));
      }
    }
  },

  motdCommand: {
    command: 'motd',
    rank: 'bouncer',
    type: 'startsWith',
    functionality: function(chat, cmd) {
      if (this.type === 'exact' && chat.message.length !== cmd.length) return void(0);
      if (!BOTCOMMANDS.executable(this.rank, chat)) return void(0);
      else {
        var msg = chat.message;
        if (msg.length <= cmd.length + 1) return MyUTIL.sendChatOrPM(chat.type, chat.uid, '/me MotD: ' + MyVARS.motd);
        var argument = msg.substring(cmd.length + 1);
        if (!MyVARS.motdEnabled) MyVARS.motdEnabled = !MyVARS.motdEnabled;
        if (isNaN(argument)) {
          MyVARS.motd = argument;
          MyUTIL.sendChat(CHAT.subChat(CHAT.chatMapping.motdset, {
            msg: MyVARS.motd
          }));
        } else {
          MyVARS.motdInterval = argument;
          MyUTIL.sendChat(CHAT.subChat(CHAT.chatMapping.motdintervalset, {
            interval: MyVARS.motdInterval
          }));
        }
      }
    }
  },

  moveCommand: {
    command: 'move',
    rank: 'mod',
    type: 'startsWith',
    functionality: function(chat, cmd) {
      if (this.type === 'exact' && chat.message.length !== cmd.length) return void(0);
      if (!BOTCOMMANDS.executable(this.rank, chat)) return void(0);
      else {
        var msg = chat.message;
        if (msg.length === cmd.length) return MyUTIL.sendChatOrPM(chat.type, chat.uid, CHAT.subChat(CHAT.chatMapping.nouserspecified, {
          name: chat.un
        }));
        var firstSpace = msg.indexOf(' ');
        var lastSpace = msg.lastIndexOf(' ');
        var pos;
        var name;
        if (isNaN(parseInt(msg.substring(lastSpace + 1)))) {
          pos = 1;
          name = MyUTIL.defineCommandExecuteOnName(chat, cmd);
        } else {
          pos = parseInt(msg.substring(lastSpace + 1));
          name = msg.substring(cmd.length + 2, lastSpace);
        }
        var user = USERS.lookupLocalUser(name);
        if (typeof user === 'boolean') return MyUTIL.sendChatOrPM(chat.type, chat.uid, CHAT.subChat(CHAT.chatMapping.invaliduserspecified, {
          name: chat.un
        }));
        if (user.id === MyAPI.CurrentUserID()) return MyUTIL.sendChat(CHAT.subChat(CHAT.chatMapping.addbotwaitlist, {
          name: chat.un
        }));
        if (!isNaN(pos)) {
          MyUTIL.sendChat(CHAT.subChat(CHAT.chatMapping.move, {
            name: chat.un
          }));
          USERS.moveUser(user.id, pos, false);
        } else return MyUTIL.sendChatOrPM(chat.type, chat.uid, CHAT.subChat(CHAT.chatMapping.invalidpositionspecified, {
          name: chat.un
        }));
      }
    }
  },

  muteCommand: {
    command: 'mute',
    rank: 'bouncer',
    type: 'startsWith',
    functionality: function(chat, cmd) {
      if (this.type === 'exact' && chat.message.length !== cmd.length) return void(0);
      if (!BOTCOMMANDS.executable(this.rank, chat)) return void(0);
      else {
        var msg = chat.message;
        if (msg.length === cmd.length) return MyUTIL.sendChatOrPM(chat.type, chat.uid, CHAT.subChat(CHAT.chatMapping.nouserspecified, {
          name: chat.un
        }));
        var lastSpace = msg.lastIndexOf(' ');
        var time = null;
        var name;
        if (lastSpace === msg.indexOf(' ')) {
          name = MyUTIL.defineCommandExecuteOnName(chat, cmd);
          time = 45;
        } else {
          time = msg.substring(lastSpace + 1);
          if (isNaN(time) || time == "" || time == null || typeof time == "undefined") {
            return MyUTIL.sendChatOrPM(chat.type, chat.uid, CHAT.subChat(CHAT.chatMapping.invalidtime, {
              name: chat.un
            }));
          }
          name = msg.substring(cmd.length + 2, lastSpace);
        }
        var from = chat.un;
        var user = USERS.lookupLocalUser(name);
        if (typeof user === 'boolean') return MyUTIL.sendChatOrPM(chat.type, chat.uid, CHAT.subChat(CHAT.chatMapping.invaliduserspecified, {
          name: chat.un
        }));
        var permFrom = USERS.getPermission(chat.uid);
        var permUser = USERS.getPermission(user.id);
        if (permFrom > permUser) {
          // MyROOM.mutedUsers.push(user.id);
          // if (time === null) MyUTIL.sendChat(CHAT.subChat(CHAT.chatMapping.mutednotime, {name: chat.un, username: name}));
          // else {
          // MyUTIL.sendChat(CHAT.subChat(CHAT.chatMapping.mutedtime, {name: chat.un, username: name, time: time}));
          // setTimeout(function (id) {
          // var muted = MyROOM.mutedUsers;
          // var wasMuted = false;
          // var indexMuted = -1;
          // for (var i = 0; i < muted.length; i++) {
          // if (muted[i] === id) {
          // indexMuted = i;
          // wasMuted = true;
          // }
          // }
          // if (indexMuted > -1) {
          // MyROOM.mutedUsers.splice(indexMuted);
          // var u = USERS.lookupLocalUser(id);
          // var name = u.username;
          // MyUTIL.sendChat(CHAT.subChat(CHAT.chatMapping.unmuted, {name: chat.un, username: name}));
          // }
          // }, time * 60 * 1000, user.id);
          // }
          if (time > 45) {
            MyUTIL.sendChat(CHAT.subChat(CHAT.chatMapping.mutedmaxtime, {
              name: chat.un,
              time: "45"
            }));
            MyAPI.moderateMuteUser(user.id, 1, MyAPI.MUTE.LONG);
          } else if (time === 45) {
            MyAPI.moderateMuteUser(user.id, 1, MyAPI.MUTE.LONG);
            MyUTIL.sendChat(CHAT.subChat(CHAT.chatMapping.mutedtime, {
              name: chat.un,
              username: name,
              time: time
            }));

          } else if (time > 30) {
            MyAPI.moderateMuteUser(user.id, 1, MyAPI.MUTE.LONG);
            MyUTIL.sendChat(CHAT.subChat(CHAT.chatMapping.mutedtime, {
              name: chat.un,
              username: name,
              time: time
            }));
            setTimeout(function(id) {
              MyAPI.moderateUnmuteUser(id);
            }, time * 60 * 1000, user.id);
          } else if (time > 15) {
            MyAPI.moderateMuteUser(user.id, 1, MyAPI.MUTE.MEDIUM);
            MyUTIL.sendChat(CHAT.subChat(CHAT.chatMapping.mutedtime, {
              name: chat.un,
              username: name,
              time: time
            }));
            setTimeout(function(id) {
              MyAPI.moderateUnmuteUser(id);
            }, time * 60 * 1000, user.id);
          } else {
            MyAPI.moderateMuteUser(user.id, 1, MyAPI.MUTE.SHORT);
            MyUTIL.sendChat(CHAT.subChat(CHAT.chatMapping.mutedtime, {
              name: chat.un,
              username: name,
              time: time
            }));
            setTimeout(function(id) {
              MyAPI.moderateUnmuteUser(id);
            }, time * 60 * 1000, user.id);
          }
        } else MyUTIL.sendChat(CHAT.subChat(CHAT.chatMapping.muterank, {
          name: chat.un
        }));
      }
    }
  },


  pingCommand: {
    command: 'ping',
    rank: 'user',
    type: 'exact',
    functionality: function(chat, cmd) {
      if (this.type === 'exact' && chat.message.length !== cmd.length) return void(0);
      if (!BOTCOMMANDS.executable(this.rank, chat)) return void(0);
      else {
        MyUTIL.sendChatOrPM(chat.type, chat.uid, CHAT.chatMapping.pong)
      }
    }
  },

  hypsterCommand: { //hipsterCommand
    command: 'hypster',
    rank: 'manager',
    type: 'exact',
    functionality: function(chat, cmd) {
      if (this.type === 'exact' && chat.message.length !== cmd.length) return void(0);
      if (!BOTCOMMANDS.executable(this.rank, chat)) return void(0);
      else {
        //MyUTIL.sendChatOrPM(chat.type, chat.uid, "I know @WhiteWidow is singing along with this hypster track");
        MyUTIL.sendChatOrPM(chat.type, chat.uid, "@WhiteWidow is so un-hipster she's basically normcore.");
      }
    }
  },
  refreshbrowserCommand: {
    command: 'refreshbrowser',
    rank: 'cohost',
    type: 'exact',
    functionality: function(chat, cmd) {
      if (this.type === 'exact' && chat.message.length !== cmd.length) return void(0);
      if (!BOTCOMMANDS.executable(this.rank, chat)) return void(0);
      else {
        STORAGE.storeToStorage();
        MyEVENTS.disconnectAPI();
        setTimeout(function() {
          window.location.reload(false);
        }, 1000);

      }
    }
  },

  reloadCommand: {
    command: 'reload',
    rank: 'cohost',
    type: 'exact',
    functionality: function(chat, cmd) {
      if (this.type === 'exact' && chat.message.length !== cmd.length) return void(0);
      if (!BOTCOMMANDS.executable(this.rank, chat)) return void(0);
      else {
        MyUTIL.sendChat(CHAT.chatMapping.reload);
        STORAGE.storeToStorage();
        MyEVENTS.disconnectAPI();
        MyAPI.killBot();
        setTimeout(function() {
          $.getScript(MyVARS.scriptLink);
        }, 2000);
      }
    }
  },

  reloadtestCommand: {
    command: 'reloadtest',
    rank: 'cohost',
    type: 'exact',
    functionality: function(chat, cmd) {
      if (this.type === 'exact' && chat.message.length !== cmd.length) return void(0);
      if (!BOTCOMMANDS.executable(this.rank, chat)) return void(0);
      else {
        MyUTIL.sendChat(CHAT.chatMapping.reload);
        STORAGE.storeToStorage();
        MyEVENTS.disconnectAPI();
        MyAPI.killBot();
        setTimeout(function() {
          $.getScript(MyVARS.scriptTestLink);
        }, 2000);
      }
    }
  },

  removedjCommand: {
    command: 'removedj',
    rank: 'mod',
    type: 'startsWith',
    functionality: function(chat, cmd) {
      if (this.type === 'exact' && chat.message.length !== cmd.length) return void(0);
      if (!BOTCOMMANDS.executable(this.rank, chat)) return void(0);
      else {
        var msg = chat.message;
        if (msg.length > cmd.length + 2) {
		  var name = MyUTIL.defineCommandExecuteOnName(chat, cmd);
          var user = USERS.lookupLocalUser(name);
          if (typeof user !== 'boolean') {
            USERS.resetDC(user);
            if (MyAPI.CurrentDJID() === user.id) {
              MyUTIL.logInfo("Skip song: " + MyAPI.CurrentSong().title + " by: " + chat.un + " Reason: Remove command");
			  if (MyAPI.djCount() < 2) MyAPI.botDjNow(); // Jump in line if there is no wailist
              MyUTIL.skipSong(true, "Remove Command");
              setTimeout(function() { MyUTIL.removeDJ(user.id, "Remove command1"); }, 1 * 1000, user);
            } else MyUTIL.removeDJ(user.id, "Remove command2");
          } else MyUTIL.sendChatOrPM(chat.type, chat.uid, CHAT.subChat(CHAT.chatMapping.removenotinwl, {
            name: chat.un,
            username: name
          }));
        } 
		else MyUTIL.sendChatOrPM(chat.type, chat.uid, CHAT.subChat(CHAT.chatMapping.nouserspecified, { name: chat.un }));
      }
    }
  },

  restrictetaCommand: {
    command: 'restricteta',
    rank: 'bouncer',
    type: 'exact',
    functionality: function(chat, cmd) {
      if (this.type === 'exact' && chat.message.length !== cmd.length) return void(0);
      if (!BOTCOMMANDS.executable(this.rank, chat)) return void(0);
      else {
        if (MyVARS.etaRestriction) {
          MyVARS.etaRestriction = !MyVARS.etaRestriction;
          return MyUTIL.sendChatOrPM(chat.type, chat.uid, CHAT.subChat(CHAT.chatMapping.toggleoff, {
            name: chat.un,
            'function': CHAT.chatMapping.etarestriction
          }));
        } else {
          MyVARS.etaRestriction = !MyVARS.etaRestriction;
          return MyUTIL.sendChatOrPM(chat.type, chat.uid, CHAT.subChat(CHAT.chatMapping.toggleon, {
            name: chat.un,
            'function': CHAT.chatMapping.etarestriction
          }));
        }
      }
    }
  },
  rouletteCommand: {
    command: 'roulette',
    rank: 'mod',
    type: 'startsWith',
    functionality: function(chat, cmd) {
      if (this.type === 'exact' && chat.message.length !== cmd.length) return void(0);
      if (!BOTCOMMANDS.executable(this.rank, chat)) return void(0);
	  MyUTIL.sendChatOrPM(chat.type, chat.uid, "https://f3cherokee.com/wp-content/uploads/2020/08/do-you-want-to-play-a-game.jpg");
      // if (MyROOM.roulette.rouletteStatus) return void(0);
      // if (MyUTIL.rouletteTimeRange()) {
        // MyUTIL.sendChatOrPM(chat.type, chat.uid, "The LAW runs the Roulette weekdays 9AM-5PM EST");
        // return void(0);
      // }
      // MyROOM.roulette.startRoulette();
    }
  },

  rulesCommand: {
    command: 'rules',
    rank: 'user',
    type: 'exact',
    functionality: function(chat, cmd) {
      if (this.type === 'exact' && chat.message.length !== cmd.length) return void(0);
      if (!BOTCOMMANDS.executable(this.rank, chat)) return void(0);
      else {
        if (typeof MyVARS.rulesLink === "string")
          return MyUTIL.sendChatOrPM(chat.type, chat.uid, CHAT.subChat(CHAT.chatMapping.roomrules, {
            link: MyVARS.rulesLink
          }));
      }
    }
  },

  sessionstatsCommand: {
    command: 'sessionstats',
    rank: 'bouncer',
    type: 'exact',
    functionality: function(chat, cmd) {
      if (this.type === 'exact' && chat.message.length !== cmd.length) return void(0);
      if (!BOTCOMMANDS.executable(this.rank, chat)) return void(0);
      else {
        var from = chat.un;
        var woots = MyROOM.roomstats.totalWoots;
        var mehs = MyROOM.roomstats.totalMehs;
        var grabs = MyROOM.roomstats.totalCurates;
        MyUTIL.sendChatOrPM(chat.type, chat.uid, CHAT.subChat(CHAT.chatMapping.sessionstats, {
          name: from,
          woots: woots,
          mehs: mehs,
          grabs: grabs
        }));
      }
    }
  },

  skipCommand: {
    command: 'skip',
    rank: 'bouncer',
    type: 'exact',
    functionality: function(chat, cmd) {
      if (!MyUTIL.canSkip()) return MyUTIL.sendChatOrPM(chat.type, chat.uid, "Skip too soon...");
      if (this.type === 'exact' && chat.message.length !== cmd.length) return void(0);
      if (!BOTCOMMANDS.executable(this.rank, chat)) return void(0);
      else {
        MyUTIL.logInfo("Skip song: " + MyAPI.CurrentSong().title + " by: " + chat.un + " Reason: Skip command");
        MyUTIL.skipSong(true, "Skip Command");
      }
    }
  },

  blockedCommand: {
    command: 'blocked',
    rank: 'bouncer',
    type: 'exact',
    functionality: function(chat, cmd) {
      if (!MyUTIL.canSkip()) return MyUTIL.sendChatOrPM(chat.type, chat.uid, "Skip too soon...");
      if (this.type === 'exact' && chat.message.length !== cmd.length) return void(0);
      if (!BOTCOMMANDS.executable(this.rank, chat)) return void(0);
      else {
        try {
          var dj = USERS.getDJ();
          var msgSend = '@' + dj.username + ': this song has been blocked in the US. please find another version.';
          MyUTIL.logInfo("Skip song: " + MyAPI.CurrentSong().title + " by: " + chat.un + " Reason: Blocked");
          MyUTIL.skipSong(true, "Blocked Command");
          MyUTIL.sendChat(msgSend);
        } catch (err) {
          MyUTIL.logException("blockedCommand: " + err.message);
        }
      }
    }
  },
  banlistimportCommand: { //Added: 06/11/2015 Import ban list from last saved in Github
    command: 'banlistimport',
    rank: 'cohost',
    type: 'exact',
    functionality: function(chat, cmd) {
      try {
        if (this.type === 'exact' && chat.message.length !== cmd.length) return;
        if (!BOTCOMMANDS.executable(this.rank, chat)) return;
        MyUTIL.importBlackList();
      } catch (err) {
        MyUTIL.logException("banlistimport: " + err.message);
      }
    }
  },
  banremoveCommand: { //Added: 06/10/2015 Remove a song from the ban list by the cid key
    command: 'banremove',
    rank: 'cohost',
    type: 'startsWith',
    functionality: function(chat, cmd) {
      try {
        if (this.type === 'exact' && chat.message.length !== cmd.length) return void(0);
        if (!BOTCOMMANDS.executable(this.rank, chat)) return void(0);

        var msg = chat.message;
        if (msg.length === cmd.length) return MyUTIL.sendChatOrPM(chat.type, chat.uid, "Missing mid to remove...");
        var midToRemove = msg.substring(cmd.length + 1);
        MyUTIL.logDebug("Keyword: " + midToRemove);
        var idxToRemove = MyROOM.newBlacklistIDs.indexOf(midToRemove);
        if (idxToRemove < 0) return MyUTIL.sendChatOrPM(chat.type, chat.uid, "Could not locate mid: " + midToRemove);
        if (MyROOM.newBlacklist.length !== MyROOM.newBlacklistIDs.length) return MyUTIL.sendChatOrPM(chat.type, chat.uid, "Could not remove song ban, corrupt song list info.");
        var track = MyROOM.newBlacklist[idxToRemove];
        var msgToSend = chat.un + " removed [" + track.author + " - " + track.title + "] from the banned song list.";
        MyROOM.newBlacklist.splice(idxToRemove, 1); // Remove 1 item from list
        MyROOM.newBlacklistIDs.splice(idxToRemove, 1); // Remove 1 item from list
        if (MyROOM.blacklistLoaded) localStorage["BLACKLIST"] = JSON.stringify(MyROOM.newBlacklist);
        if (MyROOM.blacklistLoaded) localStorage["BLACKLISTIDS"] = JSON.stringify(MyROOM.newBlacklistIDs);
        MyUTIL.sendChatOrPM(chat.type, chat.uid, msgToSend);
        MyUTIL.logInfo(msgToSend);
      } catch (err) {
        MyUTIL.logException("banremove: " + err.message);
      }
    }
  },
  banremoveallsongsCommand: { //Added: 06/10/2015 Remove all banned / blacklisted songs
    command: 'banremoveallsongs',
    rank: 'cohost',
    type: 'exact',
    functionality: function(chat, cmd) {
      try {
        if (this.type === 'exact' && chat.message.length !== cmd.length) return void(0);
        if (!BOTCOMMANDS.executable(this.rank, chat)) return void(0);
        if (MyROOM.newBlacklist.length !== MyROOM.newBlacklistIDs.length) MyUTIL.sendChatOrPM(chat.type, chat.uid, "Could not remove song ban, corrupt song list info.");
        MyROOM.newBlacklist.splice(0, MyROOM.newBlacklist.length); // Remove all items from list
        MyROOM.newBlacklistIDs.splice(0, MyROOM.newBlacklistIDs.length); // Remove all items from list
        if (MyROOM.blacklistLoaded) localStorage["BLACKLIST"] = JSON.stringify(MyROOM.newBlacklist);
        if (MyROOM.blacklistLoaded) localStorage["BLACKLISTIDS"] = JSON.stringify(MyROOM.newBlacklistIDs);
      } catch (err) {
        MyUTIL.logException("banremoveallsongs: " + err.message);
      }
    }
  },
  banallhistorysongsCommand: { //Added: 06/10/2015 Add all songs in current room history to the ban song list
    command: 'banallhistorysongs',
    rank: 'cohost',
    type: 'exact',
    functionality: function(chat, cmd) {
      try {
        var songCount = 0;
        var banCount = 0;
        if (this.type === 'exact' && chat.message.length !== cmd.length) return void(0);
        if ((!BOTCOMMANDS.executable(this.rank, chat)) && chat.uid !== MyAPI.CurrentUserID()) return void(0);
        var songHistory = MyAPI.getHistory();
        for (var i = 0; i < songHistory.length; i++) {
          var song = songHistory[i];
          songCount++;
          //if (i === 0) MyUTIL.logObject(song, "SONG");
          var songMid = song.media.format + ':' + song.media.cid;
          if (MyROOM.newBlacklistIDs.indexOf(songMid) < 0) {
            //var media = MyAPI.CurrentSong();
            var track = {
              author: song.media.author,
              title: song.media.title,
              mid: songMid
            };
            MyUTIL.banSong(track);
            banCount++;
          }
        }
        MyUTIL.logInfo("Banned " + banCount + " out of " + songCount + " songs");
      } catch (err) {
        MyUTIL.logException("banallhistorysongs: " + err.message);
      }
    }
  },
  banlastsongCommand: { //Added: 06/11/2015 Add all songs in current room history to the ban song list
    command: 'banlastsong',
    rank: 'bouncer',
    type: 'startsWith',
    functionality: function(chat, cmd) {
      try {
        if (this.type === 'exact' && chat.message.length !== cmd.length) return void(0);
        if ((!BOTCOMMANDS.executable(this.rank, chat)) && chat.uid !== MyAPI.CurrentUserID()) return void(0);
        var histIndex = "2"; //Default to 2nd song on the list, or the last song played
        var msg = chat.message;
        if (msg.length > cmd.length) histIndex = msg.substring(cmd.length + 1);
        if (isNaN(histIndex)) {
          MyUTIL.sendChatOrPM(chat.type, chat.uid, "Invalid historical song index number");
          return;
        }
        var songHistory = MyAPI.getHistory();
        if ((parseInt(histIndex) > songHistory.length) || (parseInt(histIndex) < 1)) {
          MyUTIL.sendChatOrPM(chat.type, chat.uid, "Invalid historical song index value");
          return;
        }
        var song = songHistory[parseInt(histIndex) - 1];
        if (typeof song === 'undefined') {
          MyUTIL.sendChatOrPM(chat.type, chat.uid, "Could not define song idx: " + histIndex);
          return;
        }
        var songMid = song.media.format + ':' + song.media.cid;
        if (MyROOM.newBlacklistIDs.indexOf(songMid) < 0) {
          var track = {
            author: song.media.author,
            title: song.media.title,
            mid: songMid
          };
          MyUTIL.banSong(track);
          MyUTIL.sendChat(CHAT.subChat(CHAT.chatMapping.newblacklisted, {
            name: song.user.username,
            author: song.media.author,
            title: song.media.title,
            mid: song.media.format + ':' + song.media.cid
          }));
        } else
          MyUTIL.sendChat("This song has already been banned: " + song.media.author + " - " + song.media.title + " - " + song.media.format + ':' + song.media.cid);
      } catch (err) {
        MyUTIL.logException("banlastsong: " + err.message);
      }
    }
  },
  banlistidjsonCommand: { //Added: 06/11/2015 List all banned songs
    command: 'banlistidjson',
    rank: 'cohost',
    type: 'exact',
    functionality: function(chat, cmd) {
      try {
        if (this.type === 'exact' && chat.message.length !== cmd.length) return void(0);
        if (!BOTCOMMANDS.executable(this.rank, chat)) return void(0);
        MyUTIL.logInfo(JSON.stringify(MyROOM.newBlacklistIDs));
      } catch (err) {
        MyUTIL.logException("banlistidjson: " + err.message);
      }
    }
  },
  banlistjsonCommand: { //Added: 06/11/2015 List all banned songs
    command: 'banlistjson',
    rank: 'cohost',
    type: 'exact',
    functionality: function(chat, cmd) {
      try {
        if (this.type === 'exact' && chat.message.length !== cmd.length) return void(0);
        if (!BOTCOMMANDS.executable(this.rank, chat)) return void(0);
        MyUTIL.logInfo(JSON.stringify(MyROOM.newBlacklist));
      } catch (err) {
        MyUTIL.logException("banlistjson: " + err.message);
      }
    }
  },
  userlistjsonCommand: { //Added: 08/25/2015 List all users to json
    command: 'userlistjson',
    rank: 'cohost',
    type: 'exact',
    functionality: function(chat, cmd) {
      try {
        if (this.type === 'exact' && chat.message.length !== cmd.length) return void(0);
        if (!BOTCOMMANDS.executable(this.rank, chat)) return void(0);
        MyUTIL.logInfo(JSON.stringify(MyROOM.users));
      } catch (err) {
        MyUTIL.logException("userlistjson: " + err.message);
      }
    }
  },
  userlistxferCommand: { //Added: 08/28/2015
    command: 'userlistxfer',
    rank: 'manager',
    type: 'startsWith',
    functionality: function(chat, cmd) {
      try {
        if (this.type === 'exact' && chat.message.length !== cmd.length) return;
        if (!BOTCOMMANDS.executable(this.rank, chat)) return;
        MyROOM.users = MyROOM.usersImport;
      } catch (err) {
        MyUTIL.logException("userlistxfer: " + err.message);
      }
    }
  },
  userliststatsCommand: { //Added: 08/28/2015
    command: 'userliststats',
    rank: 'manager',
    type: 'startsWith',
    functionality: function(chat, cmd) {
      try {
        if (this.type === 'exact' && chat.message.length !== cmd.length) return;
        if (!BOTCOMMANDS.executable(this.rank, chat)) return;
        var msg = chat.message;
        if (msg.length === cmd.length) return MyUTIL.logInfo(CHAT.subChat(CHAT.chatMapping.nouserspecified, {
          name: chat.un
        }));
		var name = MyUTIL.defineCommandExecuteOnName(chat, cmd);
        var user = USERS.lookupLocalUser(name);
        var msg = "";
        if (user === false) {
          msg = "Could not find old user";
        } else {
          msg = CHAT.subChat(CHAT.chatMapping.mystats, {
            name: user.username,
            songs: user.votes.songs,
            woot: user.votes.woot,
            mehs: user.votes.meh,
            grabs: user.votes.curate,
            tasty: user.votes.tasty
          });
          USERS.resetDailyRolledStats(user);
          msg += " Roll Stats: " + USERS.getRolledStats(user);
        }
        MyUTIL.logInfo(msg);

        var newuser = USERS.lookupUserNameImport(name);
        if (newuser === false) {
          msg = "Could not find new user";
        } else {
          msg = CHAT.subChat(CHAT.chatMapping.mystats, {
            name: newuser.username,
            songs: newuser.votes.songs,
            woot: newuser.votes.woot,
            mehs: newuser.votes.meh,
            grabs: newuser.votes.curate,
            tasty: newuser.votes.tasty
          });
          USERS.resetDailyRolledStats(newuser);
          msg += " Roll Stats: " + USERS.getRolledStats(newuser);
        }
        setTimeout(function() { MyUTIL.logInfo(msg); }, 1 * 1000);
      } 
	  catch (err) { MyUTIL.logException("userliststats: " + err.message); }
    }
  },
  userlistcountCommand: { //Added: 08/28/2015
    command: 'userlistcount',
    rank: 'manager',
    type: 'exact',
    functionality: function(chat, cmd) {
      try {
        if (this.type === 'exact' && chat.message.length !== cmd.length) return;
        if (!BOTCOMMANDS.executable(this.rank, chat)) return;
        MyUTIL.logInfo("I've got " + MyROOM.usersImport.length + " users in the new list.");
        setTimeout(function() {
          MyUTIL.logInfo("I've got " + MyROOM.users.length + " users in the old list.")
        }, 1 * 1000);
      } catch (err) {
        MyUTIL.logException("userlistcount: " + err.message);
      }
    }
  },
  userlistimportCommand: { //Added: 08/23/2015 Import User list from last saved in Github
    command: 'userlistimport',
    rank: 'manager',
    type: 'exact',
    functionality: function(chat, cmd) {
      try {
        if (this.type === 'exact' && chat.message.length !== cmd.length) return;
        if (!BOTCOMMANDS.executable(this.rank, chat)) return;
        MyUTIL.importUserList();
        MyUTIL.logInfo("I've got " + MyROOM.usersImport.length + " users in the new list.");
        var DocZ = USERS.lookupUserNameImport("Doc_Z");
        if (DocZ === false) return MyUTIL.logInfo(CHAT.subChat(CHAT.chatMapping.invaliduserspecified, {
          name: chat.un
        }));
        var msg = CHAT.subChat(CHAT.chatMapping.mystats, {
          name: DocZ.username,
          songs: DocZ.votes.songs,
          woot: DocZ.votes.woot,
          mehs: DocZ.votes.meh,
          grabs: DocZ.votes.curate,
          tasty: DocZ.votes.tasty
        });
        USERS.resetDailyRolledStats(DocZ);
        msg += " Roll Stats: " + USERS.getRolledStats(DocZ);
        MyUTIL.logInfo(msg);
      } catch (err) {
        MyUTIL.logException("userlistimport: " + err.message);
      }
    }
  },

  banlistconsoleCommand: { //Added: 06/11/2015 List all banned songs
    command: 'banlistconsole',
    rank: 'cohost',
    type: 'exact',
    functionality: function(chat, cmd) {
      try {
        if (this.type === 'exact' && chat.message.length !== cmd.length) return void(0);
        if (!BOTCOMMANDS.executable(this.rank, chat)) return void(0);
        MyUTIL.logNewBlacklistedSongs();
      } catch (err) {
        MyUTIL.logException("banlistconsole: " + err.message);
      }
    }
  },
  banlistcountCommand: { //Added: 06/12/2015 List all banned songs
    command: 'banlistcount',
    rank: 'bouncer',
    type: 'exact',
    functionality: function(chat, cmd) {
      try {
        if (this.type === 'exact' && chat.message.length !== cmd.length) return void(0);
        if (!BOTCOMMANDS.executable(this.rank, chat)) return void(0);
        MyUTIL.sendChatOrPM(chat.type, chat.uid, "I've got " + MyROOM.newBlacklist.length + " songs on the ban list " + chat.un + ".");
      } catch (err) {
        MyUTIL.logException("banlistcount: " + err.message);
      }
    }
  },
  banlistCommand: { //Added: 06/10/2015 List all banned songs
    command: ['banlist', 'banlistpublic'],
    rank: 'cohost',
    type: 'startsWith',
    functionality: function(chat, cmd) {
      try {
        if (this.type === 'exact' && chat.message.length !== cmd.length) return void(0);
        if (!BOTCOMMANDS.executable(this.rank, chat)) return void(0);
        var keyword = "";
        var privatemsg = false;
        if (chat.uid === MyAPI.CurrentUserID()) privatemsg = true;
        if (cmd.toUpperCase() === "BANLISTPUBLIC") privatemsg = false;
        var msg = chat.message;
        var matchCnt = 0;
        if (msg.length > cmd.length) keyword = msg.substring(cmd.length + 1).toUpperCase();
        MyUTIL.logDebug("Keyword: " + keyword);
        var dispMsgs = [];
        for (var i = 0; i < MyROOM.newBlacklist.length; i++) {
          var track = MyROOM.newBlacklist[i];
          var trackinfo = track.title.toUpperCase() + track.author.toUpperCase();
          if (trackinfo.indexOf(keyword) > -1) {
            var dispMsg = "[" + track.author + " - " + track.title + "] -> " + track.mid;
            if (privatemsg) {
              MyUTIL.logChat(dispMsg);
            } else {
              matchCnt++;
              if (matchCnt <= 10) dispMsgs.push(dispMsg);
            }
          }
        }
        if (!privatemsg) {
          var msgtoSend = "Found " + matchCnt + " matches.";
          if (matchCnt > 10) msgtoSend += "(only display first 10)"
          MyUTIL.sendChatOrPM(chat.type, chat.uid, msgtoSend);
          if (matchCnt > 0) setTimeout(function() {
            MyUTIL.sendChatOrPM(chat.type, chat.uid, dispMsgs[0]);
          }, 1 * 500);
          if (matchCnt > 1) setTimeout(function() {
            MyUTIL.sendChatOrPM(chat.type, chat.uid, dispMsgs[1]);
          }, 2 * 500);
          if (matchCnt > 2) setTimeout(function() {
            MyUTIL.sendChatOrPM(chat.type, chat.uid, dispMsgs[2]);
          }, 3 * 500);
          if (matchCnt > 3) setTimeout(function() {
            MyUTIL.sendChatOrPM(chat.type, chat.uid, dispMsgs[3]);
          }, 4 * 500);
          if (matchCnt > 4) setTimeout(function() {
            MyUTIL.sendChatOrPM(chat.type, chat.uid, dispMsgs[4]);
          }, 5 * 500);
          if (matchCnt > 5) setTimeout(function() {
            MyUTIL.sendChatOrPM(chat.type, chat.uid, dispMsgs[5]);
          }, 6 * 500);
          if (matchCnt > 6) setTimeout(function() {
            MyUTIL.sendChatOrPM(chat.type, chat.uid, dispMsgs[6]);
          }, 7 * 500);
          if (matchCnt > 7) setTimeout(function() {
            MyUTIL.sendChatOrPM(chat.type, chat.uid, dispMsgs[7]);
          }, 8 * 500);
          if (matchCnt > 8) setTimeout(function() {
            MyUTIL.sendChatOrPM(chat.type, chat.uid, dispMsgs[8]);
          }, 9 * 500);
          if (matchCnt > 9) setTimeout(function() {
            MyUTIL.sendChatOrPM(chat.type, chat.uid, dispMsgs[9]);
          }, 10 * 500);
        }
      } catch (err) {
        MyUTIL.logException("banlist: " + err.message);
      }
    }
  },
  oobCommand: {
    command: ['oob', 'bansong', 'songban', 'blacklist', 'bl'],
    rank: 'bouncer',
    type: 'exact',
    functionality: function(chat, cmd) {
      try {
        if (!MyUTIL.canSkip()) return MyUTIL.sendChatOrPM(chat.type, chat.uid, "Skip too soon...");
        if (this.type === 'exact' && chat.message.length !== cmd.length) return void(0);
        if (!BOTCOMMANDS.executable(this.rank, chat)) return void(0);
        MyUTIL.banCurrentSong(chat.un);
      } catch (err) {
        MyUTIL.logException("oob: " + err.message);
      }
    }
  },
  botmutedCommand: {
    command: 'botmuted',
    rank: 'cohost',
    type: 'exact',
    functionality: function(chat, cmd) {
      try {
        if (this.type === 'exact' && chat.message.length !== cmd.length) return void(0);
        if (!BOTCOMMANDS.executable(this.rank, chat)) return void(0);
        MyVARS.botMuted = (!MyVARS.botMuted);
        MyUTIL.logInfo("Bot Muted = " + MyVARS.botMuted);
      } catch (err) {
        MyUTIL.logException("botmutedCommand: " + err.message);
      }
    }
  },
  songstatsCommand: {
    command: 'songstats',
    rank: 'mod',
    type: 'exact',
    functionality: function(chat, cmd) {
      if (this.type === 'exact' && chat.message.length !== cmd.length) return void(0);
      if (!BOTCOMMANDS.executable(this.rank, chat)) return void(0);
      else {
        if (MyVARS.songstats) {
          MyVARS.songstats = !MyVARS.songstats;
          return MyUTIL.sendChatOrPM(chat.type, chat.uid, CHAT.subChat(CHAT.chatMapping.toggleoff, {
            name: chat.un,
            'function': CHAT.chatMapping.songstats
          }));
        } else {
          MyVARS.songstats = !MyVARS.songstats;
          return MyUTIL.sendChatOrPM(chat.type, chat.uid, CHAT.subChat(CHAT.chatMapping.toggleon, {
            name: chat.un,
            'function': CHAT.chatMapping.songstats
          }));
        }
      }
    }
  },

  sourceCommand: {
    command: 'source',
    rank: 'user',
    type: 'exact',
    functionality: function(chat, cmd) {
      if (this.type === 'exact' && chat.message.length !== cmd.length) return void(0);
      if (!BOTCOMMANDS.executable(this.rank, chat)) return void(0);
      else {
        MyUTIL.sendChatOrPM(chat.type, chat.uid, '/me This bot was made by ' + MyVARS.botCreator + '.');
      }
    }
  },

  uptimeCommand: {
    command: 'uptime',
    rank: 'bouncer',
    type: 'exact',
    functionality: function(chat, cmd) {
      if (this.type === 'exact' && chat.message.length !== cmd.length) return void(0);
      if (!BOTCOMMANDS.executable(this.rank, chat)) return void(0);
      else {
		MyUTIL.sendChatOrPM(chat.type, chat.uid, MyUTIL.formatDate(MyVARS.botStarted))
      }
    }
  },

  statusCommand: {
    command: 'status',
    rank: 'bouncer',
    type: 'exact',
    functionality: function(chat, cmd) {
      if (this.type === 'exact' && chat.message.length !== cmd.length) return void(0);
      if (!BOTCOMMANDS.executable(this.rank, chat)) return void(0);
      else {
        var from = chat.un;
        var msg = '/me [@' + from + '] ';

        msg += 'Up since: ' + MyUTIL.formatDate(MyVARS.botStarted) + '. ';
		msg += CHAT.chatMapping.enableAfkRemoval + ': ';
        if (MyVARS.enableAfkRemoval) msg += 'ON';
        else msg += 'OFF';
        msg += '. ';
        msg += CHAT.chatMapping.afksremoved + ": " + MyROOM.afkList.length + '. ';
        msg += CHAT.chatMapping.afklimit + ': ' + MyVARS.maximumAfk + '. ';

        msg += CHAT.chatMapping.repeatSongs + ": " + ((MyVARS.enableSongInHistCheck) ? "ON" : "OFF") + "; ";

        msg += CHAT.chatMapping.repeatSongLimit + ': ' + MyVARS.repeatSongTime + '. ';

        msg += 'Random Comments' + ': ';
        if (MyVARS.randomCommentsEnabled) msg += 'ON';
        else msg += 'OFF';
        msg += '. ';

        msg += 'Random Roulette' + ': ';
        if (MyVARS.randomRoulette) msg += 'ON';
        else msg += 'OFF';
        msg += '. ';

        msg += 'Bouncer+: ';
        if (MyVARS.bouncerPlus) msg += 'ON';
        else msg += 'OFF';
        msg += '. ';

        msg += CHAT.chatMapping.blacklist + ': ';
        if (MyVARS.blacklistEnabled) msg += 'ON';
        else msg += 'OFF';
        msg += '. ';

        msg += CHAT.chatMapping.lockguard + ': ';
        if (MyVARS.lockGuard) msg += 'ON';
        else msg += 'OFF';
        msg += '. ';

        msg += CHAT.chatMapping.cycleguard + ': ';
        if (MyVARS.cycleGuard) msg += 'ON';
        else msg += 'OFF';
        msg += '. ';

        msg += CHAT.chatMapping.timeguard + ': ';
        if (MyVARS.timeGuard) msg += 'ON';
        else msg += 'OFF';
        msg += '. ';

        var msg2 = CHAT.chatMapping.chatfilter + ': ';
        if (MyVARS.filterChat) msg2 += 'ON';
        else msg2 += 'OFF';
        msg2 += '. ';

        msg2 += CHAT.chatMapping.voteskip + ': ';
        if (MyVARS.voteSkipEnabled) msg2 += 'ON';
        else msg2 += 'OFF';
        msg2 += '. ';

        var launchT = MyROOM.roomstats.launchTime;
        var durationOnline = Date.now() - launchT;
        var since = MyUTIL.msToStr(durationOnline);
        msg2 += CHAT.subChat(CHAT.chatMapping.activefor, {
          time: since
        });

        setTimeout(function() {
          MyUTIL.sendChatOrPM(chat.type, chat.uid, msg2);
        }, 500);
        return MyUTIL.sendChatOrPM(chat.type, chat.uid, msg);
      }
    }
  },

  swapCommand: {
    command: 'swap',
    rank: 'mod',
    type: 'startsWith',
    functionality: function(chat, cmd) {
      if (this.type === 'exact' && chat.message.length !== cmd.length) return void(0);
      if (!BOTCOMMANDS.executable(this.rank, chat)) return void(0);
      else {
        var msg = chat.message;
        if (msg.length === cmd.length) return MyUTIL.sendChatOrPM(chat.type, chat.uid, CHAT.subChat(CHAT.chatMapping.nouserspecified, {
          name: chat.un
        }));
        var firstSpace = msg.indexOf(' ');
        var lastSpace = msg.lastIndexOf(' ');
        var name1 = msg.substring(cmd.length + 2, lastSpace);
        var name2 = msg.substring(lastSpace + 2);
        var user1 = USERS.lookupLocalUser(name1);
        var user2 = USERS.lookupLocalUser(name2);
        if (typeof user1 === 'boolean' || typeof user2 === 'boolean') return MyUTIL.sendChat(CHAT.subChat(CHAT.chatMapping.swapinvalid, {
          name: chat.un
        }));
        if (user1.id === MyAPI.CurrentUserID() || user2.id === MyAPI.CurrentUserID()) return MyUTIL.sendChat(CHAT.subChat(CHAT.chatMapping.addbottowaitlist, {
          name: chat.un
        }));
        var p1 = MyAPI.getDjListPosition(user1.id) + 1;
        var p2 = MyAPI.getDjListPosition(user2.id) + 1;
        if (p1 < 0 || p2 < 0) return MyUTIL.sendChat(CHAT.subChat(CHAT.chatMapping.swapwlonly, {
          name: chat.un
        }));
        MyUTIL.sendChat(CHAT.subChat(CHAT.chatMapping.swapping, {
          'name1': name1,
          'name2': name2
        }));
        if (p1 < p2) {
          USERS.moveUser(user2.id, p1, false);
          setTimeout(function(user1, p2) {
            USERS.moveUser(user1.id, p2, false);
          }, 2000, user1, p2);
        } else {
          USERS.moveUser(user1.id, p2, false);
          setTimeout(function(user2, p1) {
            USERS.moveUser(user2.id, p1, false);
          }, 2000, user2, p1);
        }
      }
    }
  },

  themeCommand: {
    command: 'theme',
    rank: 'user',
    type: 'exact',
    functionality: function(chat, cmd) {
      if (this.type === 'exact' && chat.message.length !== cmd.length) return void(0);
      if (!BOTCOMMANDS.executable(this.rank, chat)) return void(0);
      else {
        if (typeof MyVARS.themeLink === "string")
          MyUTIL.sendChatOrPM(chat.type, chat.uid, CHAT.subChat(CHAT.chatMapping.genres, {
            link: MyVARS.themeLink
          }));
      }
    }
  },

  timeguardCommand: {
    command: 'timeguard',
    rank: 'bouncer',
    type: 'exact',
    functionality: function(chat, cmd) {
      if (this.type === 'exact' && chat.message.length !== cmd.length) return void(0);
      if (!BOTCOMMANDS.executable(this.rank, chat)) return void(0);
      else {
        if (MyVARS.timeGuard) {
          MyVARS.timeGuard = !MyVARS.timeGuard;
          return MyUTIL.sendChatOrPM(chat.type, chat.uid, CHAT.subChat(CHAT.chatMapping.toggleoff, {
            name: chat.un,
            'function': CHAT.chatMapping.timeguard
          }));
        } else {
          MyVARS.timeGuard = !MyVARS.timeGuard;
          return MyUTIL.sendChatOrPM(chat.type, chat.uid, CHAT.subChat(CHAT.chatMapping.toggleon, {
            name: chat.un,
            'function': CHAT.chatMapping.timeguard
          }));
        }

      }
    }
  },

  toggleblCommand: {
    command: 'togglebl',
    rank: 'bouncer',
    type: 'exact',
    functionality: function(chat, cmd) {
      if (this.type === 'exact' && chat.message.length !== cmd.length) return void(0);
      if (!BOTCOMMANDS.executable(this.rank, chat)) return void(0);
      else {
        var temp = MyVARS.blacklistEnabled;
        MyVARS.blacklistEnabled = !temp;
        if (MyVARS.blacklistEnabled) {
          return MyUTIL.sendChatOrPM(chat.type, chat.uid, CHAT.subChat(CHAT.chatMapping.toggleon, {
            name: chat.un,
            'function': CHAT.chatMapping.blacklist
          }));
        } else return MyUTIL.sendChatOrPM(chat.type, chat.uid, CHAT.subChat(CHAT.chatMapping.toggleoff, {
          name: chat.un,
          'function': CHAT.chatMapping.blacklist
        }));
      }
    }
  },

  togglemotdCommand: {
    command: 'togglemotd',
    rank: 'bouncer',
    type: 'exact',
    functionality: function(chat, cmd) {
      if (this.type === 'exact' && chat.message.length !== cmd.length) return void(0);
      if (!BOTCOMMANDS.executable(this.rank, chat)) return void(0);
      else {
        if (MyVARS.motdEnabled) {
          MyVARS.motdEnabled = !MyVARS.motdEnabled;
          MyUTIL.sendChatOrPM(chat.type, chat.uid, CHAT.subChat(CHAT.chatMapping.toggleoff, {
            name: chat.un,
            'function': CHAT.chatMapping.motd
          }));
        } else {
          MyVARS.motdEnabled = !MyVARS.motdEnabled;
          MyUTIL.sendChatOrPM(chat.type, chat.uid, CHAT.subChat(CHAT.chatMapping.toggleon, {
            name: chat.un,
            'function': CHAT.chatMapping.motd
          }));
        }
      }
    }
  },

  unbanCommand: {
    command: 'unban',
    rank: 'bouncer',
    type: 'startsWith',
    functionality: function(chat, cmd) {
      if (this.type === 'exact' && chat.message.length !== cmd.length) return void(0);
      if (!BOTCOMMANDS.executable(this.rank, chat)) return void(0);
      else {
        $(".icon-population").click();
        $(".icon-ban").click();
        setTimeout(function(chat) {
          var msg = chat.message;
          if (msg.length === cmd.length) return MyUTIL.sendChat();
          var name = MyUTIL.defineCommandExecuteOnName(chat, cmd);
          var bannedUsers = MyAPI.getBannedUsers();
          var found = false;
          var bannedUser = null;
          for (var i = 0; i < bannedUsers.length; i++) {
            var user = bannedUsers[i];
            if (user.username === name) {
              bannedUser = user;
              found = true;
            }
          }
          if (!found) {
            $(".icon-chat").click();
            return MyUTIL.sendChatOrPM(chat.type, chat.uid, CHAT.subChat(CHAT.chatMapping.notbanned, {
              name: chat.un
            }));
          }
          MyAPI.moderateUnbanUser(bannedUser.id);
          //MyUTIL.logDebug("Unbanned " + name);
          setTimeout(function() {
            $(".icon-chat").click();
          }, 1000);
        }, 1000, chat);
      }
    }
  },

  unlockCommand: {
    command: 'unlock',
    rank: 'mod',
    type: 'exact',
    functionality: function(chat, cmd) {
      if (this.type === 'exact' && chat.message.length !== cmd.length) return void(0);
      if (!BOTCOMMANDS.executable(this.rank, chat)) return void(0);
      else {
        MyUTIL.booth.unlockBooth();
      }
    }
  },

  unmuteCommand: {
    command: 'unmute',
    rank: 'bouncer',
    type: 'startsWith',
    functionality: function(chat, cmd) {
      if (this.type === 'exact' && chat.message.length !== cmd.length) return void(0);
      if (!BOTCOMMANDS.executable(this.rank, chat)) return void(0);
      else {
        var msg = chat.message;
        var permFrom = USERS.getPermission(chat.uid);
        //  if (msg.indexOf('@') === -1 && msg.indexOf('all') !== -1) {
        //     if (permFrom > PERM.ROLE.BOUNCER) {
        //         MyROOM.mutedUsers = [];
        //         return MyUTIL.sendChat(CHAT.subChat(CHAT.chatMapping.unmutedeveryone, {name: chat.un}));
        //     }
        //     else return MyUTIL.sendChat(CHAT.subChat(CHAT.chatMapping.unmuteeveryonerank, {name: chat.un}));
        // }
        var from = chat.un;
		var name = MyUTIL.defineCommandExecuteOnName(chat, cmd);

        var user = USERS.lookupLocalUser(name);

        if (typeof user === 'boolean') return MyUTIL.sendChatOrPM(chat.type, chat.uid, CHAT.subChat(CHAT.chatMapping.invaliduserspecified, {
          name: chat.un
        }));

        var permUser = USERS.getPermission(user.id);
        if (permFrom > permUser) {
          // var muted = MyROOM.mutedUsers;
          // var wasMuted = false;
          // var indexMuted = -1;
          // for (var i = 0; i < muted.length; i++) {
          // if (muted[i] === user.id) {
          // indexMuted = i;
          // wasMuted = true;
          // }
          // }
          // if (!wasMuted) return MyUTIL.sendChat(CHAT.subChat(CHAT.chatMapping.notmuted, {name: chat.un}));
          // MyROOM.mutedUsers.splice(indexMuted);
          // MyUTIL.sendChat(CHAT.subChat(CHAT.chatMapping.unmuted, {name: chat.un, username: name}));
          try {
            MyAPI.moderateUnmuteUser(user.id);
            MyUTIL.sendChat(CHAT.subChat(CHAT.chatMapping.unmuted, {
              name: chat.un,
              username: name
            }));
          } catch (err) {
            MyUTIL.sendChatOrPM(chat.type, chat.uid, CHAT.subChat(CHAT.chatMapping.notmuted, {
              name: chat.un
            }));
          }
        } else MyUTIL.sendChatOrPM(chat.type, chat.uid, CHAT.subChat(CHAT.chatMapping.unmuterank, {
          name: chat.un
        }));
      }
    }
  },

  usercmdcdCommand: {
    command: 'usercmdcd',
    rank: 'manager',
    type: 'startsWith',
    functionality: function(chat, cmd) {
      if (this.type === 'exact' && chat.message.length !== cmd.length) return void(0);
      if (!BOTCOMMANDS.executable(this.rank, chat)) return void(0);
      else {
        var msg = chat.message;
        var cd = msg.substring(cmd.length + 1);
        if (!isNaN(cd)) {
          MyVARS.commandCooldown = cd;
          return MyUTIL.sendChat(CHAT.subChat(CHAT.chatMapping.commandscd, {
            name: chat.un,
            time: MyVARS.commandCooldown
          }));
        } else return MyUTIL.sendChat(CHAT.subChat(CHAT.chatMapping.invalidtime, {
          name: chat.un
        }));
      }
    }
  },

  usercommandsCommand: {
    command: 'usercommands',
    rank: 'manager',
    type: 'exact',
    functionality: function(chat, cmd) {
      if (this.type === 'exact' && chat.message.length !== cmd.length) return void(0);
      if (!BOTCOMMANDS.executable(this.rank, chat)) return void(0);
      else {
        if (MyVARS.usercommandsEnabled) {
          MyUTIL.sendChatOrPM(chat.type, chat.uid, CHAT.subChat(CHAT.chatMapping.toggleoff, {
            name: chat.un,
            'function': CHAT.chatMapping.usercommands
          }));
          MyVARS.usercommandsEnabled = !MyVARS.usercommandsEnabled;
        } else {
          MyUTIL.sendChatOrPM(chat.type, chat.uid, CHAT.subChat(CHAT.chatMapping.toggleon, {
            name: chat.un,
            'function': CHAT.chatMapping.usercommands
          }));
          MyVARS.usercommandsEnabled = !MyVARS.usercommandsEnabled;
        }
      }
    }
  },

  mystatsCommand: {
    command: 'mystats',
    rank: 'user',
    type: 'startsWith',
    functionality: function(chat, cmd) {
      try {
        if (this.type === 'exact' && chat.message.length !== cmd.length) return void(0);
        if (!BOTCOMMANDS.executable(this.rank, chat)) return void(0);
        var msg = chat.message;
        var name = "";
        if (msg.length === cmd.length) name = chat.un
        else name = MyUTIL.defineCommandExecuteOnName(chat, cmd);
        var user = USERS.lookupLocalUser(name);
        if (user === false) return MyUTIL.sendChatOrPM(chat.type, chat.uid, CHAT.subChat(CHAT.chatMapping.invaliduserspecified, {
          name: chat.un
        }));
        var msg = CHAT.subChat(CHAT.chatMapping.mystats, {
          name: user.username,
          songs: user.votes.songs,
          woot: user.votes.woot,
          mehs: user.votes.meh,
          grabs: user.votes.curate,
          tasty: user.votes.tasty
        });
        USERS.resetDailyRolledStats(user);
        msg += " Roll Stats: " + USERS.getRolledStats(user);
        var byusername = " [ executed by " + chat.un + " ]";
        if (chat.un !== name) msg += byusername;
        MyUTIL.sendChatOrPM(chat.type, chat.uid, msg);
      } catch (err) {
        MyUTIL.logException("mystatsCommand: " + err.message);
      }
    }
  },
  mystatsxCommand: {
    command: 'mystatsx',
    rank: 'manager',
    type: 'startsWith',
    functionality: function(chat, cmd) {
      try {
        if (this.type === 'exact' && chat.message.length !== cmd.length) return void(0);
        if (!BOTCOMMANDS.executable(this.rank, chat)) return void(0);
        var msg = chat.message;
        var name = "";
        if (msg.length === cmd.length) name = chat.un
        else name = MyUTIL.defineCommandExecuteOnName(chat, cmd);
        var user = USERS.lookupLocalUser(name);
        if (user === false) return MyUTIL.logChat(CHAT.subChat(CHAT.chatMapping.invaliduserspecified, {
          name: chat.un
        }));
        var msg = CHAT.subChat(CHAT.chatMapping.mystats, {
          name: user.username,
          songs: user.votes.songs,
          woot: user.votes.woot,
          mehs: user.votes.meh,
          grabs: user.votes.curate,
          tasty: user.votes.tasty
        });
        var byusername = " [ executed by " + chat.un + " ]";
        if (chat.un !== name) msg += byusername;
        MyUTIL.logChat(msg);
      } catch (err) {
        MyUTIL.logException("mystatsCommand: " + err.message);
      }
    }
  },

  welcomeCommand: {
    command: 'welcome',
    rank: 'mod',
    type: 'exact',
    functionality: function(chat, cmd) {
      if (this.type === 'exact' && chat.message.length !== cmd.length) return void(0);
      if (!BOTCOMMANDS.executable(this.rank, chat)) return void(0);
      else {
        if (MyVARS.welcome) {
          MyVARS.welcome = !MyVARS.welcome;
          return MyUTIL.sendChatOrPM(chat.type, chat.uid, CHAT.subChat(CHAT.chatMapping.toggleoff, {
            name: chat.un,
            'function': CHAT.chatMapping.welcomemsg
          }));
        } else {
          MyVARS.welcome = !MyVARS.welcome;
          return MyUTIL.sendChatOrPM(chat.type, chat.uid, CHAT.subChat(CHAT.chatMapping.toggleon, {
            name: chat.un,
            'function': CHAT.chatMapping.welcomemsg
          }));
        }
      }
    }
  },

  versionCommand: { //Added 01/27/2015 Zig
    command: 'version',
    rank: 'mod',
    type: 'exact',
    functionality: function(chat, cmd) {
      MyUTIL.sendChatOrPM(chat.type, chat.uid, CHAT.subChat(CHAT.chatMapping.online, {
        botname: MyVARS.loggedInName,
        version: MyVARS.version
      }));
    }
  },

//TODER: TEST echo2chat customCommand randomCommand
  echoCommand: { //Added 01/27/2015 Zig
    command: ['echo','echo2chat','echo2pm'],
    rank: 'manager',
    type: 'startsWith',
    functionality: function(chat, cmd) {
      try {
        if (this.type === 'exact' && chat.message.length !== cmd.length) return void(0);
        if (!BOTCOMMANDS.executable(this.rank, chat)) return void(0);
        var msg = chat.message;
        if (msg.length === cmd.length) return;
        var msgContent = msg.substring(cmd.length + 1);
        msgContent = msgContent.replace(/&#39;/g, "'");
        MyUTIL.logInfo(chat.un + " used echo: " + msgContent);
		if (cmd === 'echo2chat') 	return MyUTIL.sendChat(msgContent);
		else        				return MyUTIL.sendChatOrPM(chat.type, chat.uid, msgContent);
      } 
	  catch (err) { MyUTIL.logException("echoCommand: " + err.message); }
    }
  },
  //beerCommand: {   //Added 02/25/2015 Zig
  //   command: 'beer',
  //   rank: 'mod',
  //   type: 'startsWith',
  //   functionality: function (chat, cmd) {
  //   try{
  //       if (this.type === 'exact' && chat.message.length !== cmd.length) return void (0);
  //       if (!BOTCOMMANDS.executable(this.rank, chat)) return void (0);
  //       return MyUTIL.sendChat("@Bacon_Cheeseburger time for another PBR!");
  //       }
  //   catch(err) {
  //       MyUTIL.logException("beerCommand: " + err.message);
  //   }
  //   }
  //},
  speakCommand: { //Added 02/25/2015 Zig
    command: 'speak',
    rank: 'mod',
    type: 'startsWith',
    functionality: function(chat, cmd) {
      try {
        if (this.type === 'exact' && chat.message.length !== cmd.length) return void(0);
        if (!BOTCOMMANDS.executable(this.rank, chat)) return void(0);
        return MyUTIL.sendChatOrPM(chat.type, chat.uid, MyUTIL.randomCommentSelect());
      } catch (err) {
        MyUTIL.logException("speakCommand: " + err.message);
      }
    }
  },
  websiteCommand: {
    command: ['website', 'web'],
    rank: 'user',
    type: 'startsWith',
    functionality: function(chat, cmd) {
      if (this.type === 'exact' && chat.message.length !== cmd.length) return void(0);
      if (!BOTCOMMANDS.executable(this.rank, chat)) return void(0);
      else {
        if (typeof MyVARS.fbLink === "string")
          MyUTIL.sendChatOrPM(chat.type, chat.uid, CHAT.subChat(CHAT.chatMapping.website, {
            link: MyVARS.fbLink
          }));
      }
    }
  },

  //wootCommand: {   //Added 02/18/2015 Zig
  //    command: 'woot',
  //    rank: 'user',
  //    type: 'exact',
  //    functionality: function (chat, cmd) {
  //        if (this.type === 'exact' && chat.message.length !== cmd.length) return void (0);
  //        if (!BOTCOMMANDS.executable(this.rank, chat)) return void (0);
  //        else {
  //            MyAPI.WootThisSong();
  //        }
  //    }
  //},
  origemCommand: {
    command: 'origem',
    rank: 'user',
    type: 'exact',
    functionality: function(chat, cmd) {
      if (this.type === 'exact' && chat.message.length !== cmd.length) return void(0);
      if (!BOTCOMMANDS.executable(this.rank, chat)) return void(0);
      else {
        MyUTIL.sendChatOrPM(chat.type, chat.uid, CHAT.chatMapping.origem);
      }
    }
  },
  mehCommand: { //Added 02/14/2015 Zig
    command: 'meh',
    rank: 'manager',
    type: 'exact',
    functionality: function(chat, cmd) {
      try {
        MyAPI.MehThisSong();
      } catch (err) {
        MyUTIL.logException("mehCommand: " + err.message);
      }
    }
  },
  englishCommand: {
    command: 'english',
    rank: 'bouncer',
    type: 'startsWith',
    functionality: function(chat, cmd) {
      try {
        if (this.type === 'exact' && chat.message.length !== cmd.length) return void(0);
        if (!BOTCOMMANDS.executable(this.rank, chat)) return void(0);
        else {
          if (chat.message.length === cmd.length) return MyUTIL.sendChatOrPM(chat.type, chat.uid, '/me No user specified.');
		  var name = MyUTIL.defineCommandExecuteOnName(chat, cmd);
          var roomUser = USERS.lookupLocalUser(name);
          if (typeof roomUser === 'boolean') return MyUTIL.sendChatOrPM(chat.type, chat.uid, '/me Invalid user specified.');
          var lang = MyAPI.getChatRoomUser(roomUser.id).language;
          MyUTIL.logDebug("lang: " + lang);
          MyUTIL.logDebug("roomUser: " + roomUser.username);
          MyUTIL.logDebug("roomUser: " + roomUser.id);
          var englishMessage = USERS.englishMessage(lang, name);
          MyUTIL.sendChat(englishMessage);
        }
      } catch (err) {
        MyUTIL.logException("englishCommand: " + err.message);
      }
    }
  },
  grabCommand: { //Added 05/27/2015 Zig  (This command relies on Origem Woot to be running)
    command: 'grab',
    rank: 'manager',
    type: 'exact',
    functionality: function(chat, cmd) {
      try {
        // MyUTIL.sendChat("/grab");
        MyAPI.grabSong();
      } 
	  catch (err) { MyUTIL.logException("grabCommand: " + err.message); }
    }
  },
  addmeCommand: {
    command: ['q','qme','queueme','queue','wait','addme'],
    rank: 'user',
    type: 'startsWith',
    functionality: function(chat, cmd) {
      try {
		if (!BOTCOMMANDS.executable(this.rank, chat)) return void(0);
		WAITLIST.addToWaitlist(chat);
      } 
	  catch (err) { MyUTIL.logException("addmeCommand: " + err.message); }
    }
  },
  removemeCommand: {
    command: ['dq','removeme','uq','remove','nowait'],
    rank: 'user',
    type: 'startsWith',
    functionality: function(chat, cmd) {
      try {
		if (!BOTCOMMANDS.executable(this.rank, chat)) return void(0);
		var looper = 0;
		var removeCnt = 0;
		while ((MyROOM.queue.id.indexOf(chat.uid) > -1) && (looper < 10)) {
		  MyROOM.queue.id.splice(MyROOM.queue.id.indexOf(chat.uid),1);
		  looper++;
		  removeCnt++;
		}
		if (removeCnt === 0)return MyUTIL.sendChatOrPM(chat.type, chat.uid, "/me " + chat.un + " you are not on the waitlist");
		return MyUTIL.sendChatOrPM(chat.type, chat.uid, "/me " + chat.un + " you have been removed from the waitlist");
      } 
	  catch (err) { MyUTIL.logException("removemeCommand: " + err.message); }
    }
  },
  waitlistCommand: { //Added 05/27/2015 Zig  (This command relies on Origem Woot to be running)
    command: 'waitlist',
    rank: 'user',
    type: 'startsWith',
    functionality: function(chat, cmd) {
      try {
		if (MyROOM.queue.id.length === 0) return MyUTIL.sendChatOrPM(chat.type, chat.uid, "/me No current waitlist. Type .q .wait or .addme to join the wailist.");
		var idx = 1;
		MyROOM.queue.id.forEach(uid => {
		  MyUTIL.sendChatOrPM(chat.type, chat.uid, " " + idx + ": " + USERS.lookupLocalUser(uid).username);
		  idx++; });
      } 
	  catch (err) { MyUTIL.logException("waitlistCommand: " + err.message); }
    }
  },
  dasbootCommand: {
    command: 'dasboot',
    rank: 'manager',
    type: 'startsWith',
    functionality: function(chat, cmd) {
      if (this.type === 'exact' && chat.message.length !== cmd.length) return void(0);
      if (!BOTCOMMANDS.executable(this.rank, chat)) return void(0);
      var msg = chat.message;
      if (msg.length === cmd.length) return MyUTIL.sendChatOrPM(chat.type, chat.uid, CHAT.subChat(CHAT.chatMapping.nouserspecified, {
        name: chat.un
      }));
      var bootid = msg.substr(cmd.length + 1);
      if (isNaN(bootid)) return MyUTIL.sendChatOrPM(chat.type, chat.uid, "Invalid ID");
      MyUTIL.logInfo("Boot ID: " + bootid);
      MyAPI.moderateBanUser(bootid, 1, MyAPI.BAN.PERMA);
    }
  },

  zigunbanCommand: {
    command: 'zigunban',
    rank: 'bouncer',
    type: 'startsWith',
    functionality: function(chat, cmd) {
      if (this.type === 'exact' && chat.message.length !== cmd.length) return void(0);
      if (!BOTCOMMANDS.executable(this.rank, chat)) return void(0);
      else {
        $(".icon-population").click();
        $(".icon-ban").click();
        setTimeout(function(chat) {
          var msg = chat.message;
          if (msg.length === cmd.length) return MyUTIL.sendChat();
          var name = MyUTIL.defineCommandExecuteOnName(chat, cmd);
          var bannedUsers = MyAPI.getBannedUsers();
          var found = false;
          var bannedUser = null;
          for (var i = 0; i < bannedUsers.length; i++) {
            var user = bannedUsers[i];
            if (user.username === name) {
              bannedUser = user;
              found = true;
            }
          }
          if (!found) {
            $(".icon-chat").click();
            return MyUTIL.sendChat(CHAT.subChat(CHAT.chatMapping.notbanned, {
              name: chat.un
            }));
          }
          //MyAPI.moderateUnbanUser(bannedUser.id);
          MyUTIL.logDebug("Unbanned: " + name);
          MyUTIL.logDebug("Unban ID: " + bannedUser.id);
          setTimeout(function() {
            $(".icon-chat").click();
          }, 1000);
        }, 1000, chat);
      }
    }
  },
  
  
  slotsCommand: { //Added 03/30/2015 Zig
    command: ['slots','slot','spintowin'],
    rank: 'user',
    type: 'startsWith',
    functionality: function(chat, cmd) {
      try {
        if (this.type === 'exact' && chat.message.length !== cmd.length) return void(0);
        if (!BOTCOMMANDS.executable(this.rank, chat)) return void(0);
        var msg = chat.message;
        var bet = SLOTS.minBetsPerSpin;
        if (msg.length > cmd.length) {
          var myBet = msg.substr(cmd.length + 1);
          if (!isNaN(myBet)) bet = myBet;
        }
		SLOTS.playSlots(parseInt(bet), chat);
      } 
	  catch (err) { MyUTIL.logException("slotsCommand: " + err.message); }
    }
  },
  slothelpCommand: { //Added 03/30/2015 Zig
    command: ['slots?','slot?'],
    rank: 'user',
    type: 'startsWith',
    functionality: function(chat, cmd) {
      try {
        if (this.type === 'exact' && chat.message.length !== cmd.length) return void(0);
        if (!BOTCOMMANDS.executable(this.rank, chat)) return void(0);
		SLOTS.explainSlots(chat);
      } 
	  catch (err) { MyUTIL.logException("slothelpCommand: " + err.message); }
    }
  },
  slotStatsCommand: { //'boot'
    command: ['slotstats','slotstat'],
    rank: 'user',
    type: 'startsWith',
    functionality: function(chat, cmd) {
      try {
        if (this.type === 'exact' && chat.message.length !== cmd.length) return void(0);
        if (!BOTCOMMANDS.executable(this.rank, chat)) return void(0);
		var name = MyUTIL.defineCommandExecuteOnName(chat, cmd);
		var user = USERS.lookupLocalUser(name); 
		if (typeof user === 'boolean') 
		  return MyUTIL.sendChatOrPM(chat.type, chat.uid, CHAT.subChat(CHAT.chatMapping.invaliduserspecified, { name: chat.un }));
		SLOTS.slotStats(chat, user.id, user.username);
      } 
	  catch (err) { MyUTIL.logException("slotsCommand: " + err.message); }
    }
  },
  //
  
  rollCommand: { //Added 03/30/2015 Zig
    command: ['roll','spin','hitme','throw','dice','rollem','toss','fling','pitch','shoot','showmethemoney','letsdothisthing','rool'],
    rank: 'user',
    type: 'startsWith',
    functionality: function(chat, cmd) {
      try {
        if (this.type === 'exact' && chat.message.length !== cmd.length) return void(0);
        if (!BOTCOMMANDS.executable(this.rank, chat)) return void(0);
        if (MyAPI.CurrentDJID() !== chat.uid) return MyUTIL.sendChatOrPM(chat.type, chat.uid, CHAT.subChat(CHAT.chatMapping.notcurrentdj, {
          name: chat.un
        }));
        if (USERS.getRolled(chat.un)) return MyUTIL.sendChatOrPM(chat.type, chat.uid, CHAT.subChat(CHAT.chatMapping.doubleroll, {
          name: chat.un
        }));
        var msg = chat.message;
        var dicesides = 6;
        if (msg.length > cmd.length) {
          var dice = msg.substr(cmd.length + 1);
          if (!isNaN(dice)) dicesides = dice;
          if (dicesides < 4) dicesides = 4;
        }
        var rollResults = Math.floor(Math.random() * dicesides) + 1;
        USERS.setRolled(chat.un, true);
        var resultsMsg = "";
        var wooting = true;
        //rollResults = 6;
        if (rollResults > (dicesides * 0.5)) {
          //Pick a random word for the tasty command
          setTimeout(function() { USERS.tastyVote(MyAPI.CurrentUserID(), MyUTIL.bopCommand("")); }, 1000);
          setTimeout(function() { MyAPI.WootThisSong(); }, 1500);
          resultsMsg = CHAT.subChat(CHAT.chatMapping.rollresultsgood, {
            name: chat.un,
            roll: MyUTIL.numberToIcon(rollResults)
          });
        } else {
          setTimeout(function() {
            MyAPI.MehThisSong();
          }, 1000);
          resultsMsg = CHAT.subChat(CHAT.chatMapping.rollresultsbad, {
            name: chat.un,
            roll: MyUTIL.numberToIcon(rollResults)
          });
		  wooting = false;
        }
        if (chat.type == "pm") MyUTIL.sendPM(MyUTIL.numberToIcon(rollResults), chat.uid);
		MyUTIL.sendChat(resultsMsg + USERS.updateRolledStats(chat.un, wooting));
      } 
	  catch (err) { MyUTIL.logException("rollCommand: " + err.message); }
    }
  },
  meetingCommand: { //Added 03/28/2015 Zig
    command: ['meeting', 'lunch', 'beerrun'],
    rank: 'user',
    type: 'startsWith',
    functionality: function(chat, cmd) {
      try {
        if (this.type === 'exact' && chat.message.length !== cmd.length) return void(0);
        if (!BOTCOMMANDS.executable(this.rank, chat)) return void(0);
        var msg = chat.message;
        var name;
        var byusername = " ";
        if (msg.length === cmd.length) name = chat.un;
        else {
          name = MyUTIL.defineCommandExecuteOnName(chat, cmd);
          var perm = USERS.getPermission(chat.uid);
          if (perm < PERM.ROLE.BOUNCER) 
		    return MyUTIL.sendChatOrPM(chat.type, chat.uid, CHAT.subChat(CHAT.chatMapping.bootrank, { name: chat.un }));
          byusername = " [ executed by " + chat.un + " ]";
        }
        var user = USERS.lookupLocalUser(name);
        var currPos = MyAPI.getDjListPosition(user.id) + 1;
        if (currPos < 1) 
		  return MyUTIL.sendChatOrPM(chat.type, chat.uid, CHAT.subChat(CHAT.chatMapping.notinwaitlist, { name: name }));
        user.lastKnownPosition = currPos;
        user.lastSeenInLine = Date.now();
        USERS.updateDC(user);
        var msg;
        if (cmd == '.beerrun') {
          USERS.setBeerRunStatus(user, true);
          msg = CHAT.subChat(CHAT.chatMapping.beerrunleave, { name: MyAPI.getChatRoomUser(user.id).username, pos: currPos });
        }
        if (cmd == '.lunch') {
          USERS.setLunchStatus(user, true);
          msg = CHAT.subChat(CHAT.chatMapping.lunchleave, { name: MyAPI.getChatRoomUser(user.id).username, pos: currPos });
        }
        if (cmd == '.meeting') {
          USERS.setMeetingStatus(user, true);
          msg = CHAT.subChat(CHAT.chatMapping.meetingleave, { name: MyAPI.getChatRoomUser(user.id).username, pos: currPos });
        }
		if (MyAPI.djCount() < 2) MyAPI.botDjNow(); // Jump in line if there is no wailist
        USERS.setBootableID(user.id, true);
		
		//setTimeout(function() { MyUTIL.removeDJ(user.id, "Meeting command1"); }, 1000);
        MyUTIL.sendChat(msg + byusername);
      } 
	  catch (err) { MyUTIL.logException("meetingCommand: " + err.message); }
    }
  },
  tastyCommand: {
    command: ['tasty', 'rock', 'props', 'woot', 'groot', 'groovy', 'jam', 'nice', 'bop', 'cowbell', 'sax', 'ukulele', 'tango', 'samba', 'disco', 'waltz', 'metal',
      'bob', 'boogie', 'cavort', 'conga', 'flit', 'foxtrot', 'frolic', 'gambol', 'hop', 'hustle', 'jig', 'jitter', 'jitterbug', 'jive', 'jump', 'leap', 'prance',
      'promenade', 'rhumba', 'shimmy', 'strut', 'sway', 'swing', 'great', 'hail', 'good', 'acceptable', 'bad', 'excellent', 'exceptional', 'favorable', 'marvelous',
      'positive', 'satisfactory', 'satisfying', 'superb', 'valuable', 'wonderful', 'ace', 'boss', 'bully', 'choice', 'crack', 'pleasing', 'prime', 'rad',
      'sound', 'spanking', 'sterling', 'super', 'superior', 'welcome', 'worthy', 'admirable', 'agreeable', 'commendable', 'congenial', 'deluxe', 'first-class',
      'first-rate', 'gnarly', 'gratifying', 'honorable', 'neat', 'precious', 'recherché', 'reputable', 'select', 'shipshape', 'splendid', 'stupendous', 'keen',
      'nifty', 'swell', 'sensational', 'fine', 'cool', 'perfect', 'wicked', 'fab', 'heavy', 'incredible', 'outstanding', 'phenomenal', 'remarkable', 'special',
      'terrific', 'unique', 'aces', 'capital', 'dandy', 'enjoyable', 'exquisite', 'fashionable', 'lovely', 'love', 'solid', 'striking', 'top-notch',
      'slick', 'pillar', 'exemplary', 'alarming', 'astonishing', 'awe-inspiring', 'beautiful', 'breathtaking', 'fearsome', 'formidable', 'frightening', 'winner',
      'impressive', 'intimidating', 'facinating', 'prodigious', 'magnificent', 'overwhelming', 'shocking', 'stunning', 'stupefying', 'majestic', 'grand', 'velvet', 'icecream',
      'creamy', 'easy', 'effortless', 'fluid', 'gentle', 'glossy', 'peaceful', 'polished', 'serene', 'sleek', 'soft', 'tranquil', 'velvety', 'soothing', 'fluent', 'frictionless',
      'lustrous', 'rhythmic', 'crackerjack', 'laudable', 'peachy', 'praiseworthy', 'rare', 'super-duper', 'unreal', 'chill', 'savvy', 'smart', 'ingenious', 'genious',
      'sweet', 'delicious', 'lucious', 'bonbon', 'fetch', 'fetching', 'appealing', 'delightful', 'absorbing', 'alluring', 'cute', 'electrifying',
      'awesome', 'bitchin', 'fly', 'pleasant', 'relaxing', 'mellow', 'nostalgia', 'punk', 'like', 'fries', 'cake', 'drum', 'guitar', 'bass', 'tune', 'pop',
      'apple', 'fantastic', 'spiffy', 'yes', 'fabulous', 'happy', 'smooth', 'classic', 'mygf', 'docsgirlfriend', 'mygirlfriend', 'skank', 'jiggy', 'funk', 'funky', 'jazz', 'jazzy', 'dance', 'elvis',
      'hawt', 'extreme', 'dude', 'babes', 'fun', 'reggae', 'party', 'drums', 'trumpet', 'mosh', 'bang', 'blues', 'heart', 'feels', 'dope', 'makeitrain', 'wumbo',
      'firstclass', 'firstrate', 'topnotch', 'aweinspiring', 'superduper', 'dabomb', 'dashit', 'badass', 'bomb', 'popcorn', 'awesomesauce', 'awesomeness', 'sick',
      'sexy', 'brilliant', 'steampunk', 'bagpipes', 'piccolo', 'whee', 'vibe', 'banjo', 'harmony', 'harmonica', 'flute', 'dancing', 'dancin', 'ducky', 'approval', 'winning', 'okay',
      'hunkydory', 'peach', 'divine', 'radiant', 'sublime', 'refined', 'foxy', 'allskate', 'rush', 'boston', 'murica', '2fer', 'boom', 'bitches', 'oar', 'hipster',
      'hip', 'soul', 'soulful', 'cover', 'yummy', 'ohyeah', 'twist', 'shout', 'trippy', 'hot', 'country', 'stellar', 'smoove', 'pantydropper', 'baby', 'mmm', 'hooters',
      'tmbg', 'rhythm', 'kool', 'kewl', 'killer', 'biatch', 'woodblock', 'morecowbell', 'lesbian', 'lesbians', 'niceconnect', 'connect', 'kazoo', 'win', 'webejammin',
      'bellyrub', 'groove', 'gold', 'golden', 'twofer', 'phat', 'punkrock', 'punkrocker', 'merp', 'derp', 'herp-a-derp', 'narf', 'amazing', 'doabarrellroll', 'plusone',
      '133t', 'roofus', 'rufus', 'schway', 'shiz', 'shiznak', 'shiznik', 'shiznip', 'shiznit', 'shiznot', 'shizot', 'shwanky', 'shway',
      'sic', 'sicc', 'skippy', 'slammin', 'slamming', 'slinkster', 'smack', 'smashing', 'smashingly', 'snizzo', 'spiffylicious', 'superfly',
      'swass', 'tender', 'thrill', 'tight', 'tits', 'tizight', 'todiefor', 'to die for', 'trill', 'tuff', 'vicious', 'whizz-bang', 'wick',
      'wow', 'omg', 'A-1', 'ace', 'aces', 'aight', 'allthatandabagofchips', 'all that and a bag of chips', 'alrighty', 'alvo', 'amped',
      'A-Ok', 'ass-kicking', 'awesome-possum', 'awesome possum', 'awesomepossum', 'awesomesauce', 'awesome sauce', 'awesome-sauce',
      'awsum', 'bad-ass', 'badassical', 'badonkadonk', 'bananas', 'bangupjob', 'bang up job', 'beast', 'beastly', 'bees-knees',
      'bees knees', 'beesknees', 'bodacious', 'bomb', 'bomb-ass', 'bomb diggidy', 'bomb-diggidy', 'bombdiggidy', 'bonkers', 'bonzer',
      'boomtown', 'bostin', 'brill', 'bumping', 'capitol', 'cats ass', 'cats-ass', 'catsass', 'chilling', 'choice', 'clutch',
      'coo', 'coolage', 'cool beans', 'cool-beans', 'coolbeans', 'coolness', 'cramazing', 'cray-cray', 'crazy', 'crisp', 'crucial', 'da bomb',
      'da shit', 'da-bomb', 'da-shit', 'dashiznit', 'dabomb', 'dashit', 'da shiznit', 'da-shiznit', 'ear candy', 'ear-candy', 'earcandy',
      'epic', 'fan-fucking-tastic', 'fantabulous', 'far out', 'far-out', 'farout', 'fly', 'fresh', 'funsies', 'gangstar', 'gangster',
      'gansta', 'solidgold', 'golden', 'gr8', 'hardcore', 'hellacious', 'hoopla', 'hype', 'ill', 'itsallgood', 'its all good', 'jiggy', 'jinky', 'jiggity',
      'jolly good', 'jolly-good', 'jollygood', 'k3w1', 'kickass', 'kick-ass', 'kick ass', 'kick in the pants', 'kickinthepants', 'kicks', 'kix', 'legendary',
      'legit', 'like a boss', 'like a champ', 'like whoa', 'likeaboss', 'likeachamp', 'likewhoa', 'lush', 'mint', 'money', 'neato', 'nice', 'off da hook',
      'off the chain', 'off the hook', 'out of sight', 'peachy keen', 'peachy-keen', 'offdahook', 'offthechain', 'offthehook', 'outofsight',
      'peachykeen', 'perf', 'phatness', 'phenom', 'prime-time', 'primo', 'rad', 'radical', 'rage', 'rancid', 'random', 'nice cover', 'nicecover', 'raw',
      'redonkulus', 'righteous', 'rocking', 'rock-solid', 'rollin', '3fer', '4fer', 'threefer', 'fourfer', 'nice2fer', 'amazeballs', 'craycray',
      '5fer', '6fer', '7fer', '8fer', '9fer', '10fer', '11fer', '12fer',
      'whizzbang', 'a1', 'aok', 'asskicking', 'bombass', 'fanfuckingtastic', 'primetime', 'rocksolid', 'instrumental', 'rockin', ':star:', 'star', 'rockstar', ':metal:',
      '10s', '00s', '90s', '80s', '70s', '60s', '50s', '40s', '30s', '20s', 'insane', 'clever', ':heart:', ':heart_decoration:', ':heart_eyes:', ':heart_eyes_cat:', ':heartbeat:',
      ':heartpulse:', ':hearts:', ':yellow_heart:', ':green_heart:', ':two_hearts:', ':revolving_hearts:', ':sparkling_heart:', ':blue_heart:', 'giddyup', 'rockabilly',
      'nicefollow', ':beer:', ':beers:', 'niceplay', 'oldies', 'oldie', 'pj', 'slayer', 'kinky', ':smoking:', 'jewharp', 'talkbox', 'oogachakaoogaooga', 'oogachaka',
      'ooga-chaka', 'snag', 'snagged', 'yoink', 'classy', 'ska', 'grunge', 'jazzhands', 'verycool', 'ginchy', 'catchy', 'grabbed', 'yes', 'hellyes',
      'hellyeah', '27', '420', 'toke', 'fatty', 'blunt', 'joint', 'samples', 'doobie', 'oneeyedwilly', 'bongo', 'bingo', 'bangkok', 'tastytits', '=w=', ':guitar:', 'cl', 'carbonleaf',
      'festive', 'srv', 'motorhead', 'motörhead', 'pre2fer', 'pre-2fer', 'future2fer', 'phoenix', 'clhour', 'accordion', 'schwing', 'schawing', 'cool cover', 'coolcover',
      'boppin', 'bopping', 'jammin', 'jamming', 'tuba', 'powerballad', 'jukebox', 'word', 'classicrock', 'throwback', 'soultrain', 'train', '<3', 'bowie', 'dispatch',
      'holycraplarryhasashitloadofcommands', 'thatswhatimtalkinabout', 'waycool', ':thumbsup:', ':fire:', ':+1:', 'cheers', 'drink', 'irish', 'celtic',
      'thunder', 'stpaddy', 'stpaddys', 'vegemite', 'clap', 'sob', 'sonofabitch', ':clap:', 'forthewin', 'ftw', ':cake:', 'badabing', ':boom:', 'electric',
      'mullet', 'eclectic', 'aaahhmmazing', 'crowdfavorite', 'celebrate', 'goodtimes', 'dmb', 'greatcover', 'tastycover', 'awesomecover', 'sweet2fer',
      'holycrapthisisareallylongsong', 'onehitwonder', 'riot', 'cherry', 'poppin', 'zootsuit', 'moustache', 'stache', 'dank', 'whackyinflatableflailingarmtubeman',
      'aintnothingbutachickenwing', 'bestest', 'blast', 'coolfulness', 'coolish', 'dark', 'devious', 'disgusting', 'fat', 'fav', 'fave', 'fierce', 'flabbergasted',
      'fleek', 'fletch', 'flossy', 'gink', 'glish', 'goosh', 'grouse', 'hoopy', 'hopping', 'horrorshow', 'illmatic', 'immense', 'key', 'kick', 'live', 'lyte', 'moff',
      'nectar', 'noice', 'okie dokie', 'okiedokie', 'onfire', 'on fire', 'out to lunch', 'outtolunch', 'pimp', 'pimping', 'pimptacular', 'pissa', 'popping', 'premo',
      'radballs', 'ridiculous', 'rollicking', 'sharp', 'shibby', 'shiny', 'snoochie boochies', 'snoochieboochies', 'straight', 'stupid fresh', 'stupidfresh',
      'styling', 'sugar honey ice tea', 'sugarhoneyicetea', 'swatching', 'sweetchious', 'sweetnectar', 'sweetsauce', 'swick', 'swoll', 'throwed', 'tickety-boo',
      'ticketyboo', 'trick', 'wahey', 'wizard', 'wickedpissa', 'wicked pissa', 'psychedelic', 'stupiddumbshitgoddamnmotherfucker', 'squeallikeapig',
      'wax', 'yousuredohaveapurdymouth', 'retro', 'punchableface', 'punchablefaces', 'punchablefacefest', 'docsgoingtothisshowtonight', 'heaven', 'moaroar',
      'osfleftovers', 'osf', 'beard', 'dowop', 'productivitykiller', 'heyman', '420osf', 'osf420', 'twss', 'outfuckingstanding', 'modernspiritual', 'amodernspiritual',
      'realreggae', 'dadada', 'lalala', 'casio', 'joy', 'sunshine', 'whiledeezisaway', 'unintentional2fer', 'manbunhipsterstachepunchableface', 'taco',
      'tacos', 'faketastypoint', 'groovin', 'rollreminder', 'phishingforatastypoint', 'hipstermanbunpunchablefacestache','bnl','jewishamericanreggaerapperbeatboxer','magic',
      'makemefries','mankiss','copasetic','bluesy'
    ],
    rank: 'user',
    type: 'startsWith',
    functionality: function(chat, cmd) {
      try {
		//MyUTIL.logDebug("Tasty Command: " + chat.message);
        USERS.tastyVote(chat.uid, chat.message);
      } catch (err) {
        MyUTIL.logException("tastyCommand: " + err.message);
      }
    }
  },
  /*
  //TODER: TEST echo2chat customCommand randomCommand 
  customCommand: {  // Custom Tasty  (taf = Tasty As F)
    command: ['custom','ct','taf','cust'],
    rank: 'manager',
    type: 'startsWith',
    functionality: function(chat, cmd) {
      try {
        if (this.type === 'exact' && chat.message.length !== cmd.length) return void(0);
        if (!BOTCOMMANDS.executable(this.rank, chat)) return void(0);
		if (msg.length === cmd.length) sendChatOrPM("missing the custom tasty command");
		chat.message = chat.message.replace(MyVARS.commandLiteral, "");
		chat.message = chat.message.replace(cmd, "");
		USERS.tastyVote(chat.uid, chat.message);
      } 
	  catch (err) { MyUTIL.logException("customCommand: " + err.message); }
    }
  },
  //TODER: TEST echo2chat customCommand randomCommand 
  randomCommand: {  // Custom Tasty  (taf = Tasty As F)
    command: ['rand','random','ifeellucky'],
    rank: 'manager',
    type: 'startsWith',
    functionality: function(chat, cmd) {
      try {
        if (this.type === 'exact' && chat.message.length !== cmd.length) return void(0);
        if (!BOTCOMMANDS.executable(this.rank, chat)) return void(0);
		USERS.tastyVote(chat.uid, "");
      } 
	  catch (err) { MyUTIL.logException("randomCommand: " + err.message); }
    }
  },
  */
  lastplayedCommand: {
    command: 'lastplayed',
    rank: 'user',
    type: 'exact',
    functionality: function(chat, cmd) {
      try {
        if (this.type === 'exact' && chat.message.length !== cmd.length) return void(0);
        if (!BOTCOMMANDS.executable(this.rank, chat)) return void(0);
        MyUTIL.sendChatOrPM(chat.type, chat.uid, MyROOM.songinfo.songStatsMsg);
      } catch (err) {
        MyUTIL.logException("lastplayed: " + err.message);
      }
    }
  },
  exrouletteCommand: {
    command: ['exroulette', 'roulette?'],
    rank: 'resident-dj',
    type: 'exact',
    functionality: function(chat, cmd) {
      try {
        if (this.type === 'exact' && chat.message.length !== cmd.length) return void(0);
        if (!BOTCOMMANDS.executable(this.rank, chat)) return void(0);
        MyUTIL.sendChatOrPM(chat.type, chat.uid, "Explain ROULETTE: Managers type .roulette to start the game.  Type .join to join the game. The winner gets moved to a random place in line. It is a Russian roulette in that the new position is random. So, when you win you may get moved back in line.");
      } catch (err) {
        MyUTIL.logException("exroulettecommand: " + err.message);
      }
    }
  },
  extastyCommand: {
    command: ['extasty', 'tasty?'],
    rank: 'resident-dj',
    type: 'exact',
    functionality: function(chat, cmd) {
      try {
        if (this.type === 'exact' && chat.message.length !== cmd.length) return void(0);
        if (!BOTCOMMANDS.executable(this.rank, chat)) return void(0);
        MyUTIL.sendChatOrPM(chat.type, chat.uid, "Explain TASTY POINTS: This is another way to let your fellow DJs know you enjoy their play.  Since most of us run auto-woot extentions it is just a nice way to let others know when they play an extra tasty selection.");
      } catch (err) {
        MyUTIL.logException("extastycommand: " + err.message);
      }
    }
  },
  exmeetingCommand: {
    command: ['exmeeting', 'exlunch', 'exbeerrun', 'meeting?', 'lunch?', 'beerrun?'],
    rank: 'resident-dj',
    type: 'exact',
    functionality: function(chat, cmd) {
      try {
        if (this.type === 'exact' && chat.message.length !== cmd.length) return void(0);
        if (!BOTCOMMANDS.executable(this.rank, chat)) return void(0);
        MyUTIL.sendChatOrPM(chat.type, chat.uid, "Explain MEETING: If you have to go afk type, .meeting or .lunch and Larry will remove you from line. When you return hop back in line and Larry will restore your position in line. If you leave the room for over 10 mins you'll lose your spot.");
      } catch (err) {
        MyUTIL.logException("exmeeting: " + err.message);
      }
    }
  },
  exmehCommand: {
    command: ['exmeh', 'meh?'],
    rank: 'resident-dj',
    type: 'startsWith',
    functionality: function(chat, cmd) {
      try {
        if (this.type === 'exact' && chat.message.length !== cmd.length) return void(0);
        if (!BOTCOMMANDS.executable(this.rank, chat)) return void(0);
        if (chat.message.length === cmd.length) return MyUTIL.sendChatOrPM(chat.type, chat.uid, '/me No user specified.');
		var name = MyUTIL.defineCommandExecuteOnName(chat, cmd);
        var roomUser = USERS.lookupLocalUser(name);
        if (typeof roomUser === 'boolean') return MyUTIL.sendChatOrPM(chat.type, chat.uid, 'Invalid user specified.');
        var msgSend = "@" + roomUser.username + ": If you find yourself Meh-ing most songs, this isn't the room for you. Serial Meh'ers will be banned. If you don't like the music find a different room please.";
        MyUTIL.sendChat(msgSend);
      } catch (err) {
        MyUTIL.logException("exmeh: " + err.message);
      }
    }
  },
  //todoer delete after having fun with this:
  autorollCommand: {
    command: 'autoroll',
    rank: 'resident-dj',
    type: 'exact',
    functionality: function(chat, cmd) {
      try {
        if (this.type === 'exact' && chat.message.length !== cmd.length) return void(0);
        if (!BOTCOMMANDS.executable(this.rank, chat)) return void(0);
        MyUTIL.sendChatOrPM(chat.type, chat.uid, "Auto-Roll feature enabled for: " + chat.un);
      } catch (err) {
        MyUTIL.logException("autoroll: " + err.message);
      }
    }
  },
  whyCommand: {
    command: 'why',
    rank: 'bouncer',
    type: 'exact',
    functionality: function(chat, cmd) {
      try {
        if (this.type === 'exact' && chat.message.length !== cmd.length) return void(0);
        if (!BOTCOMMANDS.executable(this.rank, chat)) return void(0);
        MyUTIL.sendChatOrPM(chat.type, chat.uid, "You're only getting woots cause we all have auto woot");
      } catch (err) {
        MyUTIL.logException("whycommand: " + err.message);
      }
    }
  },
  biyowCommand: {  //hipsterCommand
    command: 'biyow',
    rank: 'manager',
    type: 'exact',
    functionality: function(chat, cmd) {
      if (this.type === 'exact' && chat.message.length !== cmd.length) return void(0);
      if (!BOTCOMMANDS.executable(this.rank, chat)) return void(0);
      else {
        MyUTIL.sendChatOrPM(chat.type, chat.uid, "@WhiteWidow loves the bass line.");
      }
    }
  },
  ughCommand: {
    command: 'ugh',
    rank: 'bouncer',
    type: 'exact',
    functionality: function(chat, cmd) {
      try {
        if (this.type === 'exact' && chat.message.length !== cmd.length) return void(0);
        if (!BOTCOMMANDS.executable(this.rank, chat)) return void(0);
        MyUTIL.sendChatOrPM(chat.type, chat.uid, "You know your play sucks when the chat goes quiet");
      } catch (err) {
        MyUTIL.logException("ughcommand: " + err.message);
      }
    }
  },
  exwaitCommand: {
    command: ['exwait', 'wait?','exwaitlist', 'waitlist?','q?'],
    rank: 'user',
    type: 'exact',
    functionality: function(chat, cmd) {
      try {
        if (this.type === 'exact' && chat.message.length !== cmd.length) return void(0);
        if (!BOTCOMMANDS.executable(this.rank, chat)) return void(0);
        MyUTIL.sendChatOrPM(chat.type, chat.uid, "Explain WAITLIST: To join the waitlist type: .q .wait or .addme");
		setTimeout(function () { MyUTIL.sendChatOrPM(chat.type, chat.uid, "DJs removed to allow others on the waitlist to play a song, will automatically be added to the waitlist."); }, 500);
		setTimeout(function () { MyUTIL.sendChatOrPM(chat.type, chat.uid, "To be removed from the waitlist type: .removeme"); }, 1000);
	  } 		
	  catch (err) { MyUTIL.logException("exrollcommand: " + err.message); }
    }
  },
  exrollCommand: {
    command: ['exroll', 'roll?'],
    rank: 'resident-dj',
    type: 'exact',
    functionality: function(chat, cmd) {
      try {
        if (this.type === 'exact' && chat.message.length !== cmd.length) return void(0);
        if (!BOTCOMMANDS.executable(this.rank, chat)) return void(0);
        MyUTIL.sendChatOrPM(chat.type, chat.uid, "Explain ROLL: A dj can roll the dice during their spin. Rolling 1-3=MEH, 4-6=WOOT. 50% chance. type .roll during your spin to do it.");
      } catch (err) {
        MyUTIL.logException("exrollcommand: " + err.message);
      }
    }
  },
  kissCommand: {
    command: 'kiss',
    rank: 'resident-dj',
    type: 'exact',
    functionality: function(chat, cmd) {
      try {
        if (this.type === 'exact' && chat.message.length !== cmd.length) return void(0);
        if (!BOTCOMMANDS.executable(this.rank, chat)) return void(0);
        MyUTIL.sendChatOrPM(chat.type, chat.uid, "gives " + chat.un + " a big fat :kiss:");
      } catch (err) {
        MyUTIL.logException("exkisscommand: " + err.message);
      }
    }
  },
  loguserCommand: {
    command: 'loguser',
    rank: 'bouncer',
    type: 'startsWith',
    functionality: function(chat, cmd) {
      try {
        if (this.type === 'exact' && chat.message.length !== cmd.length) return void(0);
        if (!BOTCOMMANDS.executable(this.rank, chat)) return void(0);
        else {

          if (chat.message.length === cmd.length) return MyUTIL.logChat('/me No user specified.');
		  var name = MyUTIL.defineCommandExecuteOnName(chat, cmd);
          var roomUser = USERS.lookupLocalUser(name);
          if (typeof roomUser === 'boolean') return MyUTIL.logChat('/me Invalid user specified.');
          var resetDebug = false;
          if (MyROOM.debug === false) resetDebug = true;
          MyROOM.debug = true;
          MyUTIL.logObject(roomUser, "User");
          MyUTIL.logDebug("JSON: " + JSON.stringify(roomUser));
          if (resetDebug) MyROOM.debug = false;
        }
      } catch (err) {
        MyUTIL.logException("loguserCommand: " + err.message);
      }
    }
  },
  lowrollpctCommand: { //Added 07/03/2015 Zig
    command: 'lowrollpct',
    rank: 'resident-dj',
    type: 'exact',
    functionality: function(chat, cmd) {
      try {
        if (this.type === 'exact' && chat.message.length !== cmd.length) return void(0);
        if (!BOTCOMMANDS.executable(this.rank, chat)) return void(0);
        var leaderBoard = USERS.loadRollPct(false);
        USERS.displayLeaderBoard(leaderBoard, chat.un, true, "Low Roll Percentages: ");
      } catch (err) {
        MyUTIL.logException("lowrollpct: " + err.message);
      }
    }
  },
  lowrollptsCommand: { //Added 07/03/2015 Zig
    command: 'lowrollpts',
    rank: 'resident-dj',
    type: 'exact',
    functionality: function(chat, cmd) {
      try {
        if (this.type === 'exact' && chat.message.length !== cmd.length) return void(0);
        if (!BOTCOMMANDS.executable(this.rank, chat)) return void(0);
        var leaderBoard = USERS.loadRollPoints(false);
        USERS.displayLeaderBoard(leaderBoard, chat.un, false, "Low Roll Points: ");
      } catch (err) {
        MyUTIL.logException("lowrollpts: " + err.message);
      }
    }
  },
  rollpctCommand: { //Added 07/03/2015 Zig
    command: 'rollpct',
    rank: 'resident-dj',
    type: 'exact',
    functionality: function(chat, cmd) {
      try {
        if (this.type === 'exact' && chat.message.length !== cmd.length) return void(0);
        if (!BOTCOMMANDS.executable(this.rank, chat)) return void(0);
        var leaderBoard = USERS.loadRollPct(true);
        USERS.displayLeaderBoard(leaderBoard, chat.un, true, "Top Roll Percentages: ");
      } catch (err) {
        MyUTIL.logException("rollpct: " + err.message);
      }
    }
  },
  rollptsCommand: { //Added 07/03/2015 Zig
    command: 'rollpts',
    rank: 'resident-dj',
    type: 'exact',
    functionality: function(chat, cmd) {
      try {
        if (this.type === 'exact' && chat.message.length !== cmd.length) return void(0);
        if (!BOTCOMMANDS.executable(this.rank, chat)) return void(0);
        var leaderBoard = USERS.loadRollPoints(true);
        USERS.displayLeaderBoard(leaderBoard, chat.un, false, "Top Roll Points: ");
      } catch (err) {
        MyUTIL.logException("rollpts: " + err.message);
      }
    }
  },
  nsfwCommand: { //Added 04/22/2015 Zig
    command: 'nsfw',
    rank: 'user',
    type: 'exact',
    functionality: function(chat, cmd) {
      try {
        if (this.type === 'exact' && chat.message.length !== cmd.length) return void(0);
        if (!BOTCOMMANDS.executable(this.rank, chat)) return void(0);
        MyUTIL.sendChat("NSFW Warning [" + chat.un + "]: @djs @rdjs @bouncers @managers @hosts @staff");
      } catch (err) {
        MyUTIL.logException("nsfwCommand: " + err.message);
      }
    }
  },
  eightballCommand: { //Added 04/01/2015 Zig
    command: ['8ball', 'eightball', 'larry'],
    rank: 'user',
    type: 'startsWith',
    functionality: function(chat, cmd) {
      try {
        if (this.type === 'exact' && chat.message.length !== cmd.length) return void(0);
        if (!BOTCOMMANDS.executable(this.rank, chat)) return void(0);
        var msg = chat.message;
        var magicResponse = MyUTIL.eightBallSelect();
        if (msg.length === cmd.length) return MyUTIL.sendChat(CHAT.subChat(CHAT.chatMapping.eightballresponse2, {
          name: chat.un,
          response: magicResponse
        }));
        var myQuestion = msg.substring(cmd.length + 1);
        MyUTIL.sendChat(CHAT.subChat(CHAT.chatMapping.eightballquestion, {
          name: chat.un,
          question: myQuestion
        }));
        setTimeout(function() {
          MyUTIL.sendChat(CHAT.subChat(CHAT.chatMapping.eightballresponse1, {
            response: magicResponse
          }));
        }, 500);
      } catch (err) {
        MyUTIL.logException("eightballCommand: " + err.message);
      }
    }
  },
  zigbanCommand: {
    command: 'zigban',
    rank: 'manager',
    type: 'startsWith',
    functionality: function(chat, cmd) {
      if (this.type === 'exact' && chat.message.length !== cmd.length) return void(0);
      if (!BOTCOMMANDS.executable(this.rank, chat)) return void(0);
      var msg = chat.message;
      if (msg.length === cmd.length) return MyUTIL.sendChat(CHAT.subChat(CHAT.chatMapping.nouserspecified, {
        name: chat.un
      }));
      var bootid = msg.substr(cmd.length + 1);
      if (isNaN(bootid)) return MyUTIL.sendChat("Invalid ID");
      $(".icon-population").click();
      $(".icon-ban").click();
      setTimeout(function(bootid) {
        MyUTIL.logDebug("Boot ID: " + bootid);
        //MyAPI.moderateBanUser(bootid, 1, MyAPI.BAN.PERMA);
        setTimeout(function() {
          $(".icon-chat").click();
        }, 1000);
      }, 1000);
    }
  },
  zigaCommand: {
    command: 'ziga',
    rank: 'cohost',
    type: 'exact',
    functionality: function(chat, cmd) {
      try {
        MyAPI.botDjNow();
      } catch (err) {
        MyUTIL.logException("zigaCommand: " + err.message);
      }
    }
  },
  zigaaCommand: {
    command: 'zigaa',
    rank: 'cohost',
    type: 'exact',
    functionality: function(chat, cmd) {
      try {
        MyAPI.botHopDown();
      } catch (err) {
        MyUTIL.logException("zigaaCommand: " + err.message);
      }
    }
  },
  zigcCommand: {
    command: 'zigc',
    rank: 'cohost',
    type: 'exact',
    functionality: function(chat, cmd) {
      try {
        MyUTIL.validateUserCheck();
      } catch (err) {
        MyUTIL.logException("zigcCommand: " + err.message);
      }
    }
  },
  zigdCommand: {
    command: 'zigd',
    rank: 'cohost',
    type: 'exact',
    functionality: function(chat, cmd) {
      try {
        //grab song testing:
        var songHistory = MyAPI.getHistory();
        //var songHistory = MyAPI.getUsers();
        MyUTIL.logObject(songHistory[0], "songHistory");
        MyUTIL.logDebug("Media cid: " + songHistory[0].media.cid);
        var newMedia = MyAPI.CurrentSong();
        MyUTIL.logObject(newMedia, "Media");
        MyAPI.grabSong("7527918", songHistory[0].media.cid);
        //Request body: {"playlistID":,"historyID":"3602db39-e515-4739-aa24-0dc084f384bc"}
        //7527918

      } catch (err) {
        MyUTIL.logException("zigdCommand: " + err.message);
      }
    }
  },
  debugCommand: {
    command: 'debug',
    rank: 'cohost',
    type: 'exact',
    functionality: function(chat, cmd) {
      try {
        if (this.type === 'exact' && chat.message.length !== cmd.length) return void(0);
        if (!BOTCOMMANDS.executable(this.rank, chat)) return void(0);
        MyROOM.debug = (!MyROOM.debug);
        MyUTIL.logInfo("Debug = " + MyROOM.debug);
      } catch (err) {
        MyUTIL.logException("debugCommand: " + err.message);
      }
    }
  },
  gifenabledCommand: {
    command: 'gifenabled',
    rank: 'cohost',
    type: 'exact',
    functionality: function(chat, cmd) {
      try {
        if (this.type === 'exact' && chat.message.length !== cmd.length) return void(0);
        if (!BOTCOMMANDS.executable(this.rank, chat)) return void(0);
        MyVARS.gifEnabled = (!MyVARS.gifEnabled);
        MyUTIL.logInfo("GifEnabled = " + MyROOM.debug);
      } catch (err) {
        MyUTIL.logException("gifenabledCommand: " + err.message);
      }
    }
  },
  //            whoisCommand: {
  //                command: 'whois',
  //                rank: 'bouncer',
  //                type: 'startsWith',
  //                functionality: function (chat, cmd) {
  //                    try {
  //                        if (this.type === 'exact' && chat.message.length !== cmd.length) return void (0);
  //                        if (!BOTCOMMANDS.executable(this.rank, chat)) return void (0);
  //                        var msg = chat.message;
  //                        if (msg.length === cmd.length) return MyUTIL.sendChat(CHAT.subChat(CHAT.chatMapping.nouserspecified, {name: chat.un}));
  //                        var whoisuser = MyUTIL.defineCommandExecuteOnName(chat, cmd);
  //                        MyUTIL.logDebug("whois: " + whoisuser);
  //                        var user;
  //                        if (isNaN(whoisuser)) user = USERS.lookupLocalUser(whoisuser);
  //                        else                  user = MyAPI.getChatRoomUser(whoisuser.id);
  //                        if (typeof user !== 'undefined')  {
  //                            MyUTIL.logDebug("USER ID: " + user.id);
  //                            MyUTIL.sendChat("USER: " + user.username + " " + user.id);
  //                        }
  //                        MyUTIL.logDebug("TYPE: " + typeof user);
  //                    }
  //                    catch(err) {
  //                        MyUTIL.logException("whoisCommand: " + err.message);
  //                    }
  //                }
  //            },

  whoisCommand: {
    command: 'whois',
    rank: 'bouncer',
    type: 'startsWith',
    functionality: function(chat, cmd) {
      if (this.type === 'exact' && chat.message.length !== cmd.length) return void(0);
      if (!BOTCOMMANDS.executable(this.rank, chat)) return void(0);
      else {
        var msg = chat.message;
        var name;
        if (msg.length === cmd.length) name = chat.un;
        else name = MyUTIL.defineCommandExecuteOnName(chat, cmd);
        var whoismsg = MyAPI.whoisinfo(chat.un, name);
        if (whoismsg.length > 0) MyUTIL.sendChat(whoismsg);
      }
    }
  },
	imoutCommand: {
		command: ['imout','laterall','cya','bye','chow','goodbye','c-ya','farewell','later','solong','catchyoulater','catchyalater',
				  'allrightthen','adios','ciao','aurevoir','gottabolt','buh-bye','buhbye','andonthatnote','iquit','onthatnote',
				  'peaceout','smellyoulater','gottarun','beer30','beerthirty','untiltomorrow','seeyamonday','stickaforkinme',
				  'imdone','imouttahere','smellyalater','seeyalater','seeyoulater','seeyatomorrow','outtahere','keepitreal'],
		rank: 'user',
		type: 'startsWith',
		functionality: function (chat, cmd)  {
			try {
				if (this.type === 'exact' && chat.message.length !== cmd.length) return void (0);
				if (!BOTCOMMANDS.executable(this.rank, chat)) return void (0);
				if (MyAPI.CurrentDJID() === chat.uid) {
				  if (MyAPI.djCount() < 2) MyAPI.botDjNow(); // Jump in line if there is no wailist
				  USERS.setBootableID(chat.uid, true);
				}
				else if (MyAPI.userInDjList(chat.uid)) {
				  MyUTIL.removeDJ(chat.uid, "Imout Command");
				}
				else { return; }
				MyUTIL.sendChat(CHAT.subChat(MyUTIL.selectRandomFromArray(CHAT.randomByeArray), {username: chat.un}));
				if (cmd === "imouttahere") setTimeout(function () { MyUTIL.sendChat("https://memeguy.com/photos/images/mrw-im-looking-forward-to-a-music-assembly-and-the-guy-starts-singing-wrecking-ball-80297.gif"); }, 250);
			}
			catch(err) { MyUTIL.logException("imoutCommand: " + err.message); }
		}
	},

	deadhorseCommand: {
		command: ['deadhorse','deadhorses'],
		rank: 'mod',
		type: 'startsWith',
		functionality: function (chat, cmd)  {
			try {
				if (this.type === 'exact' && chat.message.length !== cmd.length) return void (0);
				if (!BOTCOMMANDS.executable(this.rank, chat)) return void (0);
				setTimeout(function() { MyUTIL.sendChatOrPM(chat.type, chat.uid, MyUTIL.selectRandomFromArray(MyCOMMENTS.deadHorseArray));  }, 250);
			}
			catch(err) { MyUTIL.logException("deadhorseCommand: " + err.message); }
		}
	},
	fourthirtyCommand: {
		command: ['fourthirty','430'],
		rank: 'mod',
		type: 'startsWith',
		functionality: function (chat, cmd)  {
			try {
				if (this.type === 'exact' && chat.message.length !== cmd.length) return void (0);
				if (!BOTCOMMANDS.executable(this.rank, chat)) return void (0);
				 setTimeout(function () { MyUTIL.sendChatOrPM(chat.type, chat.uid, "https://media.giphy.com/media/11QJgcchgwskq4/giphy.gif"); }, 250);
			}
			catch(err) { MyUTIL.logException("fourthirtyCommand: " + err.message); }
		}
	},
	moonrasorCommand: {
		command: ['moonrasor'],
		rank: 'mod',
		type: 'startsWith',
		functionality: function (chat, cmd)  {
			try {
				if (this.type === 'exact' && chat.message.length !== cmd.length) return void (0);
				if (!BOTCOMMANDS.executable(this.rank, chat)) return void (0);
				 setTimeout(function () { MyUTIL.sendChatOrPM(chat.type, chat.uid, "https://i.imgflip.com/3gce77.jpg"); }, 250);
			}
			catch(err) { MyUTIL.logException("moonrasorCommand: " + err.message); }
		}
	},
			wreckingballCommand: {
                command: 'wreckingball',
                rank: 'resident-dj',
                type: 'startsWith',
                functionality: function (chat, cmd)  {
                    try {
                        if (this.type === 'exact' && chat.message.length !== cmd.length) return void (0);
                        if (!BOTCOMMANDS.executable(this.rank, chat)) return void (0);
						 USERS.tastyVote(chat.uid, chat.message);
						 var randomID = Math.floor(Math.random() * 3); // [0-2]
						 if (randomID === 0) { setTimeout(function () { MyUTIL.sendChatOrPM(chat.type, chat.uid, "https://thumbs.gfycat.com/GraveBlaringChrysalis-size_restricted.gif"); }, 250); }
						 else if (randomID === 1){ setTimeout(function () { MyUTIL.sendChatOrPM(chat.type, chat.uid, "https://forgifs.com/gallery/d/227933-2/Pendulum-wrecking-ball.gif"); }, 250); }
						 else { setTimeout(function () { MyUTIL.sendChatOrPM(chat.type, chat.uid, "https://i.makeagif.com/media/6-21-2018/BM0WKE.gif"); }, 250); }
                    }
                    catch(err) { MyUTIL.logException("wreckingballCommand: " + err.message); }
                }
            },
            elevenCommand: {
                command: ['eleven','11'],
                rank: 'resident-dj',
                type: 'startsWith',
                functionality: function (chat, cmd)  {
                    try {
                        if (this.type === 'exact' && chat.message.length !== cmd.length) return void (0);
                        if (!BOTCOMMANDS.executable(this.rank, chat)) return void (0);
						 USERS.tastyVote(chat.uid, chat.message);
						 setTimeout(function () { MyUTIL.sendChatOrPM(chat.type, chat.uid, "http://media.tumblr.com/10430abfede9cebe9776f7de26e302e4/tumblr_inline_mjzgvrh7Uv1qz4rgp.gif"); }, 250);
                    }
                    catch(err) { MyUTIL.logException("elevenCommand: " + err.message); }
                }

            },
            // Goofy Dog playing piano gif:  
			pianoCommand: {
                command: 'piano',
                rank: 'resident-dj',
                type: 'startsWith',
                functionality: function (chat, cmd)  {
                    try {
                        if (this.type === 'exact' && chat.message.length !== cmd.length) return void (0);
                        if (!BOTCOMMANDS.executable(this.rank, chat)) return void (0);
						 USERS.tastyVote(chat.uid, chat.message);
						 setTimeout(function () { MyUTIL.sendChatOrPM(chat.type, chat.uid, "https://media.giphy.com/media/ELUZ0bkF8j4ru/giphy.gif"); }, 250);
                    }
                    catch(err) { MyUTIL.logException("pianoCommand: " + err.message); }
                }
            },
			mumfordCommand: {
                command: 'mumford',
                rank: 'resident-dj',
                type: 'startsWith',
                functionality: function (chat, cmd)  {
                    try {
                        if (this.type === 'exact' && chat.message.length !== cmd.length) return void (0);
                        if (!BOTCOMMANDS.executable(this.rank, chat)) return void (0);
						 USERS.tastyVote(chat.uid, chat.message);
						 //iseven https://media1.giphy.com/media/iECvnZlpCGrIY/giphy.gif
						 setTimeout(function () { MyUTIL.sendChatOrPM(chat.type, chat.uid, "https://media.giphy.com/media/kabkVP3FiZrSE/giphy.gif"); }, 250);
                    }
                    catch(err) { MyUTIL.logException("mumfordCommand: " + err.message); }
                }
            },
			//https://media.giphy.com/media/3cLYEjIaxidkQ/giphy.gif
            dmbCommand: {
                command: 'dmb',
                rank: 'resident-dj',
                type: 'startsWith',
                functionality: function (chat, cmd)  {
                    try {
                        if (this.type === 'exact' && chat.message.length !== cmd.length) return void (0);
                        if (!BOTCOMMANDS.executable(this.rank, chat)) return void (0);
						 USERS.tastyVote(chat.uid, chat.message);
						 setTimeout(function () { MyUTIL.sendChatOrPM(chat.type, chat.uid, "https://media.tenor.com/images/952fe3b2e8cae6a8cb39aba07e5e1beb/tenor.gif"); }, 250);
                    }
                    catch(err) { MyUTIL.logException("dmbCommand: " + err.message); }
                }
            },
			//https://i.imgur.com/fgU7KCL.gif OR http://i.imgur.com/eBGUmzW.jpg
			beiberCommand: {
                command: ['beiber','bieber','shittyband'],
                rank: 'resident-dj',
                type: 'startsWith',
                functionality: function (chat, cmd)  {
                    try {
                        if (this.type === 'exact' && chat.message.length !== cmd.length) return void (0);
                        if (!BOTCOMMANDS.executable(this.rank, chat)) return void (0);
						 // USERS.tastyVote(chat.uid, chat.message);
						 setTimeout(function () { MyUTIL.sendChatOrPM(chat.type, chat.uid, "https://i.imgur.com/fgU7KCL.gif"); }, 250);
                    }
                    catch(err) { MyUTIL.logException("beiberCommand: " + err.message); }
                }
            },

  youtubeCommand: {
    command: 'youtube',
    rank: 'user',
    type: 'exact',
    functionality: function(chat, cmd) {
      if (this.type === 'exact' && chat.message.length !== cmd.length) return void(0);
      if (!BOTCOMMANDS.executable(this.rank, chat)) return void(0);
      else {
        if (typeof MyVARS.youtubeLink === "string")
          MyUTIL.sendChatOrPM(chat.type, chat.uid, CHAT.subChat(CHAT.chatMapping.youtube, {
            name: chat.un,
            link: MyVARS.youtubeLink
          }));
      }
    }
  }
};

//SECTION PERM: User roles/permissions
var PERM = {
  ROLE: {
    BOT: 6,
    HOST: 5,
    COHOST: 4,
    MANAGER: 3,
    BOUNCER: 2,
    DJ: 1,
    NONE: 0
  },
};

// USAGE: XFER STORAGE SETTINGS FROM ONE PC TO ANOTHER:
// GET Storage settings - Execute from Console:
// JSON.stringify(MyROOM.users)
// JSON.stringify(BAN.newBlacklist);
// JSON.stringify(BAN.newBlacklistIDs);
//
// Replace all but 1st and last \" with \"
//
// MyROOM.users = JSON.parse(<<DATA>>);
// BAN.newBlacklist = JSON.parse(<<DATA>>);
// BAN.newBlacklistIDs = JSON.parse(<<DATA>>);

//SECTION STORAGE: Store & Load settings/users/banlist etc.
var STORAGE = {
  storeToStorage: function() {
    try {
	  // Prevent saving empty player list:
	  if ((MyUTIL.IsClubDeez()) && (MyROOM.users.length < 20)) return;
	  if ((MyUTIL.IsLarrysLab()) && (MyROOM.users.length < 3)) return;
      //MyUTIL.logDebug("START: storeToStorage");
      localStorage.setItem("basicBotsettings", JSON.stringify(MyVARS));
      //MyUTIL.logDebug("SETTING DATA STORED");
      localStorage.setItem("basicBotRoom", JSON.stringify(MyROOM));
      localStorage.setItem("basicBotSlots", JSON.stringify(SLOTS.Players));
      //MyUTIL.logDebug("ROOM DATA STORED");
      // todoer Figure this shit OUT!!!
      //              this.votes = {
      //                 songs: 0,
      //                 tasty: 0,
      //                 woot: 0,
      //                 meh: 0,
      //                 curate: 0
      //             };
      // votes":{"songs":3,"tasty":0,"woot":0,"meh":0,"curate":0}
      //                         var msg = CHAT.subChat(CHAT.chatMapping.mystats, {name: user.username, 
      //                                                                      songs: user.votes.songs,
      //                                                                      woot: user.votes.woot, 
      //                                                                      mehs: user.votes.meh, 
      //                                                                      grabs: user.votes.curate, 
      //                                                                      tasty: user.votes.tasty});
      //         "DEBUG: STORED DATA: {"users":[
      // 
      // {"id":5226916,"username":"LeviHomer","jointime":1432793489836,"lastActivity":1432793516617,"votes":{"songs":3,"tasty":0,"woot":0,"meh":0,"curate":0},"tastyVote":false,"rolled":false,"lastEta":null,"beerRun":false,"inMeeting":false,"atLunch":false,"afkWarningCount":0,"badSongCount":0,"afkCountdown":null,"inRoom":true,"isMuted":false,"rollStats":{"lifeWoot":0,"lifeTotal":0,"dayWoot":0,"dayTotal":0,"DOY":-1},"lastDC":{"time":null,"leftroom":null,"resetReason":"","position":-1,"songCount":0},"lastKnownPosition":-1,"lastSeenInLine":null},
      // {"id":5226880,"username":"DexterNix","jointime":1432793489845,"lastActivity":1432793489845,"votes":{"songs":0,"tasty":0,"woot":0,"meh":0,"curate":0},"tastyVote":false,"rolled":false,"lastEta":null,"beerRun":false,"inMeeting":false,"atLunch":false,"afkWarningCount":0,"badSongCount":0,"afkCountdown":null,"inRoom":true,"isMuted":false,"rollStats":{"lifeWoot":0,"lifeTotal":0,"dayWoot":0,"dayTotal":0,"DOY":-1},"lastDC":{"time":null,"leftroom":null,"resetReason":"","position":-1,"songCount":0},"lastKnownPosition":0,"lastSeenInLine":null},
      // {"id":3837756,"username":"Doc_Z","jointime":1432793489850,"lastActivity":1432793489850,"votes":{"songs":0,"tasty":0,"woot":2,"meh":0,"curate":0},"tastyVote":false,"rolled":false,"lastEta":null,"bootable":false,"beerRun":false,"inMeeting":false,"atLunch":false,"afkWarningCount":0,"badSongCount":0,"afkCountdown":null,"inRoom":true,"isMuted":false,"rollStats":{"lifeWoot":0,"lifeTotal":0,"dayWoot":0,"dayTotal":0,"DOY":-1},"lastDC":{"time":null,"leftroom":null,"resetReason":"","position":-1,"songCount":0},"lastKnownPosition":0,"lastSeenInLine":null}
      // ],"debug":true,"afkList":[],"mutedUsers":[],"bannedUsers":[],"skippable":true,"usercommand":true,"allcommand":true,"afkInterval":485,"blacklistInterval":null,"randomInterval":490,"autoskip":false,"autoskipTimer":null,"autodisableInterval":null,"queueing":0,"queueable":true,"currentDJID":5226916,"currentMediaCid":"s88r_q7oufE","currentMediaStart":1432793520843,"historyList":[["zV8tJXRUtHg",1432771590001,1432789190910],["kvDMlk3kSYg",1432771595577,1432789198263],["a80o9o-2Vrw",1432771600675,1432789440991],["iPUmE-tne5U",1432771778731,1432789452164],["oh4wgGIN_qE",1432772008885,1432789682358],["I-h4A7bF8wQ",1432772243988,1432789917483],["ateQQc-AgEM",1432772454069,1432790127595],["8NjbGr2nk2c",1432772482569,1432785797611],["koJlIGDImiU",1432772669820],["gMhMaNAmT-U",1432772941005],["Urdlvw0SSEc",1432772997149,1432790353572],["Idhq-CLU21g",1432773206269,1432790667764],["pIgZ7gMze7A",1432773283276,1432790680529],["ojDWH2ZuwNk",1432773300309,1432790912785],["m_-Qtz70_z4",1432773508366,1432791120899],["XfR9iY5y94s",1432773732538,1432791345033],["-qCDypgAV_E",1432773955596,1432791568084],["GOsoa4AGRhY",1432774149679,1432791762136],["Zs3xXlXSOKk",1432774286758,1432791899345],["iywaBOMvYLI",1432774504988,1432786819684],["D4aaXDfSRDc",1432774730132,1432786578803],["K84j7CJIUKU",1432774971203,1432786496954],["9jK-NcRmVcw",1432775261929,1432792120504],["EkwD5rQ-_d4",1432775304460,1432792417688],["YLncxyCXPsU",1432775621560,1432792734747],["6W5pq4bIzIw",1432775832673,1432793493588],["EOvMpND2OZY",1432776509962,1432793516269],["2LlSs-IM-TM",1432776759115],["s88r_q7oufE",1432776767999,1432793520843],["IaNzrXAUHBk",1432777027430],["FTxqH0tukqQ",1432777413227],["V-xpJRwIA-Q",1432777570350],["-25ibpmTMWM",1432777809805],["3eOuK-pYhy4",1432777970651],["Nt4SNfcd72s",1432778223772],["a3ir9HC9vYg",1432779175045],["DIfPeoyLfkg",1432779456198],["6259846",1432779673921],["W6H8WcTPnWM",1432779911329],["14kLQ9TLZcI",1432780104437],["4NO-h9PFum4",1432780242613],["EUSS7bEKxsQ",1432780447681],["GeZZr_p6vB8",1432783686698],["snILjFUkk_A",1432783938989],["zQ41hqlV0Kk",1432784206229],["nfk6sCzRTbM",1432784476197],["Yynstc_bFRE",1432784738407],["T81xsEyfl3c",1432784961056],["4kHl4FoK1Ys",1432787045163],["2tptckbCokA",1432787240920],["VtNH2ftJVS8",1432787451127],["DVgBVcsAK1o",1432787723164],["jJaT7qQpaqs",1432788650757],["W9wwsxiLGbg",1432788656349],["_j5HZjg75AM",1432789182868]],"cycleTimer":479,"roomstats":{"accountName":null,"totalWoots":24,"totalCurates":6,"totalMehs":0,"tastyCount":0,"launchTime":1432771419768,"songCount":100,"chatmessages":196},"messages":{"from":[],"to":[],"message":[]},"queue":{"id":[],"position":[]},"newBlacklist":[],"newBlacklistIDs":[],"blacklistLoaded":true,"roulette":{"rouletteStatus":false,"randomRouletteMin":45,"randomRouletteMax":120,"nextRandomRoulette":"2015-05-28T08:00:29.861Z","participants":[],"countdown":null}}"
      //
      var basicBotStorageInfo = {
        time: Date.now(),
        stored: true,
        version: MyVARS.version
      };
      //MyUTIL.logDebug("DONE: storeToStorage - UserCnt: " + MyROOM.users.length + " TIME: " + basicBotStorageInfo.time);
      localStorage.setItem("basicBotStorageInfo", JSON.stringify(basicBotStorageInfo));
    } catch (err) {
      MyUTIL.logException("storeToStorage: " + err.message);
    }
  },
  retrieveFromStorage: function() {
    try {
      var info = localStorage.getItem("basicBotStorageInfo");
      if (info === null) MyUTIL.logChat(CHAT.chatMapping.nodatafound);
      else {
        var stored_settings = JSON.parse(localStorage.getItem("basicBotsettings"));
        if (SLOTS.Players.length === 0) {
		  SLOTS.Players = JSON.parse(localStorage.getItem("basicBotSlots"));
		}
        var room = JSON.parse(localStorage.getItem("basicBotRoom"));
        MyUTIL.logDebug("room.users.length: " + room.users.length);
        if (localStorage.getItem("BLACKLIST") !== null) {
          var myBLList = localStorage["BLACKLIST"];
          var myBLIDs = localStorage["BLACKLISTIDS"];
          MyUTIL.logInfo(JSON.parse(localStorage["BLACKLIST"]));
          MyUTIL.logInfo(JSON.parse(localStorage["BLACKLISTIDS"]));
          MyUTIL.logInfo("LEN (" + myBLList.length + ") " + myBLList);
          MyUTIL.logInfo("LEN (" + myBLIDs.length + ") " + myBLIDs);

          MyROOM.newBlacklist = JSON.parse(localStorage["BLACKLIST"]);
          MyROOM.newBlacklistIDs = JSON.parse(localStorage["BLACKLISTIDS"]);

          MyUTIL.logDebug("BL LOAD:   BL Count: " + MyROOM.newBlacklist.length);
          MyUTIL.logDebug("BL LOAD: BLID Count: " + MyROOM.newBlacklistIDs.length);
        }
        MyROOM.blacklistLoaded = true;
        MyUTIL.logDebug("BL LOADED: TRUE");
        var elapsed = Date.now() - JSON.parse(info).time;
        MyROOM.users = room.users;
        MyROOM.historyList = room.historyList;
        MyUTIL.logDebug("MyROOM.users.length: " + MyROOM.users.length + " TIME: " + JSON.parse(info).time);
        if ((elapsed < 10 * 60 * 1000)) {
          MyUTIL.logChat(CHAT.chatMapping.retrievingdata);
          for (var prop in stored_settings) {
            MyVARS[prop] = stored_settings[prop];
          }
          MyROOM.afkList = room.afkList;
          MyROOM.mutedUsers = room.mutedUsers;
          MyROOM.roomstats = room.roomstats;
          MyROOM.queue = room.queue;
          MyUTIL.logChat(CHAT.chatMapping.datarestored);
        }
      }
      var json_sett = null;
      var roominfo = document.getElementById("room-info");
	  if (roominfo === null) return;
      info = roominfo.textContent;
      var ref_bot = "@basicBot=";
      var ind_ref = info.indexOf(ref_bot);
      if (ind_ref > 0) {
        var link = info.substring(ind_ref + ref_bot.length, info.length);
        var ind_space = null;
        if (link.indexOf(" ") < link.indexOf("\n")) ind_space = link.indexOf(" ");
        else ind_space = link.indexOf("\n");
        link = link.substring(0, ind_space);
        $.get(link, function(json) {
          if (json !== null && typeof json !== "undefined") {
            json_sett = JSON.parse(json);
            json_sett = JSON.parse(json);
            for (var prop in json_sett) {
              MyVARS[prop] = json_sett[prop];
            }
          }
        });
      }
    } 
	catch (err) { MyUTIL.logException("retrieveFromStorage: " + err.message); }
  },
  retrieveSettings: function() {
    var stored_settings = JSON.parse(localStorage.getItem("basicBotsettings"));
    if (stored_settings !== null) {
      for (var prop in stored_settings) {
        MyVARS[prop] = stored_settings[prop];
      }
    }
  },
};

//SECTION STARTUP: Init code:
var STARTUP = {
  initbot: function() {
      try{
        if (window.APIisRunning) return;
		if (MyROOM.users.length > 0) return;  // Prevent loading twice
        window.APIisRunning = true;
	    BotEVENTS.connectAPI();
        CHAT.loadChat();
		STARTUP.monitorPageChange();
		setTimeout( function() {
		  STORAGE.retrieveSettings();
		  STORAGE.retrieveFromStorage();
		  }, 2000); 
        MyROOM.afkInterval = setInterval(function() {AFK.afkCheck()}, 10 * 1000);
		setInterval(function() {AFK.checkBotDj()}, 10 * 1000);
		MyUTIL.randomCommentSetTimer();												//Enable random comment timer
		setInterval(function() { MyUTIL.botKeepAlive(); }, 1000 * 60 * 60);			//Timer fires every 60 mins to keep bot alive
		setInterval(function() { MyUTIL.botKeepAlive2(); }, 1000 * 60);				//Timer fires every 1 mins to monitor bot alive status
		MyVARS.botStarted = Date.now(); // dateadd getdate
		//Try1: window.onbeforeunload
		//setTimeout(function () { MyUTIL.sendChat("Larry the Bot V1.0 online"); }, 3000); 
      }
	  catch (err) { MyUTIL.logException("STARTUP.initbot: " + err.message); }
  },
  monitorPageChange: function() {
    try{
	  // Log the state data to the console
	  window.addEventListener('popstate', function (event) { MyUTIL.logInfo('POP STATE: ' + event.state);	});

	// Try3:
	  window.addEventListener('beforeunload', (event) => {
		  // Cancel the event as stated by the standard.
		  event.preventDefault();
		  // Chrome requires returnValue to be set.
		  event.returnValue = '';});
	
	//Try2:
	/*
	(function () {
    var location = window.document.location;

    var preventNavigation = function () {
        var originalHashValue = location.hash;

        window.setTimeout(function () {
            location.hash = 'preventNavigation' + ~~ (9999 * Math.random());
            location.hash = originalHashValue;
        }, 0);
    };

    window.addEventListener('beforeunload', preventNavigation, false);
    window.addEventListener('unload', preventNavigation, false);
})();
*/
	// Try2*/
    }
    catch (err) { MyUTIL.logException("STARTUP.monitorPageChange: " + err.message); }
  },
};

//Try1: window.onbeforeunload = function() {
//Try1:     MyUTIL.logInfo("Request to leave page: " + MyUTIL.formatDate(Date.now()));
//Try1: 	return "";
//Try1: };

if (!window.APIisRunning) {
  STARTUP.initbot();
} else {
  setTimeout(function() {STARTUP.initbot();}, 1000);
};
