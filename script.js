const cungthaImg = document.getElementById("cungtha");
const muitenImg = document.getElementById("muiten");
const container = document.getElementById("container");
const biaImg = document.getElementById("bia");
const messageBox = document.getElementById("message");
const whish = document.getElementById('sound1');
const miss = document.getElementById('sound2');

let currentAngle = 0;

const successMessages = [
  "Good !!!", 
  "Perfect", 
  "Amazing 🥰", 
  "I Love You ❤️", 
  "You're So Good", 
  "Nice Shoot"
];

const failMessages = [
  "Thất bại", 
  "Miss !!!", 
  "Cố lên"
];

function showMessage(text, isSuccess = true) {
  messageBox.textContent = text;
  messageBox.style.display = "block";
  messageBox.style.animation = "none";
  void messageBox.offsetWidth;
  messageBox.style.animation = "explode 1.5s ease-out forwards";

  if (isSuccess) {
    messageBox.style.color = "#ff003c";
    messageBox.style.textShadow = "0 0 10px #fff, 0 0 20px #ff003c, 0 0 30px #ff003c";
  } else {
    messageBox.style.color = "#ffffff";
    messageBox.style.textShadow = "0 0 5px #222222, 0 0 10px #444444, 0 0 15px #222222";
  }

  setTimeout(() => {
    messageBox.style.display = "none";
  }, 1500);
}

document.addEventListener("mousemove", function (event) {
  const rect = cungthaImg.getBoundingClientRect();
  const centerX = rect.left + rect.width / 2;
  const centerY = rect.top + rect.height / 2;

  const deltaX = event.clientX - centerX;
  const deltaY = event.clientY - centerY;

  const angleRad = Math.atan2(deltaY, deltaX);
  currentAngle = angleRad * (180 / Math.PI);

  cungthaImg.style.transform = `rotate(${currentAngle}deg)`;
  muitenImg.style.transform = `translate(-50%, -50%) rotate(${currentAngle}deg)`;
});

document.addEventListener("mousedown", function () {
  cungthaImg.src = "./style/CungVuon.png";
  muitenImg.style.display = "block";
});

document.addEventListener("mouseup", function () {
  cungthaImg.src = "./style/CungTha.png";
  const muitenRect = muitenImg.getBoundingClientRect();
  muitenImg.style.display = "none";

  const arrow = document.createElement("img");
  arrow.src = "./style/MuiTen.png";
  arrow.classList.add("arrow");

  const initialLeft = muitenRect.left + muitenRect.width / 2;
  const initialTop = muitenRect.top + muitenRect.height / 2;

  arrow.style.left = `${initialLeft}px`;
  arrow.style.top = `${initialTop}px`;
  arrow.style.width = `${muitenRect.width}px`;
  arrow.style.height = "auto";
  arrow.style.transform = `translate(-50%, -50%) rotate(${currentAngle}deg)`;

  container.appendChild(arrow);

  const angleRad = currentAngle * Math.PI / 180;
  const velocity = 20;
  let x = initialLeft;
  let y = initialTop;

  const biaRect = biaImg.getBoundingClientRect();
  const biaCenterX = biaRect.left + biaRect.width / 2;
  const biaCenterY = biaRect.top + biaRect.height / 2;

  const thresholdX = biaRect.width * 0.5;
  const thresholdY = biaRect.height * 0.32;

  let hit = false;

  const fly = () => {
    x += Math.cos(angleRad) * velocity;
    y += Math.sin(angleRad) * velocity;

    arrow.style.left = `${x}px`;
    arrow.style.top = `${y}px`;

    const arrowCenterX = x;
    const arrowCenterY = y;

    if (
      Math.abs(arrowCenterX - biaCenterX) <= thresholdX &&
      Math.abs(arrowCenterY - biaCenterY) <= thresholdY
    ) {
      hit = true;
      whish.pause();
      whish.currentTime = 0;
      whish.play();
      setTimeout(() => {
        whish.pause();
        whish.currentTime = 0;
      }, 500);

      biaImg.classList.add("shake");
      setTimeout(() => biaImg.classList.remove("shake"), 400);

      const explosion = document.createElement("div");
      explosion.classList.add("explosion");
      explosion.style.left = `${biaCenterX - 50}px`;
      explosion.style.top = `${biaCenterY - 50}px`;
      document.body.appendChild(explosion);
      setTimeout(() => explosion.remove(), 500);

      const randomMessage = successMessages[Math.floor(Math.random() * successMessages.length)];
      showMessage(randomMessage, true);

      setTimeout(() => arrow.remove(), 1000);
      return;
    }

    if (x < window.innerWidth + 100 && y < window.innerHeight + 100 && x > -100 && y > -100) {
      requestAnimationFrame(fly);
    } else {
      if (!hit) {
        miss.pause();
        miss.currentTime = 0;
        miss.play();
        setTimeout(() => {
          miss.pause();
          miss.currentTime = 0;
        }, 1000);
        const randomFailMsg = failMessages[Math.floor(Math.random() * failMessages.length)];
        showMessage(randomFailMsg, false);
      }
      arrow.remove();
    }
  };

  requestAnimationFrame(fly);
});