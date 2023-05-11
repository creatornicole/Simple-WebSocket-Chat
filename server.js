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

server.listen(3000); //Port

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
    for(let i = 0; i <= 7; i++) { //generate random Chat-Id
        chatIdString += characters.charAt(Math.floor(Math.random() * characters.length));
    }

    //zum Key chatIdString wird ein leeres Array angelegt, in dem die Websocketverbindungen
    //gespeichert werden sollen
    chats.set(chatIdString, []);

    res.redirect('/chat/' + chatIdString);
});

//Anzeige chat.html, wenn Nutzer auf eine Chat-Seite gelangt
app.get('/chat/:chatId', function(req, res) {
    var chatId = req.params.chatId; //die Chat-Id wird aus der URL gewonnen
    if(!chats.has(chatId)) { //chatId in Map noch nicht vorhanden
        chats.set(chatId, []);
    }
    res.sendFile(path.join(__dirname, '../WebSockets', 'chat.html'))
});

//Websocketverbindung
wss.on('connection', function connection(ws, request) {
    ws.on('message', function incoming(message) {
        var chatId = JSON.parse(message).chatId;
        //pruefen, ob Verbindung bereits ChatId zugeordnet ist
        if(chats.has(chatId)) {
            if(!chats.get(chatId).includes(ws)) {
                //wenn Connection noch nicht aufgenommen wurde, hinzufügen
                chats.get(chatId).push(ws);
            }
        }

        messageJSON = JSON.parse(message);

        //Reaktion bei init Nachricht
        if(messageJSON.type == 'init') {
            var reply = {};
            reply["message"] = "Reply on Init-Message from Chat: " + chatId;
            ws.send(JSON.stringify(reply));
        }

        //Reaktion bei normaler Nachricht
        if(messageJSON.type == 'message') {
            connections = chats.get(chatId);
            connections.forEach(sendMsg);
        }

        function sendMsg(con) {
            var reply = {};
            reply["message"] = messageJSON.message;
            reply["name"] = messageJSON.name;
            reply["type"] = "message";
            con.send(JSON.stringify(reply));
        }
    })
})