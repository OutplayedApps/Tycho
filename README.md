[![Stories in Ready](https://badge.waffle.io/epicfaace/Tycho.png?label=ready&title=Ready)](https://waffle.io/epicfaace/Tycho)
# Tycho
## What is Tycho?
Tycho is a mobile app that allows people to access study guides to learn science, literature, and history for academic competitions.
<img src="http://i.imgur.com/ikJJ7No.png">

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
