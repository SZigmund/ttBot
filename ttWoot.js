// 1. TTBOT: Prevent rolling more than once every 120 seconds (Slot Hackers!!)
// 2. REPEAT SONGS HIGHLIGHT
// 3. Snag to...Playlist
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

//SECTION SETTINGS: All local settings: 
var MyVars = {
	volume: 0,
	workMode: false,
	autoWootEnabled: false,
	nextSong: null,					// My next song
	songWarned: null,				// Last song Artist/Title warned for duplicate.
	songRolled: null,				// Last song Artist/Title roll button was used on.
	enableSongInHistCheck: true,
	songAlerts: false,
	soundDing: "https://www.myinstants.com/media/sounds/ding-sound-effect_2.mp3",
	soundSadT: "https://orangefreesounds.com/wp-content/uploads/2014/08/Price-is-right-losing-horn.mp3",
	botID: "604bb64b47b5e3001a8fd194",
	DeezRoomID: "6040fa783f4bfc001b27d316",
	LarryRoomID: "60550d9447b5e3001bd53bf1"
};

//SECTION UTIL: Core functionality: MyUTIL.
var MyUTIL = {
  AlertDJ: function() {
    try			{	
	  // If I'm up alert:
	  if (!MyVars.songAlerts) return;
	  if (MyAPI.CurrentDJName() != MyAPI.CurrentUserName()) return;
	  if (MyVars.songRolled == MyAPI.CurrentSongArtist() + MyAPI.CurrentSongTitle()) return;
      setTimeout(function() { MyUTIL.PlaySound(MyVars.soundDing); }, 3000);
    }
	catch (err) {	MyUTIL.logException("MyUTIL.AlertDJ: " + err.message); }
  },
  AutoWootSong: function() {
    try			{	
	  // Woot if not my song:
	  if (MyAPI.CurrentDJName() == MyAPI.CurrentUserName()) return;
	  if (!MyVars.autoWootEnabled) return;
	  setTimeout(function() { MyAPI.VoteForSong("up"); }, 5000);
    }
	catch (err) {	MyUTIL.logException("MyUTIL.AutoWootSong: " + err.message); }
  },
  CheckRepeatSong: function(myNextSong) {
    try			
	{
	  warn = false;
	  if (myNextSong == null) return;
	  if (MyVars.songWarned == (myNextSong.author + myNextSong.title)) return;  // already warned them about this song
	  MyVars.songWarned = null;  // Reset as My next song must have changed.
	  // Check the song currently playing:
	  if ((myNextSong.author + myNextSong.title) == (MyAPI.CurrentSongArtist() + MyAPI.CurrentSongTitle())) warn = true;
	  // Check the song agaist history:
	  if (MyVars.nextSong != myNextSong) {
		MyVars.nextSong = myNextSong;
		if (MyAPI.checkSongInHistory(myNextSong, false) == true) warn = true;
	  }
	  if (!warn) return;
	  MyVars.songWarned = (myNextSong.author + myNextSong.title);
	  MyUTIL.PlaySound(((MyAPI.CurrentUserName() == 'DocZ') ? MyVars.soundDing : MyVars.soundDing));  //MyVars.soundSadT
	}
    catch (err) {	MyUTIL.logException("MyUTIL.CheckRepeatSong: " + err.message); }
  },
  logException: function(eventMessage) {
    try			{	console.log("ERROR: " + eventMessage);	}
    catch (err) {	console.log("MyUTIL.logException: " + err.message); }
  },
  PlaySound: function(soundURL) {
	try {
			var audio = new Audio(soundURL);
			audio.volume = 0.15;
			audio.play();
	}
	catch (err) { MyUTIL.logException("ERROR: MyUTIL.PlaySound: " + err.message); }
  },
  RollDice: function(buttonPress) {
	try {
		if (buttonPress) MyAPI.SendPM('roll', MyVars.botID);
		MyVars.songRolled = MyAPI.CurrentSongArtist() + MyAPI.CurrentSongTitle();
		MyUTIL.ShowHideRoll();
	}
	catch (err) { MyUTIL.logException("ERROR: MyUTIL.RollDice: " + err.message); }
  },
  SettingsLoad: function(soundURL) {
	try 
	{
		var info = JSON.parse(localStorage.getItem("zWootOptions"));
		if (info == null) return; //this will be
		MyVars.workMode = info.workMode;
		MyVars.autoWootEnabled = info.autoWootEnabled;
		MyVars.nextSong = info.nextSong;
		MyVars.songWarned = info.songWarned;
		MyVars.songRolled = info.songRolled;
		MyVars.enableSongInHistCheck = info.enableSongInHistCheck;
		MyVars.songAlerts = info.songAlerts;

	}
	catch (err) { MyUTIL.logException("ERROR: MyUTIL.SettingsLoad: " + err.message); }
  },
  SettingsSave: function(soundURL) {
	try { localStorage.setItem("zWootOptions", JSON.stringify(MyVars));
	//console.log("SAVE: AUTOWOOT: " + MyVars.autoWootEnabled + " WORKMODE: " + MyVars.workMode);
	}
	catch (err) { MyUTIL.logException("MyUTIL.SettingsSave: " + err.message); }
  },
  ShowHideRoll: function(soundURL) {
	try {
	  if (document.getElementById("zRollButton") == null) return;
	  if (MyVars.songRolled == (MyAPI.CurrentSongArtist() + MyAPI.CurrentSongTitle())) {
		document.getElementById("zRollButton").hidden = true;
	  }
	  else {
	    document.getElementById("zRollButton").hidden = ((MyAPI.CurrentDJID() == MyAPI.CurrentUserID()) ? false : true);
	  }
	}
	catch (err) { MyUTIL.logException("MyUTIL.ShowHideRoll: " + err.message); }
  },

};

//SECTION CHAT:
var CHAT = {
  commandChat: {
    cid: "",
    message: "",
    sub: -1,
    un: "",
    uid: -1,
    type: "message",
    timestamp: null,
    sound: "mention"
  }
};

//SECTION API.: Site specific U/I code: MyAPI. ALL Platform dependant U/I code goes
var MyAPIUI = {
  CreateUI: function(soundURL) {
	try { 
	    document.querySelector(".header-social").hidden = true; // Hide the social media buttons so they don't overlap our U/I
		MyAPIUI.AddButtonDiv();
		MyAPIUI.AddHopUpButton();
	    MyAPIUI.AddHopDownButton();
	    MyAPIUI.AddWorkLi();
		MyAPIUI.AddSkipButton();
		MyAPIUI.AddSnagButton();
		MyAPIUI.AddSnoozeButton();
		if (MyAPI.CurrentUserName() == 'DocZ') MyAPIUI.AddYTButton();
		MyAPIUI.AddAutoWootOption();
		if (MyAPI.CurrentRoomID() == MyVars.DeezRoomID) MyAPIUI.AddSlotButton();
		if (MyAPI.CurrentRoomID() == MyVars.LarryRoomID) MyAPIUI.AddSlotButton();
		if (MyAPI.CurrentRoomID() == MyVars.DeezRoomID) MyAPIUI.AddRollButton();
		if (MyAPI.CurrentRoomID() == MyVars.LarryRoomID) MyAPIUI.AddRollButton();
	    MyAPIUI.AddSongDiv();
		MyAPIUI.WatchPlaylist();
		MyAPIUI.WatchQueue();
		MyAPIUI.WatchTime();
		MyAPIUI.WorkPlayShow(!MyVars.workMode);
		MyUTIL.ShowHideRoll();
	}
	catch (err) { MyUTIL.logException("MyAPIUI.CreateUI: " + err.message); }
  },
  createTable: function(tableData) {
	try { 
		var table = document.createElement('table');
		var tableBody = document.createElement('tbody');
		tableData.forEach(function(rowData) {
			var row = document.createElement('tr');
			rowData.forEach(function(cellData) {
				var cell = document.createElement('td');
				cell.appendChild(document.createTextNode(cellData));
				row.appendChild(cell);
			});
			tableBody.appendChild(row);
		});
		table.appendChild(tableBody);
		return table;
	}
	catch (err) { MyUTIL.logException("MyAPIUI.createTable: " + err.message); }
  },
  AddAutoWootOption: function(){
	try {
		var option = document.createElement("INPUT");
		option.setAttribute("type", "checkbox");
		option.setAttribute("id", "zAutoWootOption");
		option.checked = MyVars.autoWootEnabled;
		option.addEventListener( 'click', function ( event ) { MyAPIUI.UIUpdated(); }, false );

		var label = document.createElement('label')
		label.htmlFor = 'Auto Woot';
		label.appendChild(document.createTextNode('Auto Woot'));
		
		document.querySelector("#footer").appendChild(option);
		document.querySelector("#footer").appendChild(label);
	}
	catch (err) { MyUTIL.logException("MyAPIUI.AddAutoWootOption: " + err.message); }
  },

  AddHopDownButton: function(){
	try {
		var button = document.createElement('div');
		var img = document.createElement('img');
		img.src = 'https://i.imgur.com/Ap7Vn61.gif';
        //document.getElementById('zMyDiv').appendChild(img);
		button.setAttribute('id','zHopDownButton');
		document.querySelector(".header-buttons").appendChild(button);
		document.getElementById("zHopDownButton").appendChild(img);
		button.addEventListener( 'click', function ( event ) { MyAPI.HopDown(); }, false ); // add button click event
	}
	catch (err) { MyUTIL.logException("MyAPIUI.AddHopDownButton: " + err.message); }
  },

  AddHopUpButton: function(){
	try {
		var span = document.createElement('span');
		span.tooltiptext = "hover text";
		var button = document.createElement('div');
		var img = document.createElement('img');
		img.src = 'https://i.imgur.com/TsLOK3e.gif';
        //document.getElementById('zMyDiv').appendChild(img);
		button.setAttribute('id','zHopUpButton');
		document.querySelector(".header-buttons").appendChild(button);
		document.getElementById("zHopUpButton").appendChild(img);
		button.addEventListener( 'click', function ( event ) { MyAPI.HopUp(); }, false );
	}
	catch (err) { MyUTIL.logException("MyAPIUI.AddHopUpButton: " + err.message); }
  },
  
  AddButtonDiv: function(){
	try {
		var div = document.createElement('div');
		div.setAttribute('id', 'zMyDiv');
		div.style.fontSize = 'medium'
		document.querySelector(".header-room-name").appendChild(div);
	}
	catch (err) { MyUTIL.logException("MyAPIUI.AddButtonDiv: " + err.message); }
  },
  AddSongDiv: function(){
	try {
		var div = document.createElement('div');
		div.setAttribute('id', 'zMySongDiv');
		document.querySelector(".header-room-name").appendChild(div);
	}
	catch (err) { MyUTIL.logException("MyAPIUI.AddSongDiv: " + err.message); }
  },
  AddRollButton: function(){
	try {
		var button = document.createElement('div');
		var img = document.createElement('img');
		img.src = 'https://i.imgur.com/WiQIrl7.gif';
        //document.getElementById('zMyDiv').appendChild(img);
		button.setAttribute('id','zRollButton');
		document.querySelector(".header-buttons").appendChild(button);
		document.getElementById("zRollButton").appendChild(img);
		button.addEventListener( 'click', function ( event ) { MyUTIL.RollDice(true); }, false );
	}
	catch (err) { MyUTIL.logException("MyAPIUI.AddRollButton: " + err.message); }
  },
  AddSlotButton: function(){
	try {
		var button = document.createElement('div');
		var img = document.createElement('img');
		img.src = 'https://i.imgur.com/pPRG3w5.gif'; // 'https://i.imgur.com/ZbQUMov.gif'; // 'https://i.imgur.com/ZbQUMov.png'; // 'https://i.imgur.com/MJCZorE.png';
        //document.getElementById('zMyDiv').appendChild(img);
		button.setAttribute('id','zSlotButton');
		document.querySelector(".header-buttons").appendChild(button);
		document.getElementById("zSlotButton").appendChild(img);
		button.addEventListener( 'click', function ( event ) { MyAPI.SendPM('slot 1000', MyVars.botID); }, false );
	}
	catch (err) { MyUTIL.logException("MyAPIUI.AddSlotButton: " + err.message); }
  },
  AddSkipButton: function(){
	try {
		var button = document.createElement('div');
		var img = document.createElement('img');
		img.src = 'https://i.imgur.com/DRr9GWz.gif';
        //document.getElementById('zMyDiv').appendChild(img);
		button.setAttribute('id','zSkipButton');
		document.querySelector(".header-buttons").appendChild(button);
		document.getElementById("zSkipButton").appendChild(img);
		button.addEventListener( 'click', function ( event ) { MyAPI.SkipSong(); }, false );
	}
	catch (err) { MyUTIL.logException("MyAPIUI.AddSkipButton: " + err.message); }
  },
  AddSnagButton: function(){
	try {
		var button = document.createElement('div');
		var img = document.createElement('img');
		img.src = 'https://i.imgur.com/9GGZguE.gif';
        //document.getElementById('zMyDiv').appendChild(img);
		button.setAttribute('id','zSnagButton');
		document.querySelector(".header-buttons").appendChild(button);
		document.getElementById("zSnagButton").appendChild(img);
		button.addEventListener( 'click', function ( event ) { MyAPI.SnagSong(); }, false );
	}
	catch (err) { MyUTIL.logException("MyAPIUI.AddSnagButton: " + err.message); }
  },
  AddSnoozeButton: function(){
	try {
		var button = document.createElement('div');
		var img = document.createElement('img');
		img.src = 'https://i.imgur.com/R1qVbGX.gif';
        //document.getElementById('zMyDiv').appendChild(img);
		button.setAttribute('id','zSnoozeButton');
		document.querySelector(".header-buttons").appendChild(button);
		document.getElementById("zSnoozeButton").appendChild(img);
		button.addEventListener( 'click', function ( event ) { MyAPI.SnoozeSong(true); }, false );
	}
	catch (err) { MyUTIL.logException("MyAPIUI.AddSnoozeButton: " + err.message); }
  },
  AddWorkLi: function(){
	try {
		var newbutton = document.querySelector(".dropdown").firstChild.nextSibling.firstChild.nextSibling.nextSibling.cloneNode(true);
		newbutton.addEventListener( 'click', function ( event ) { MyAPIUI.WorkPlay(); }, false );
		var menuOptions = document.querySelector(".dropdown").firstChild.nextSibling;
		var sibling = menuOptions.firstChild.nextSibling.nextSibling;
		menuOptions.insertBefore(newbutton, sibling);
		newbutton.innerText = "   Work/Play";
	}
	catch (err) { MyUTIL.logException("MyAPIUI.AddWorkLi: " + err.message); }
  },
  AddYTButton: function(){
	try {
		var button = document.createElement('BUTTON');
		var text = document.createTextNode("YouTube");
		button.appendChild(text);
		button.setAttribute('id','zYTButton');
		document.getElementById("zMyDiv").appendChild(button);
		button.addEventListener( 'click', function ( event ) { MyAPI.YouTubeLink(); }, false );
	}
	catch (err) { MyUTIL.logException("MyAPIUI.AddYTButton: " + err.message); }
  },
  DisplayDJQueue: function(songPlaying) {
	try	{ 
		var mySong = MyAPI.MyNextSong();
	    MyUTIL.CheckRepeatSong(mySong);
		setTimeout(function() { MyUTIL.ShowHideRoll(); }, 500);
		if (!MyVars.workMode) return;  // No need to load the table if we are not in work mode.

		if (document.getElementById("zDJtable") !== null) document.getElementById("zDJtable").remove(0);
		var djs = [];
		var djID = MyAPI.CurrentDJID();
		var djList = MyAPI.getDjList(false);
		for(var x = 0; x < djList.length; x++)
		{
			djs[x] = [];
			djs[x][0] = ((djList[x].id == djID) ? "💿 " : "") + djList[x].username;
			if (djList[x].id == djID)
			  djs[x][1] =  "   " + MyAPI.CurrentSongArtist() + ": " + MyAPI.CurrentSongTitle();
			else if (djList[x].username == MyAPI.CurrentUserName())
			  djs[x][1] =  "   " + mySong.author + ": " + mySong.title;
		}
		var table = MyAPIUI.createTable(djs);
		table.setAttribute('id',"zDJtable");
		table.style.fontSize = 'small';
		document.getElementById("zMySongDiv").appendChild(table);
	}
	catch (err) { MyUTIL.logException("MyAPIUI.DisplayDJQueue: " + err.message); }
  },
  WorkPlay: function() {
	try	{ MyAPIUI.WorkPlayShow((document.querySelector("#room-view").hidden == true)); 	}
	catch (err) { MyUTIL.logException("MyAPIUI.WorkPlay: " + err.message); }
  },
  WatchTime: function() {	//Watch for to another playlist:
	try	{ 
		// songboard-time
		//document.querySelector('#songboard-time');
		// document.querySelector("#room-view > div.room-renderer.mouse-map > div:nth-child(1) > div > div.songboard > div.song-details > div.songboard-time")
		//#room-view > div.room-renderer.mouse-map > div:nth-child(1) > div > div.songboard > div.song-details > div.songboard-time
		///html/body/div[1]/div[1]/div/div[1]/div/div[2]/div[1]/div/div[1]/div[1]
		
}
	catch (err) { MyUTIL.logException("MyAPIUI.WorkPlay: " + err.message); }
  },
  
  WatchPlaylist: function() {	//Watch for to another playlist:
	try	{ 
	  var target = document.querySelector('#queue-view');
	  //document.querySelector('#playlist-header'); //document.querySelector('#playlist-display'); 				// select the target node
	  var observer = new MutationObserver(function(mutations) {		// create an observer instance
		  setTimeout(function() { MyAPIUI.DisplayDJQueue(true); }, 250);
	  });
	  var config = { attributes: true, childList: true, characterData: true };  // configuration of the observer:
	  observer.observe(target, config);		// pass in the target node, as well as the observer options
	  //observer.disconnect();		// later, you can stop observing
	}
	catch (err) { MyUTIL.logException("MyAPIUI.WatchPlaylist: " + err.message); }
  },
  WatchQueue: function() {  //Watch for changing song order in current queue:
	try	{ 
	  var target = document.querySelector('#songs'); 				// select the target node
	  var observer = new MutationObserver(function(mutations) {		// create an observer instance
		  		  setTimeout(function() { MyAPIUI.DisplayDJQueue(true); }, 250);
	  });
	  var config = { attributes: true, childList: true, characterData: true };  // configuration of the observer:
	  observer.observe(target, config);		// pass in the target node, as well as the observer options
	  //observer.disconnect();		// later, you can stop observing
	}
	catch (err) { MyUTIL.logException("MyAPIUI.WatchPlaylist: " + err.message); }
  },
  WorkPlayShow: function(showRoom) {
	try	{ 
		document.querySelector("#room-view").hidden = (!showRoom);
		document.getElementById("zMySongDiv").hidden = (showRoom);
		document.getElementById("zHopDownButton").hidden = (showRoom);
		document.getElementById("zHopUpButton").hidden = (showRoom);
		document.getElementById("zSnagButton").hidden = (showRoom);
		if (document.getElementById("zYTButton") != null) document.getElementById("zYTButton").hidden = (showRoom);
		MyAPIUI.UIUpdated();
		setTimeout(function() { MyAPIUI.DisplayDJQueue(true); }, 250);
	}
	catch (err) { MyUTIL.logException("MyAPIUI.WorkPlayShow: " + err.message); }
  },
  UIUpdated: function() {
	try	{
		MyVars.autoWootEnabled = (document.getElementById("zAutoWootOption").checked == true);
		MyVars.workMode = (document.querySelector("#room-view").hidden == true);
		MyUTIL.SettingsSave();
	}
	catch (err) { MyUTIL.logException("MyAPIUI.UIUpdated: " + err.message); }
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
  //Convert API Song to Bot Song
  APISong2Bot:  function(song){
	try {
	  // turntable.buddyList.room.currentSong
	  var songFormat = 1;
	  if (song.source) { if (song.source === "sc") songFormat = 2;}
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
  //Convert API Song to Bot Song
  APISong2BotShort:  function(song){
	try {
	  var songFormat = 1;
	  //console.log("todoerer song: " + JSON.stringify(song) );
	  if (song.source !== undefined) { if (song.source === "sc") songFormat = 2;}
	  var track = {
	    author: song.metadata.artist,	//Band name
	    title: song.metadata.song,		//Song name
		duration: song.metadata.length,	//Song length in seconds
		format: songFormat,				//1=YT 2=SC
	    };
	  return track;
	}
	catch (err) { MyUTIL.logException("MyAPI.APISong2BotShort: " + err.message); }
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
  checkSongInHistory: function(song, checkMid) {
    try {
	  if (MyVars.enableSongInHistCheck === false) return false;
	  var matchCount = 0;
	  songs = MyAPI.getSongHistory();
	  songs.forEach(hist => {
		if (checkMid) { if (hist.mid === song.mid) matchCount++; }
	    if ((hist.author === song.author) && (hist.title === song.title)) matchCount++;  
		});
	  return ((matchCount === 0) ? false : true);
    }
	catch (err) { MyUTIL.logException("MyAPI.checkSongInHistory: " + err.message); }
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
  CurrentRoomID: function() {
	try			{return turntable.buddyList.room.roomId.toString();  }
	catch (err) { MyUTIL.logException("MyAPI.CurrentRoomID: " + err.message); }
  },
  CurrentSongArtist: function() {
	try {
	  if (!turntable.current_artist) return "";
	  return turntable.current_artist;  }
	catch (err) { MyUTIL.logException("MyAPI.CurrentSongArtist: " + err.message); }
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
  getChatRoomUser: function(uid) {  // This grabs the most recent user from the website
	try	{
	  return MyAPI.APIUser2Bot(turntable.buddyList.room.users[uid].attributes);
	}
	catch (err) { MyUTIL.logException("MyAPI.getChatRoomUser: " + err.message); }
  },
  getDjList: function(sort) {  //getDjList
	try	{
	  var djs = [];
	  turntable.buddyList.room.roomData.metadata.djs.forEach(uid => {
		  var user = MyAPI.getChatRoomUser(uid);
		  if (user !== false) djs.push(new USERS.User(user.id, user.username));
	  });
	  if (sort) return MyAPI.sortDjList(djs);
	  return djs;
	}
	catch (err) { MyUTIL.logException("MyAPI.getDjList: " + err.message); }
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
  sortDjList: function(djs) {
	try	{
		var idx = djs.findIndex(x => x.id == MyAPI.CurrentDJID());
		if (idx == 0) return djs;
		var sortdjs = djs.splice(0, idx);
		return djs.concat(sortdjs);
	}
	catch (err) { MyUTIL.logException("MyAPI.sortDjList: " + err.message); }
  },
  HopDown: function() {
	try	{
	  turntable.sendMessage({ api: "room.rem_dj", roomid: turntable.buddyList.room.roomId, section: turntable.buddyList.room.section });
    }
	catch (err) { MyUTIL.logException("MyAPI.HopDown: " + err.message); }
  },
  HopUp: function() {
	try	{
	  turntable.sendMessage({ api: "room.add_dj", roomid: turntable.buddyList.room.roomId, section: turntable.buddyList.room.section
	  });
    }
	catch (err) { MyUTIL.logException("MyAPI.HopUp: " + err.message); }
  },
  MonitorMessages: function() {
	try {
      turntable.socket.addEventListener('message', messageString => {
			const message = JSON.parse(messageString);
			if (message.command === 'nosong') { MyEvents.EventNewSong(false); }
			if (message.command === 'newsong') { MyEvents.EventNewSong(true); }
			if (message.command === 'speak')   { MyEvents.EventChat(MyAPI.APIChat2BotChat(message, "chat")); }
			if (message.command === 'add_dj')   { setTimeout(function() { MyAPIUI.DisplayDJQueue(true); }, 250); }
			if (message.command === 'rem_dj')   { setTimeout(function() { MyAPIUI.DisplayDJQueue(true); }, 250); }
			});
      turntable.socket.addEventListener('userinfo', messageString => {
			const message = JSON.parse(messageString);
			console.log("USERINFO: ", message);
			});
	}
	catch (err) { MyUTIL.logException("MyAPI.MonitorMessages: " + err.message); }
  },
  MyNextSong: function() {
	try	{ return MyAPI.APISong2BotShort(turntable.playlist.songsByFid[turntable.playlist.fileids[0]]);	}
	catch (err) { MyUTIL.logException("MyAPI.MyNextSong: " + err.message); }
  },
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
  SnagSong: function(uid) {
	try	{
		document.querySelector('.service-btn.queue').click();
	}
	catch (err) { MyUTIL.logException("MyAPI.SnagSong: " + err.message); }
  },
  SnoozeSong: function(buttonPress) {
	try	{
		// Either they clicked the button a second time or New Song event fired:
		if (MyVars.volume > 0) {  // Restore the volume:
			turntablePlayer.setVolume(MyVars.volume);
			MyVars.volume = 0;
		}
		else if (buttonPress == true) {
			MyVars.volume = turntablePlayer.volume;
			turntablePlayer.setVolume(0);
		}
	}
	catch (err) { MyUTIL.logException("MyAPI.SnoozeSong: " + err.message); }
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
		turntable.sendMessage({api: "room.vote", roomid: t, section: i, val: e, vh: r, th: a, ph: l });
    } 
	catch (err) { MyUTIL.logException("MyAPI.VoteForSong: " + err.message); }
  },
  YouTubeLink: function(uid) {
	try	{
		document.querySelector('.service-btn.youtube').click();
	}
	catch (err) { MyUTIL.logException("MyAPI.YouTubeLink: " + err.message); }
  }
};

//SECTION Events.: Site specific eventcode: ALL Platform dependant event code goes
var MyEvents = {
  EventChat: function(chat) {
	if (chat.uid != MyVars.botID) return; //Currently the only chat we listen to is from the bot:
	if (chat.message.indexOf("@" + MyAPI.CurrentUserName() + " you have 45 seconds to hop up") > -1)
	  MyAPI.HopUp();
	if (chat.message.indexOf("@" + MyAPI.CurrentUserName() + " you rolled a") > -1)
	  MyUTIL.RollDice(false);
  },
  EventNewSong: function(songPlaying) {
    try	{
		if (songPlaying) MyUTIL.AutoWootSong();
		if (songPlaying) setTimeout(function() { MyUTIL.AlertDJ(); }, 30000);
		MyAPI.SnoozeSong(false);  // Restore value if we snoozed
		setTimeout(function() { MyAPIUI.DisplayDJQueue(songPlaying); }, 2000);
	} 
	catch (err) { MyUTIL.logException("MyEvents.EventNewSong: " + err.message); }
  },
};

//SECTION STARTUP: Init code:
var STARTUP = {
	initbot: function() {
      try{
        if (window.APIisRunning) return;
        window.APIisRunning = true;
	    MyAPI.MonitorMessages();
		MyUTIL.SettingsLoad();
		MyAPIUI.CreateUI();
		setTimeout(function() { MyAPIUI.DisplayDJQueue(true); }, 2000);
      }
	  catch (err) { MyUTIL.logException("STARTUP.initbot: " + err.message); }
	}
};

if (!window.APIisRunning) { STARTUP.initbot(); } 
else { setTimeout(function() {STARTUP.initbot();}, 1000); };
