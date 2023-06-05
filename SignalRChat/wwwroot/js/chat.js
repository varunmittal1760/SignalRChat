"use strict";

var connection = new signalR.HubConnectionBuilder().withUrl("/chatHub").build();

//Disable the send button until connection is established.
document.getElementById("sendButton").disabled = true;

connection.on("ReceiveMessage", function (user, message) {
    var li = document.createElement("li");
    document.getElementById("messagesList").appendChild(li);
    // We can assign user-supplied strings to an element's textContent because it
    // is not interpreted as markup. If you're assigning in any other way, you 
    // should be aware of possible script injection concerns.
    li.textContent = `${user} says ${message}`;
});
connection.on("ReceiveNumber", function (user, number) {
    var li = document.createElement("li");
    document.getElementById("numbersList").appendChild(li);
    li.textContent = `${user} sent number: ${number}`;
});

connection.start().then(function () {
    document.getElementById("sendButton").disabled = false;

    setInterval(function () {
        var user = document.getElementById("userInput").value;
        var number = Math.floor(Math.random() * 100); // Generate a random number
        connection.invoke("SendNumber", user, number).catch(function (err) {
            console.error(err.toString());
        });
    }, 2000);
}).catch(function (err) {
    return console.error(err.toString());
});

document.getElementById("sendButton").addEventListener("click", function (event) {
    var user = document.getElementById("userInput").value;
    var message = document.getElementById("messageInput").value;
    connection.invoke("SendMessage", user, message).catch(function (err) {
        return console.error(err.toString());
    });
    event.preventDefault();
});