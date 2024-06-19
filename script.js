const upload = document.getElementById('upload');
const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
const flipButton = document.getElementById('flip');
const increaseSizeButton = document.getElementById('increaseSize');
const decreaseSizeButton = document.getElementById('decreaseSize');
const downloadButton = document.getElementById('download');

let userImage = new Image();
let overlayImage = new Image();
overlayImage.src = 'https://static.wixstatic.com/media/819c2c_ec88ac72f45445d980fdf060d41dec15~mv2.png';
let overlayX = 0, overlayY = 0;
let overlayWidth = 100, overlayHeight = 100;
let dragging = false;
let flipped = false;

function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    if (userImage.src) {
        const aspectRatio = userImage.width / userImage.height;
        let drawWidth, drawHeight;
        if (aspectRatio > 1) {
            drawWidth = 400;
            drawHeight = 400 / aspectRatio;
        } else {
            drawWidth = 400 * aspectRatio;
            drawHeight = 400;
        }
        const offsetX = (400 - drawWidth) / 2;
        const offsetY = (400 - drawHeight) / 2;
        ctx.drawImage(userImage, offsetX, offsetY, drawWidth, drawHeight);
    }
    ctx.save();
    if (flipped) {
        ctx.translate(overlayX + overlayWidth / 2, overlayY + overlayHeight / 2);
        ctx.scale(-1, 1);
        ctx.translate(-(overlayX + overlayWidth / 2), -(overlayY + overlayHeight / 2));
    }
    ctx.drawImage(overlayImage, overlayX, overlayY, overlayWidth, overlayHeight);
    ctx.restore();
}

upload.addEventListener('change', (e) => {
    const file = e.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = (event) => {
            userImage.src = event.target.result;
            userImage.onload = () => {
                overlayX = (canvas.width - overlayWidth) / 2;
                overlayY = (canvas.height - overlayHeight) / 2;
                draw();
            };
        };
        reader.readAsDataURL(file);
    }
});

canvas.addEventListener('mousedown', (e) => {
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    if (x >= overlayX && x <= overlayX + overlayWidth && y >= overlayY && y <= overlayY + overlayHeight) {
        dragging = true;
    }
});

canvas.addEventListener('mousemove', (e) => {
    if (dragging) {
        const rect = canvas.getBoundingClientRect();
        overlayX = e.clientX - rect.left - overlayWidth / 2;
        overlayY = e.clientY - rect.top - overlayHeight / 2;
        draw();
    }
});

canvas.addEventListener('mouseup', () => {
    dragging = false;
});

flipButton.addEventListener('click', () => {
    flipped = !flipped;
    draw();
});

increaseSizeButton.addEventListener('click', () => {
    overlayWidth += 10;
    overlayHeight += 10;
    draw();
});

decreaseSizeButton.addEventListener('click', () => {
    overlayWidth = Math.max(10, overlayWidth - 10);
    overlayHeight = Math.max(10, overlayHeight - 10);
    draw();
});

downloadButton.addEventListener('click', () => {
    const dataUrl = canvas.toDataURL('image/png');
    const link = document.createElement('a');
    link.href = dataUrl;
    link.download = 'profile-photo.png';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
});
