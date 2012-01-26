#WORK IN PROGRESS!!!

# Node-Eyefi

We are creating a platform independant Eyefi Server written in Node. With a very focused feature set.

Features include:
- Store received files in folder
- Execute command after file has been received
- JPEG only.
- Multiple cards

## Installation

Simplfy clone the repository, run npm install and start the app.

    git clone git://github.com/komola/node-eyefi.git
    npm install .

## Usage

First. Setup your card so that it sends the jpg or raw file to a computer. For the moment you should consider turning off any other features such as FTP Upload, GeoTagging, etc.
Second. Change the config so it does what you want it to :)

Third. Start the server.

    node app.js

If you want to choose a different config file
    
    node app.js otherconfig.js

As soon as an image comes in, we'll inform you in the console.

## Todo

- Get it to work :P
- GeoTagging
- RAW Files next to JPEG

## Issues?

The software has only been tested with Windows 7 x64, Mac OS X (10.5 and 10.6) and Debian 6 and an Eye-FI PRO X2 Card (Version 5.0001).

If you open an Issue, state as much information as possible such as: Eye-FI Firmware, Operating System, Node Version.

## Thanks

The documentation was taken from https://github.com/tachang/EyeFiServer