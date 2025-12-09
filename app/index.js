const { app, BrowserWindow, desktopCapturer, shell, nativeTheme} = require('electron')

const partition = app.commandLine.getSwitchValue("partition") || "teams";
const devConsole = app.commandLine.hasSwitch("dev-console");

const createWindow = () => {
    const window = new BrowserWindow(
        {
            icon: 'app/assets/icons/icon/icon.png',
            
            autoHideMenuBar: true,

            backgroundColor: "#00FFFFFF",

            webPreferences: {
                partition: 'persist:' + partition
            }
        }
    );

    // Enable media capture (screen sharing)
    window.webContents.session.setDisplayMediaRequestHandler(
        (request, callback) => {
            desktopCapturer.getSources({ types: ['screen'] }).then((sources) => {
                // Grant access to the first screen found.
                callback({ video: sources[0], audio: 'loopback' });
            })
        }, 
        { 
            // If true, use the system picker if available.
            // Note: this is currently experimental. If the system picker
            // is available, it will be used and the media request handler
            // will not be invoked.
            useSystemPicker: true 
        }
    );

    
    // Register a link handler to open links using system browser.
    window.webContents.setWindowOpenHandler(({ url }) => {
        // Open links using system browser
        shell.openExternal(url);

        // Prevent opening from Electron.
        return { action: 'deny' };
    });


    // Set user agent (default electron one does not work well with teams)
    window.webContents.setUserAgent('Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36');
    //window.webContents.setUserAgent('Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36 Edg/143.0.0.0');

    // Open default Teams url.
    window.loadURL('https://teams.live.com/v2/');

    if (devConsole) {
        window.webContents.openDevTools();
    }
}

app.whenReady().then(() => {
  createWindow()
});