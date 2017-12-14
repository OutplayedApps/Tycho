# Tycho
## What is Tycho?
Tycho is a mobile app that allows people to access study guides to learn science, literature, and history for academic competitions.

### Release notes:
#### 2.0.6
````
12/4/2017
- start buzz timer when game mode finishes reading question
````

#### 2.0.5
```
- You can now choose a "random" option for vendor, which lets you filter between categories! This helps people more when they practice by themselves and want to hone in on a specific topic.
Minor:
- Audio is off by default.
```
```
v 2.0.4
Science Bowl is now Tycho! Many improvements include:
- Offline access for questions
- Hundreds of more questions have been added
- Audio mode added, in which it reads the questions to you
- Brand new look and feel
- Much faster framework; the app has been completely rewritten in Ionic 2
```
```
2.0.4 long
Since January, we've been listening to your feedback on our original science bowl app, and we're excited to announce a new stage in its development.

Science Bowl is now Tycho! Many improvements include:

- Offline access for all questions. Access your questions and practice with friends or by yourself on the go, whether you're on a plane to nationals or on vacation!

- Audio mode added, in which the app reads the questions to you.

- Hundreds of more questions have been added. We've incorporated additional sample questions, beyond just those offered by the DOE website. These questions are written by experienced former National Science Bowl players and are available exclusively on our app for free -- and we plan to update it regularly. We hope this will give teams a greater variety of questions to practice with!

- Brand new look and feel, and a much faster framework; the app has been completely rewritten in Ionic 2

Download the app today, at our website: http://outplayedapps.com/science-bowl/.
Download for iOS: https://itunes.apple.com/us/app/science-bowl/id1191853690?ls=1&mt=8
Download for Android: https://play.google.com/store/apps/details?id=com.outplayed.nsbapp
```

### App store description:
```
Train your brain! Prepare for the National Science Bowl! An app like no other...
```
```
Science Bowl is now Tycho! Many improvements include:
- Offline access for questions
- Hundreds of more questions have been added
- Audio mode added, in which it reads the questions to you
- Brand new look and feel
- Much faster framework.

This app uses questions from the National Science Bowl website to help prepare teams for practice, let individuals practice questions of a specific subject or difficulty, and just to let people learn science!

In Reader Mode, tossups and bonuses will all appear at once. This is ideal for coaches reading questions to different teams during actual rounds at practice or tournaments.

In Game Mode, tossups and bonuses will be read to you as if it's an actual science bowl round. This is good for players who are practicing questions by themselves, as you can select by category or by difficulty.

Disclaimer: The app is not sponsored by the National Science Bowl®, U.S. Department of Energy or the U.S. Government.
The questions taken from the National Science Bowl® website are the property of the Department of Energy and are available to the general public at no cost.
```

# Updates
http://tiny.cc/tychoupdate

https://docs.google.com/document/d/1JlqM9yRqHyBls6shQdCSbplbCAZQ8E0gQprqaEz0AKg/edit

https://docs.google.com/document/u/0/export?format=txt&id=1JlqM9yRqHyBls6shQdCSbplbCAZQ8E0gQprqaEz0AKg&token=AC4w5ViU9Hl6rCjnkWr0egjn4pP1fOq74w%3A1511654290622&includes_info_params=true

<img src="https://user-images.githubusercontent.com/1689183/30305693-20e4cf9a-9729-11e7-874f-79abdb039712.png" width="200">

<img src="https://user-images.githubusercontent.com/1689183/30305697-2610e382-9729-11e7-93c5-91de7aac0245.png" width="200">

<img src="https://user-images.githubusercontent.com/1689183/30305702-29d3d9b6-9729-11e7-8a15-413ba402d927.png" width="200">

<img src="http://i.imgur.com/ikJJ7No.png" width="100">

## Technologies used:
- Ionic 2 and Angular 2 to make the app for both iOS and Android.
- Using PHP for the backend, developed a CRUD interface to edit database entries.


## Setup
- Install Node JS at https://nodejs.org/en/download/
- Open command prompt and cd to this directory. (Clone through Github).
- `npm install -g ionic`
- `npm install`
- `ionic serve`
- There, you're done! It should open up in a window.
- Go to inspect element, then click on "Toggle device toolbar" to view the app from a device-sized screen. (Or press Ctrl-Shift-M).
<img src="http://i.imgur.com/inZjBKJ.png">

## Database instructions
Connect to SSH server
- `mysql -u root -p`
- `use mysql; `
- `update user set authentication_string=password('pwd') where user='username';

Access database at http://outplayedapps.com/tycho/

`select * from subcats join cats on (subcats.catId = cats.catId)`

## History
April-end: Idea conceived

5/4 - Created the app using Ionic 1 

5/5 - Upgrade to Ionic 2

5/7 - Created the backend database

5/11 (around this time) - Created CRUD interface using jsGrid

11/22 - Created django admin app, imported extra questions.

# Code push
```
appcenter login
appcenter apps list
appcenter apps create -d TychoAndroid -o Android -p Cordova
appcenter apps create -d TychoiOS -o iOS -p Cordova
appcenter apps set-current aramaswamis-84dc/TychoAndroid
appcenter tokens list


appcenter apps set-current aramaswamis-84dc/TychoAndroid
appcenter codepush deployment list
appcenter codepush deployment add Production
appcenter codepush release-cordova

appcenter apps set-current aramaswamis-84dc/TychoiOS
appcenter codepush deployment list
appcenter codepush deployment add Production
appcenter codepush release-cordova

appcenter codepush deployment history Production
appcenter codepush deployment clear Production

Release:
```
ionic build
appcenter codepush release-cordova -a aramaswamis-84dc/TychoiOS
ionic build && appcenter codepush release-cordova -d Production -a aramaswamis-84dc/TychoAndroid
```
Android:
Staging key: h0vcBzFs4qWOH9KMuaDa6hm_WgYpSy2FzRXlz
Production key: nP7rBNQCk8csBGFhH1ZgrNCuAydjBkVKzRXeG

iOS:
Staging key: SYx-kYYL7TFFGfaULIeEBWEk8BvhryZ0MAmlz
Production key: bbdTmRFS0Me7_em4DsbexpR4gvaQSk5TfRmgM

Release-cordova cli info: https://github.com/Microsoft/code-push/tree/master/cli#releasing-updates-cordova

http://ryanjsalva.com/2016/05/01/publish-without-resubmitting-to-the-app-store.html

Logging:
```
adb logcat *:W
```

Release (android):
```
keytool -list -keystore nsbapp.keystore

ionic cordova build --release android

# jarsigner under jdk/bin/tools. zipalign under android-sdk-folder/build-tools/#/

jarsigner -tsa http://timestamp.digicert.com -verbose -sigalg SHA1withRSA -digestalg SHA1 -keystore nsbapp.keystore platforms\android\build\outputs\apk\android-release-unsigned.apk nsbapp

zipalign -v 4 platforms\android\build\outputs\apk\android-release-unsigned.apk release-2.1.0.apk
```

Release (iOS):
```
export PATH=/afs/ir.stanford.edu/users/a/s/ashwin99/Documents/local/bin/:$PATH

ionic cordova build ios --release
```

# Deploying to web
cd www
git remote add origin https://github.com/OutplayedApps/Tycho.git
git add -A
git commit -m "commit"
git push -f origin master:gh-pages