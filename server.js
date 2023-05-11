//Einbindung Module und Anlegen des entsprechenden Servers
var express = require('express');
var path = require('path');
var WebSocket = require('ws');
var http = require('http');
var crypto = require('crypto');

var app = express();
var server = http.createServer(app);
var wss = new WebSocket.Server({ server });
var chats = new Map(); // chatId => [socket connection 1, socket connection 2, ...]

//fuer eventuelle Einbindung style.css in Ordner public
//app.use(express.static(path.join(__dirname, '/public/')));

//Anlegen Datenstruktur
//In der die Chat-ID Key ist und dahinter einzelne Websocket-Verbindungen gespeichert werden
var chats = new Map(); //diese Variable wird nur im Speicher gehalten

//Weiterleitung Benutzer, der localhost:3000 aufruft, auf Chat-Seite
//mit URL localhost:3000/chat/<Chat-Id>
//<Chat-Id> ist von Server zufaellig erzeugte Zeichenkette
app.get('/', function(req, res) {
    const characters = "abcdefghijklmnopqrstuvwxyz1234567890";
    var chatIdString;
    for(let i = 0; i <= 7; i++) {
        chatIdString += characters.charAt(Math.floor(Math.random() * characters.length));
    }

    
});