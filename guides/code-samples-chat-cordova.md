---
title: Cordova Chat code sample - How To guide
description: A complete guide of how to run origin Chat code sample for browser on Cordova/PhoneGap environment.
head:
  - tag: title
    content: Cordova Chat code sample - 'How To' guide | Connectycube
sidebar: 
    label: Chat code samples
    order: 4
---

Here we explain how to run origin [Chat code sample for browser](/js/code-samples#chat-code-sample) on [Cordova/PhoneGap environment](https://cordova.apache.org/#getstarted)

> Complete Chat API integration guide for Web/Javascript and Hybrid apps is [here](/js/messaging)

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
  cordova create sample-chat-cordova com.sample.chat SampleChatCordova
  ```

  You can use the [Create your first Cordova app](https://cordova.apache.org/docs/en/latest/guide/cli/) guide to get more info how to create your 1st Cordova app.

3. Change directory to newly created Cordova app:

  ```bash
  cd sample-chat-cordova
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

  Then add the following lines into **config.xml** (for iOS 10+, to support files attachments in sample):

  ```xml
  <platform name="ios">
    ...
    <custom-config-file parent="NSPhotoLibraryUsageDescription" platform="ios" target="*-Info.plist">
      <string>Access to photo library for file attachments</string>
    </custom-config-file>
    <custom-config-file parent="NSCameraUsageDescription" platform="ios" target="*-Info.plist">
      <string>Access to camera for file attachments</string>
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
        <uses-permission android:name="android.permission.READ_EXTERNAL_STORAGE" />
        <uses-permission android:name="android.permission.CAMERA" />
        <uses-permission android:name="android.permission.INTERNET" />
        <uses-feature android:name="android.hardware.camera" />
    </custom-config-file>
  </platform>
  ```

  Also, don't forget to put the `xmlns:android="http://schemas.android.com/apk/res/android"` attribute in the root `widget` element.

  More info on [Android permissions](https://developer.android.com/training/permissions/requesting.html).

7. Install [cordova-plugin-android-permissions plugin](https://github.com/NeoLSN/cordova-plugin-android-permissions)

  ```bash
  cordova plugin add cordova-plugin-android-permissions
  ```

  Then add a code to ask Android users for permissions. You can copy the needed code from the file:
  https://github.com/ConnectyCube/connectycube-cordova-samples-materials/blob/master/sample-chat-cordova/cordova-permissions.js

8. Install [iOS Deployment Tools](https://cordova.apache.org/docs/en/latest/guide/platforms/ios/#deployment-tools) if you want to launch iOS app on iOS device.

9. Copy content from **sample-chat-web** folder to **www** folder of your Cordova app. The following command can be used for it:

  ```bash
  cp -r sample-chat-browser/* sample-chat-cordova/www/
  ```

10. Connect `cordova.js` at your `index.html` file:

  ```html
  <script type="text/javascript" src="cordova.js"></script>
  ```

11. Finally, use the following commands to run the sample:

  ```bash
  cordova clean ios && cordova run ios --device # for run on device
  cordova clean ios && cordova emulate ios # for run on emulator
  ```

  ```bash
  cordova clean android && cordova run android --device # for run on device
  cordova clean android && cordova emulate android # for run on emulator
  ```

> The complete `config.xml`, `package.json` and `cordova-permissions.js` are available at [GitHub repository](https://github.com/ConnectyCube/connectycube-cordova-samples-materials/tree/master/sample-chat-cordova)

## Debugging

The following tools will help you debug your Cordova application:

* [Safari Web inspector](http://phonegap-tips.com/articles/debugging-ios-phonegap-apps-with-safaris-web-inspector.html)

## Can't build yourself?

Got troubles with building Cordova code sample? Just create an issue at [Issues page](https://github.com/ConnectyCube/connectycube-cordova-samples-materials/issues) - we will create the sample for you. For FREE!
