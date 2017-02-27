'use strict';

const electron = require('electron');
const remote = electron.remote;
const ipc = electron.ipcRenderer;
const shell = electron.shell;
const path = require('path');
const fs = require('fs');
const http = require('http');

const VOCABULARY_DIR = __dirname + '/../word/';
const CARD_COLOR_CATEGORIES = ['#428bca', '#5cb85c', '#5bc0de', '#f0ad4e', '#d9534f'];
const CARD_TIME_INTERVAL = 300000;

var mCloseBtn = document.querySelector('.close');

var mMainContentDiv = document.getElementById("main");
var mProgressDiv = document.getElementById("progress");

var mTitleText = document.getElementById("title");
var mPhoneticText = document.getElementById("phonetic");
var mMsgText = document.getElementById("msg");
var mReferenceText = document.getElementById("reference_link");

mCloseBtn.addEventListener('click', function () {
    ipc.send('close-main-window');
});

fs.readdir(VOCABULARY_DIR, function(err, files) {
    if (err) {
        document.getElementById("title").innerHTML = "Can't find out the dictionary";
    } else {
        setNewCardContent(files);
        setInterval(function(){
            setNewCardContent(files);
        }, CARD_TIME_INTERVAL);
    }
});

function setNewCardContent(files) {

    showProgress();

    // Randomly change the background color.
    var randomIndex = Math.floor((Math.random() * files.length));
    randomIndex = Math.floor((Math.random() * CARD_COLOR_CATEGORIES.length));
    mMainContentDiv.style.background = CARD_COLOR_CATEGORIES[randomIndex];

    // Randomly read a vocubulary.
    var fileContennt = fs.readFileSync(VOCABULARY_DIR + files[randomIndex], 'utf8');
    var lines = fileContennt.split(/\r?\n/);
    randomIndex = Math.floor((Math.random() * lines.length));
    var tmpArray = lines[randomIndex].split('%');
    var vocabulary = tmpArray[0];
    var chineseTranslated = tmpArray[1];

    var re = /<span class="phonetic">(.*?)<\/span>/g;
    var options = {
        host: 'yun.dreye.com',
        port: 80,
        path: '/dict_new/dict.php?w=' + vocabulary
    };
    http.get(options, function(res) {
        // Initialize the container for our data
        var data = "";

        // This event fires many times, each time collecting another piece of the response
        res.on("data", function (chunk) {
            // Append this chunk to our growing `data` var
            data += chunk;
        });

        // This event fires *one* time, after all the `data` events/chunks have been gathered
        res.on("end", function () {
            mTitleText.innerHTML = vocabulary;
            mPhoneticText.innerHTML = data.match(re);
            mMsgText.innerHTML = chineseTranslated;
            mReferenceText.addEventListener('click', function () {
                shell.openExternal("http://yun.dreye.com/dict_new/dict.php?w=" + vocabulary);
            });

            showContent();
        });
    }).on('error', function(e) {
        mTitleText.innerHTML = vocabulary;
        mPhoneticText.innerHTML = "Error name: " + e.name;
        mMsgText.innerHTML = "Error message: " + e.message;
        mReferenceText.addEventListener('click', function () {
            shell.openExternal("http://yun.dreye.com/dict_new/dict.php?w=" + vocabulary);
        });

        showContent();
    });
}

function showProgress() {
    mMainContentDiv.style.display = "none";
    mProgressDiv.style.display = "block";
}

function showContent() {
    mMainContentDiv.style.display = "block";
    mProgressDiv.style.display = "none";
}