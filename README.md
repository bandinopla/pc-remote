# PC-Remote

PC-Remote is a python desktop app that runs on the PC you want to control, it will open a console window showing a QR code and a url, you must access that url from your phone to start controlling the mouse and keyboard.

**it takes a few seconds to load because it is compressed in a single .exe**

>- [Download executable (windows)](https://bandinopla.itch.io/pc-remote) 
>- [Virus total Scan result (it has false positives)](https://www.virustotal.com/gui/file/bac2d8131da6d22491b1957a7983c10189c2a318cbcc08dd515f1a400be70b33/detection) 


<img src="img/cover.jpg" width="45%" height="50%">|
<img src="img/A.jpg" width="15%" height="30%">|
<img src="img/B.jpg" width="15%" height="30%">|
<img src="img/C.jpg" width="15%" height="30%">


# How it's made
The server is written in Python and it uses [pyautogui](https://pyautogui.readthedocs.io/) to control the mouse and keyboard. It creates a WebSocket server and a simple HTTPServer used to deliver the front end app which is done in [React](https://reactjs.org/)

# Getting Started 

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

## Available Scripts

In the project directory, you can run:

### `npm run dev-server`

Runs the python server on watch mode on your local machine to develop, so you can change the server code and it will auto-reload on changes.

### `npm start`

Runs the react front-end app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in your browser.

The page will reload when you make changes. 

### `npm run build`

Builds the front-end app for production to the `build` folder. 

### `npm run compile` 

**You should run `build` BEFORE running `compile`**\
Compiles the proyect into a single **.exe** file in the folder `dist`\
It will grab the code in the `build` forlder and pack it in the EXE.

## Source files

React App files live inside the `src` folder\
Python Server files live inside `py-src` folder
