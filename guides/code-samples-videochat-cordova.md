# Cordova Video Chat code sample - How To guide

Here we explain how to run origin [VideoChat code sample for browser](/js/code-samples#p2p-video-chat-code-sample) on [Cordova/PhoneGap environment](https://cordova.apache.org/#getstarted)

> Complete Video Chat API integration guide for Web/Javascript and Hybrid apps is [here](/js/videocalling)

## Integration details

1. Make sure you have the latest Cordova installed:

  ```bash
  cordova --version
  ```

  The output will be something like this:

  ```bash
  9.0.0
  ```

  If Cordova is not installed - run the following command:

  ```bash
  npm install -g cordova
  ```

2. Create Cordova app:

  ```bash
  cordova create sample-videochat-cordova com.sample.videochat SampleVideoChatCordova
  ```

  You can use the [Create your first Cordova app](https://cordova.apache.org/docs/en/latest/guide/cli/) guide to get more info how to create your 1st Cordova app.

3. Change directory to newly created Cordova app:

  ```bash
  cd sample-videochat-cordova
  ```

4. Add platforms:

  ```bash
  cordova platform add ios --save && cordova platform add android --save
  ```

5. Install [cordova-plugin-device plugin](https://www.npmjs.com/package/cordova-plugin-device):

  ```bash
  cordova plugin add cordova-plugin-device
  ```

6. Install [cordova-custom-config plugin](https://github.com/dpa99c/cordova-custom-config)

  ```bash
  cordova plugin add cordova-custom-config
  ```

7. Install [cordova-plugin-statusbar plugin](https://github.com/apache/cordova-plugin-statusbar)

  ```bash
  cordova plugin add cordova-plugin-statusbar
  ```

  Then add the following lines into **config.xml** (for iOS 10+):

  ```xml
  <platform name="ios">
    ...
    <custom-config-file parent="NSCameraUsageDescription" platform="ios" target="*-Info.plist">
      <string>Access to camera to make video calls.</string>
    </custom-config-file>
    <custom-config-file parent="NSMicrophoneUsageDescription" platform="ios" target="*-Info.plist">
      <string>Access to microphone to make calls.</string>
    </custom-config-file>
  </platform>
  ```

  And the following for Android:

  ```xml
  <platform name="android">
    ...
    <custom-preference name="android-minSdkVersion" value="21" />
    <custom-preference name="android-targetSdkVersion" value="28" />
    <custom-config-file parent="/*" target="AndroidManifest.xml">
      <uses-permission android:name="android.webkit.PermissionRequest" />
      <uses-permission android:name="android.permission.INTERNET" />
      <uses-permission android:name="android.permission.RECORD_AUDIO" />
      <uses-permission android:name="android.permission.MODIFY_AUDIO_SETTINGS" />
      <uses-permission android:name="android.permission.CAMERA" />
      <uses-feature android:name="android.hardware.camera" />
      <uses-feature android:name="android.hardware.camera.autofocus" />
    </custom-config-file>
  </platform>
  ```

  Also, don't forget to put the `xmlns:android="http://schemas.android.com/apk/res/android"` attribute in the root `widget` element.

  More info on [Android permissions](https://developer.android.com/training/permissions/requesting.html).

8. Install [cordova-plugin-android-permissions plugin](https://github.com/NeoLSN/cordova-plugin-android-permissions)

  ```bash
  cordova plugin add cordova-plugin-android-permissions
  ```

9. move to WKWebView  for iOS

  ```bash
  cordova plugin add cordova-plugin-wkwebview-engine
  ```

  Then to setup the required permissions:

  ```xml
  <platform name="ios">
    ...  
    <feature name="CDVWKWebViewEngine">
      <param name="ios-package" value="CDVWKWebViewEngine" />
    </feature>
    <preference name="CordovaWebViewEngine" value="CDVWKWebViewEngine" />
    <preference name="WKWebViewOnly" value="true" />
  </platform>
  ```

  More info on permissions https://github.com/apache/cordova-plugin-wkwebview-engine#required-permissions

10. Install [cordova-plugin-iosrtc plugin](https://github.com/BasqueVoIPMafia/cordova-plugin-iosrtc) to make video calling work at iOS:

  ```bash
  cordova plugin add cordova-plugin-iosrtc
  ```

  Then follow all the steps from the [Building Steps guide](https://github.com/BasqueVoIPMafia/cordova-plugin-iosrtc/blob/master/docs/Building.md) to connect the plugin in a right way.

11. Install [iOS Deployment Tools](https://cordova.apache.org/docs/en/latest/guide/platforms/ios/#deployment-tools) if you want to launch iOS app on iOS device.

12. Take sources from https://github.com/ConnectyCube/connectycube-web-samples/tree/master/videochat to your **connectycube-cordova-samples/sample-videochat-cordova** app:

  - clone [connectycube-web-samples](https://github.com/ConnectyCube/connectycube-web-samples) repository;
  - navigate to the **connectycube-web-samples/videochat** and run `npm install && npm run build` to prepare **dist**;
  - copy **dist**'s content to the **connectycube-cordova-samples/sample-videochat-cordova/www** folder of your Cordova app

13. Create and add **index.js** file into **www** folder:

  ```javascript
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
  ```

14. Change `<meta name="viewport" content="..." />` and connect `cordova.js`, `index.js` scripts instead of `main.js` at your `index.html` file:

  ```html
  <!DOCTYPE html>
  <html lang="en">
    <head>
      <meta charset="UTF-8" />
      <meta name="viewport" content="initial-scale=1, width=device-width, viewport-fit=cover" />
      ...
    </head>
    ...
    <script type="text/javascript" src="cordova.js"></script>
    <script type="text/javascript" src="index.js"></script>
  </html>
  ```

15. Finally, use the following commands to run the sample:

  ```bash
  cordova run ios --device # for run on device
  cordova emulate ios # for run on emulator
  ```

  ```bash
  cordova run android --device # for run on device
  cordova emulate android # for run on emulator
  ```

> The complete sample source code is available at [GitHub repository](https://github.com/ConnectyCube/connectycube-cordova-samples/tree/master/sample-videochat-cordova)

## Debugging

The following tools will help you debug your Cordova application:

- [Safari Web inspector](http://phonegap-tips.com/articles/debugging-ios-phonegap-apps-with-safaris-web-inspector.html)

## Can't build yourself?

Got troubles with building Cordova code sample? Just create an issue at [Issues page](https://github.com/ConnectyCube/connectycube-cordova-samples/issues) - we will create the sample for you. For FREE!
