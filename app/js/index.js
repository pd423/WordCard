'use strict';

const electron = require('electron');
const remote = electron.remote;
var ipc = electron.ipcRenderer;
var path = require('path');

var closeEl = document.querySelector('.close');

closeEl.addEventListener('click', function () {
    ipc.send('close-main-window');
});

const fs = require('fs');

const vocabularyFolder = __dirname + '/../word/';
const cardCategories = ['#428bca', '#5cb85c', '#5bc0de', '#f0ad4e', '#d9534f'];

fs.readdir(vocabularyFolder, function(err, files) {
    if (err) {
        document.getElementById("title").innerHTML = "Can't find out the dictionary";
    } else {
        setNewCardContent(files);
        setInterval(function(){
            setNewCardContent(files);
        }, 300000);
    }
});

function setNewCardContent(files) {
    var randomIndex = Math.floor((Math.random() * files.length));

    var text = fs.readFileSync(vocabularyFolder + files[randomIndex], 'utf8');

    var lines = text.split(/\r?\n/);

    randomIndex = Math.floor((Math.random() * lines.length));

    var tmpVocabulary = lines[randomIndex].split('%');
    document.getElementById("title").innerHTML = tmpVocabulary[0];
    document.getElementById("msg").innerHTML = tmpVocabulary[1];

    randomIndex = Math.floor((Math.random() * cardCategories.length));
    document.getElementById("main").style.background = cardCategories[randomIndex];
}