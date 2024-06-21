body {
    font-family: 'Montserrat', sans-serif;
    text-align: center;
    margin: 0;
    padding: 0;
}

#app-container {
    position: relative;
    width: 100%;
    max-width: 400px;
    margin: 0 auto;
}

canvas {
    border: 4px solid black; /* 4 pixels border */
    border-radius: 8px; /* Rounded corners */
    display: block;
    margin: 8px auto; /* Reduced distance from border */
    max-width: 100%;
    height: auto;
}

button, .custom-file-upload {
    padding: 10px;
    margin: 5px;
    font-size: 16px;
    background-color: black;
    color: white;
    border: none;
    cursor: pointer;
    font-family: 'Montserrat', sans-serif;
    font-weight: 800;
    letter-spacing: 2px; /* Increased spacing for button fonts */
    border-radius: 8px; /* Rounded corners for buttons */
    display: inline-block;
    text-align: center;
}

button:hover, .custom-file-upload:hover {
    opacity: 0.8;
}

input[type="file"] {
    display: none; /* Hide the default file input */
}

.custom-file-upload {
    display: inline-block;
    cursor: pointer;
}

#message {
    margin-top: 20px;
    font-size: 18px; /* Text size */
    font-family: 'Montserrat', sans-serif;
    color: black;
    display: flex;
    align-items: center;
    justify-content: center;
}

#message span {
    margin: 0 10px;
}

#message a {
    color: black;
    text-decoration: underline;
}

.gif {
    width: 100px; /* Width of the GIF */
    height: 100px; /* Height of the GIF */
}

@media (max-width: 600px) {
    button, .custom-file-upload {
        padding: 8px;
        margin: 3px;
        font-size: 14px;
    }

    canvas {
        width: 90%;
        height: auto;
    }

    #message {
        font-size: 14px;
        flex-direction: column;
        align-items: center;
    }

    #message span {
        text-align: center;
    }

    .gif {
        width: 80px; /* Width for smaller screens */
        height: 80px; /* Height for smaller screens */
        margin: 10px 0; /* Margin for spacing on smaller screens */
    }
}
