var MyAPI = {
  CurrentDJName: function() {
	try {
	  if (!turntable.buddyList.room.currentSong) return "";
	  return turntable.buddyList.room.currentSong.djname.toString();  }
	catch (err) { console.log("ERROR: MyAPI.CurrentDJName: " + err.message); }
  },
  CurrentUserName: function() {
	try			{return turntable.user.attributes.name.toString(); }
	catch (err) { console.log("ERROR: MyAPI.CurrentUserName: " + err.message); }
  },
  MonitorMessages: function() {
	try {
      turntable.socket.addEventListener('message', messageString => {
		const message = JSON.parse(messageString);
		if (message.command === 'newsong') MyAPI.WootThisSong();    })
	}
	catch (err) { console.log("ERROR: MyAPI.MonitorMessages: " + err.message); }
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
	catch (err) { console.log("ERROR: MyAPI.VoteForSong: " + err.message); }
  },
  WootThisSong: function() {
    try	{
	  if (MyAPI.CurrentDJName() === MyAPI.CurrentUserName()) return;
	  MyAPI.VoteForSong("up");
	} 
	catch (err) { console.log("ERROR: MyAPI.WootThisSong: " + err.message); }
  },
};

//SECTION STARTUP: Init code:
var STARTUP = {
	initbot: function() {
      try{
        if (window.APIisRunning) return;
        window.APIisRunning = true;
	    MyAPI.MonitorMessages();
      }
	  catch (err) { console.log("ERROR: STARTUP.initbot: " + err.message); }
	}
};

if (!window.APIisRunning) { STARTUP.initbot(); } 
else { setTimeout(function() {STARTUP.initbot();}, 1000); };
