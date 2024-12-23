// Connect to the server (same origin, so no need to specify the full URL)
const socket = io();

// Elements
const form = document.getElementById('send-container');
const messageInput = document.getElementById('messageInp');
const messageContainer = document.querySelector('.container');
var audio = new Audio('ting.mp3');
// Function to append messages to the chat
const append = (message, position) => {
  const messageElement = document.createElement('div');
  messageElement.innerText = message;
  messageElement.classList.add('message');
  messageElement.classList.add(position);
  messageContainer.append(messageElement);
  if (position === 'left') {
    audio.play();
  }
  
};

// Handle message sending
form.addEventListener('submit', (e) => {
  e.preventDefault();  // Prevent default form submission behavior
  const message = messageInput.value;
  append(`You: ${message}`, 'right');
  socket.emit('send', message);  // Send the message to the server
  messageInput.value = '';  // Clear the input field
});

// Prompt the user for their name when joining
const name = prompt("Enter your name to join");
socket.emit('new-user-joined', name);

// Receive and display messages from other users
socket.on('user-joined', (name) => {
  append(`${name} joined the chat`, 'right');
});
socket.on('receive', (data) => {
  append(`${data.name}: ${data.message}`, 'left');
});
socket.on('left', (name) => {
  append(`${name} left the chat`, 'left');
});
