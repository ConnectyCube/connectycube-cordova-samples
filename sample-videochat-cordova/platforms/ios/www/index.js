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
  }

  loadScript("main.js");
};

document.addEventListener("deviceready", onDeviceReady, false);
