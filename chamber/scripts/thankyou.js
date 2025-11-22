// Display submitted form data
const urlParams = new URLSearchParams(window.location.search);

document.getElementById('display-name').textContent = 
  `${urlParams.get('firstname')} ${urlParams.get('lastname')}`;
document.getElementById('display-email').textContent = urlParams.get('email');
document.getElementById('display-phone').textContent = urlParams.get('phone');
document.getElementById('display-organization').textContent = urlParams.get('organization');

// Format timestamp
const timestamp = urlParams.get('timestamp');
if (timestamp) {
  const date = new Date(timestamp);
  document.getElementById('display-timestamp').textContent = date.toLocaleString();
}