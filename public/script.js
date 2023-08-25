const socket = io('/');
const videoGrid = document.getElementById('video-grid');
const myPeer = new Peer(undefined, {
  host: '/',
  port: '3001'
});

let myVideoStream;
const myVideo = document.createElement('video')
myVideo.muted = true

const peers = {}

navigator.mediaDevices.getUserMedia({
  video: true,
  audio: true
}).then(stream => {
    myVideoStream = stream;
  addVideoStream(myVideo, stream)

  myPeer.on('call', call => {
    call.answer(stream);
    const video = document.createElement('video')
    call.on('stream', userVideoStream => {
      addVideoStream(myVideo, userVideoStream);
    });
  });
  socket.emit("ready")
  socket.on('user-connected', userId => {
    connectToNewUser(userId, stream)
  });
});

socket.on('user-disconnected', userId => {
  if (peers[userId]) peers[userId].close();
})

myPeer.on('open', id => {
  socket.emit('join-room', ROOM_ID, id);
});

function connectToNewUser(userId, stream) {
  const call = myPeer.call(userId, stream);
  const video = document.createElement('video');
  call.on('stream', userVideoStream => {
    addVideoStream(video, userVideoStream);
  });
  call.on('close', () => {
    video.remove();
  });

  peers[userId] = call;
}

function addVideoStream(video, stream) {
  video.srcObject = stream;
  video.addEventListener('loadedmetadata', () => {
    video.play();
  });
  videoGrid.append(video);
}

let text = $('input')
console.log('text');

$('html').keydown((e) =>{
    if(e.which==13 && text.val().length!==0) {
        $('ul').append(`<li class="user"><div class="over"></div><b>You</b><br/>${text.val()}</div></li>`);
        socket.emit('message', text.val(), user);
        text.val('');
    }
});

socket.on('createMessage', (message, fuser) => {
    $('ul').append(`<li class="other"><b>${fuser.name}</b><br/>${message}</li>`);
    scrollToBottom();
})

const scrollToBottom = () => {
    var d=$('main__chat_window');
    d.scrollTop(d.prop("scrollHeight"));
}


const muteUnmute = () => {
    const enabled = myVideoStream.getAudioTracks()[0].enabled;
    if (enabled) {
      myVideoStream.getAudioTracks()[0].enabled = false;
      setUnmuteButton();
    } else {
      setMuteButton();
      myVideoStream.getAudioTracks()[0].enabled = true;
    }
  }

const setMuteButton = () => {
    const html = `<i class="fas fa-microphone"></i>`
    document.querySelector('.main__mute_button').innerHTML = html;
  }
  
const setUnmuteButton = () => {
    const html = `<i class="unmute fas fa-microphone-slash"></i>`
    document.querySelector('.main__mute_button').innerHTML = html;
  }
  

const playStop = () => {
    console.log('object')
    let enabled = myVideoStream.getVideoTracks()[0].enabled;
    if (enabled) {
      myVideoStream.getVideoTracks()[0].enabled = false;
      setPlayVideo()
    } else {
      setStopVideo()
      myVideoStream.getVideoTracks()[0].enabled = true;
    }
  }

const setStopVideo = () => {
    const html = `<i class="fas fa-video"></i>`
    document.querySelector('.main__video_button').innerHTML = html;
}

const setPlayVideo = () => {
    const html = `<i class="stop fas fa-video-slash"></i>`
    document.querySelector('.main__video_button').innerHTML = html;
}

