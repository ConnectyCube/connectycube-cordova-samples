const loadScript = path => {
  let $script = document.createElement("script");

  $script.type = "text/javascript";
  $script.async = false;
  $script.src = path;
  document.body.appendChild($script);
};

const onDeviceReady = () => {
  if (window.device.platform === "Android") {
    const { permissions } = cordova.plugins;

    permissions.requestPermissions([permissions.CAMERA, permissions.RECORD_AUDIO, permissions.MODIFY_AUDIO_SETTINGS]);
  }

  if (window.device.platform === "iOS") {
    const { iosrtc } = cordova.plugins;

    // Connect 'iosrtc' plugin, only for iOS devices
    iosrtc.registerGlobals();
    // Use speaker audio output
    iosrtc.selectAudioOutput("speaker");
    // Request audio and/or camera permission if not requested yet
    iosrtc.requestPermission(true, true, function(permissionApproved) {
      console.log("requestPermission status: ", permissionApproved ? "Approved" : "Rejected");
    });
    // Refresh video element
    window.addEventListener("orientationchange", () => iosrtc.refreshVideos());
    window.addEventListener("scroll", () => iosrtc.refreshVideos());

    // applyShimOnTrack();
  }

  loadScript("main.js");
};

// // more info re why we need this
// // https://github.com/cordova-rtc/cordova-plugin-iosrtc/issues/505
// const applyShimOnTrack = () => {
//   console.log("applyShimOnTrack");
//
//   Object.defineProperty(window.RTCPeerConnection.prototype, 'ontrack', {
//     get: function get() {
//       return this._ontrack;
//     },
//     set: function set(f) {
//       if (this._ontrack) {
//         this.removeEventListener('track', this._ontrack);
//       }
//       this.addEventListener('track', this._ontrack = f);
//     },
//
//     enumerable: true,
//     configurable: true
//   });
//   var origSetRemoteDescription = window.RTCPeerConnection.prototype.setRemoteDescription;
//   window.RTCPeerConnection.prototype.setRemoteDescription = function setRemoteDescription() {
//     var _this = this;
//
//     if (!this._ontrackpoly) {
//       this._ontrackpoly = function (e) {
//         // onaddstream does not fire when a track is added to an existing
//         // stream. But stream.onaddtrack is implemented so we use that.
//         e.stream.addEventListener('addtrack', function (te) {
//           var receiver = void 0;
//           if (window.RTCPeerConnection.prototype.getReceivers) {
//             receiver = _this.getReceivers().find(function (r) {
//               return r.track && r.track.id === te.track.id;
//             });
//           } else {
//             receiver = { track: te.track };
//           }
//
//           var event = new Event('track');
//           event.track = te.track;
//           event.receiver = receiver;
//           event.transceiver = { receiver: receiver };
//           event.streams = [e.stream];
//           _this.dispatchEvent(event);
//         });
//         e.stream.getTracks().forEach(function (track) {
//           var receiver = void 0;
//           if (window.RTCPeerConnection.prototype.getReceivers) {
//             receiver = _this.getReceivers().find(function (r) {
//               return r.track && r.track.id === track.id;
//             });
//           } else {
//             receiver = { track: track };
//           }
//           var event = new Event('track');
//           event.track = track;
//           event.receiver = receiver;
//           event.transceiver = { receiver: receiver };
//           event.streams = [e.stream];
//           _this.dispatchEvent(event);
//         });
//       };
//       this.addEventListener('addstream', this._ontrackpoly);
//     }
//     return origSetRemoteDescription.apply(this, arguments);
//   };
// }

document.addEventListener("deviceready", onDeviceReady, false);
