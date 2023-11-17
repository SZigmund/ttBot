(function () {
  if (!window.turntable) return alert("Not Loaded, Try Again.");
  else console.log("Auto-Skip Initiated.");

  const checkSong = function (event) {
    let src = window.youtube?.player?.[0];
    if (!src) return console.log("Auto-Skip: Not Youtube.");

    let can = src.getPlayerState();
    if (can == "-1") return setTimeout(skip, 1000);
  };

  const skip = function () {
    console.log("Auto-Skip: Skipping...");
    let view = window.turntable.topViewController.roomView;
    let data = {
      api: "room.stop_song", 
      roomid: view.room.roomId,
      djid: view.currentDj.userId, 
      songid: window.turntable.current_songid
    };
    window.turntable.sendMessage(data)
  };

  window.turntable.addEventListener("message", event => {
    if (!event.command || event.command != "newsong") return;
    return setTimeout(checkSong, 1000);
  });
})()
