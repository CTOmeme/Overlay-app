document.addEventListener('DOMContentLoaded', function() {
    const upload = document.getElementById('upload');
    const canvas = document.getElementById('canvas');
    const ctx = canvas.getContext('2d');
    const flipButton = document.getElementById('flip');
    const increaseSizeButton = document.getElementById('increaseSize');
    const decreaseSizeButton = document.getElementById('decreaseSize');
    const downloadButton = document.getElementById('download');
    const downloadLink = document.createElement('a');
    const message = document.getElementById('message');

    downloadLink.style.display = 'none';
    document.body.appendChild(downloadLink);

    let userImage = new Image();
    let overlayImage = new Image();
    overlayImage.crossOrigin = "anonymous"; // Enable CORS for the overlay image
    overlayImage.src = 'https://static.wixstatic.com/media/819c2c_ec88ac72f45445d980fdf060d41dec15~mv2.png';
    let overlayX = 0, overlayY = 0;
    let overlayWidth = 100, overlayHeight = 100;
    let dragging = false;
    let flipped = false;
    let pinchStartDistance = 0;
    let initialOverlayWidth = 100;
    let initialOverlayHeight = 100;

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
                userImage = new Image();
                userImage.crossOrigin = "anonymous"; // Enable CORS for the user image
                userImage.onload = () => {
                    overlayX = (canvas.width - overlayWidth) / 2;
                    overlayY = (canvas.height - overlayHeight) / 2;
                    draw();
                };
                userImage.src = event.target.result;
            };
            reader.readAsDataURL(file);
        }
    });

    canvas.addEventListener('mousedown', startDragging);
    canvas.addEventListener('mousemove', drag);
    canvas.addEventListener('mouseup', stopDragging);
    canvas.addEventListener('touchstart', handleTouchStart, { passive: false });
    canvas.addEventListener('touchmove', handleTouchMove, { passive: false });
    canvas.addEventListener('touchend', stopDragging);

    function getCoordinates(e) {
        const rect = canvas.getBoundingClientRect();
        const x = (e.clientX || e.touches[0].clientX) - rect.left;
        const y = (e.clientY || e.touches[0].clientY) - rect.top;
        return { x, y };
    }

    function startDragging(e) {
        const { x, y } = getCoordinates(e);
        if (x >= overlayX && x <= overlayX + overlayWidth && y >= overlayY && y <= overlayY + overlayHeight) {
            e.preventDefault(); // Prevent default touch behavior
            dragging = true;
        }
    }

    function drag(e) {
        if (dragging) {
            e.preventDefault(); // Prevent default touch behavior
            const { x, y } = getCoordinates(e);
            overlayX = x - overlayWidth / 2;
            overlayY = y - overlayHeight / 2;
            draw();
        }
    }

    function stopDragging() {
        dragging = false;
        pinchStartDistance = 0; // Reset pinch distance
    }

    function handleTouchStart(e) {
        if (e.touches.length === 2) {
            pinchStartDistance = getPinchDistance(e.touches);
            initialOverlayWidth = overlayWidth;
            initialOverlayHeight = overlayHeight;
        } else {
            startDragging(e);
        }
    }

    function handleTouchMove(e) {
        if (e.touches.length === 2) {
            e.preventDefault(); // Prevent default touch behavior
            const currentDistance = getPinchDistance(e.touches);
            const scale = currentDistance / pinchStartDistance;
            overlayWidth = initialOverlayWidth * scale;
            overlayHeight = initialOverlayHeight * scale;
            draw();
        } else {
            drag(e);
        }
    }

    function getPinchDistance(touches) {
        const dx = touches[0].clientX - touches[1].clientX;
        const dy = touches[0].clientY - touches[1].clientY;
        return Math.sqrt(dx * dx + dy * dy);
    }

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
        draw(); // Ensure the canvas is fully drawn before downloading

        // Create a temporary canvas to crop the image to the original aspect ratio
        const tempCanvas = document.createElement('canvas');
        const tempCtx = tempCanvas.getContext('2d');
        const aspectRatio = userImage.width / userImage.height;
        let cropWidth, cropHeight;

        if (aspectRatio > 1) {
            cropWidth = canvas.width;
            cropHeight = canvas.width / aspectRatio;
        } else {
            cropHeight = canvas.height;
            cropWidth = canvas.height * aspectRatio;
        }

        tempCanvas.width = cropWidth;
        tempCanvas.height = cropHeight;

        tempCtx.drawImage(canvas, (canvas.width - cropWidth) / 2, (canvas.height - cropHeight) / 2, cropWidth, cropHeight, 0, 0, cropWidth, cropHeight);

        tempCanvas.toBlob(function(blob) {
            const url = URL.createObjectURL(blob);
            downloadLink.href = url;
            downloadLink.download = 'profile-photo.png';
            downloadLink.click();
            URL.revokeObjectURL(url);

            // Show the message after download
            message.style.display = 'flex';
        }, 'image/png');
    });
});
