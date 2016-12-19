/*
* Random media script
* Jeremiah Bushau
*/

'use strict'

// node.js
const fs = require('fs');
const path = require('path');
const spawn = require('child_process').spawn;
// 3rd party
const prompt = require('prompt');
const recursive = require('recursive-readdir');

function getUserInput() {
  let schema = {
    catagory: {
      name: 'catagory',
      message: 'Get Movie or TV?',
      validator: /movie|tv/i,
      required: true,
      warning: 'Enter "movie" or "tv".'
    },
    number: {
      name: 'number',
      message: 'Number of files to get?',
      validator: /^[1-9][0-9]?$|^100$/,
      required: true,
      warning: 'Enter 1-100.'
    }
  }

  prompt.start();
  prompt.colors = false;
  prompt.message = '';
  prompt.delimiter = '';
  
  var userInputPromise = new Promise( function(resolve, reject) {
    prompt.get(schema.catagory, function(err, result) {
      let catagory = result.catagory.trim().toLowerCase();
      resolve(catagory);
    });
  })
  .then( function(catagory) {
    prompt.get(schema.number, function(err, result) {
      let number = result.number;
      getAllFiles(catagory, number);
    });
  });
}

function getAllFiles(catagory, num) {
  console.log(catagory + ', it is.\n' 
    + 'Grabbing ' + num + ' random file(s).');

  if (catagory === 'movie') {
           // '/path/to/your/movies'
    recursive('/home/arab/Videos/Movies', function(err, files) {
     getRandomChoices(validate(files), num);
    });
  } else {
           // '/path/to/your/tv'
    recursive('/home/arab/Videos/TV', function(err, files) {
      getRandomChoices(validate(files), num);
    });
  }
}

function validate(array) {
  let validExt = ['.avi', '.mkv', '.divx', '.mp4', '.m4v'];
  let validFiles = [];

  for (let i = 0; i < array.length; i++) {
    
    if (validExt.indexOf(path.extname(array[i])) !== -1) {
      validFiles.push(array[i]);
    }
  }

  return validFiles
}

function getRandomChoices(array, num=1) {
  let choices = [];
  
  for (let i = 0; i < num; i++) {
    let randomIndex = ~~(Math.random() * array.length);
    let randomChoice = array[randomIndex];

    if ((choices.indexOf(randomChoice) !== -1)) {
      console.log('frustration averted.');
    } 

    choices.push(randomChoice);
  }

  console.log(choices.length + 
    ' file(s) successfully added to playlist.');

  addToPlayList(choices);
}

function addToPlayList(array) {
     // 'player'
  spawn('vlc', array, {
    detached: true,
    stdio: 'ignore'
  });
}

function main() {
  getUserInput();
}

main();
