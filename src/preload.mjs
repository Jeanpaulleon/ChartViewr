import Alpaca from '@alpacahq/alpaca-trade-api';
import { contextBridge } from 'electron';
import { ipcRenderer } from 'electron';


console.log("Preload script loaded.");

let alpacaInstance = null;
let apiKeyStored = '';
let secretKeyStored = '';


// Expose the ipcRenderer to the renderer processes securely
contextBridge.exposeInMainWorld('electronAPI', {
    sendContinueClicked: () => ipcRenderer.send('continue-clicked')
});

contextBridge.exposeInMainWorld('api', {
    initializeAlpaca: (apiKey, secretKey, paper = false) => {
        apiKeyStored = apiKey; // Store keys in closure
        secretKeyStored = secretKey;

        return new Promise((resolve, reject) => {
            try {
                alpacaInstance = new Alpaca({
                    keyId: apiKey,
                    secretKey: secretKey,
                    paper: paper
                });
                resolve({ alpaca: alpacaInstance, apiKey: apiKeyStored, secretKey: secretKeyStored });
            } catch (error) {
                console.error("Failed to initialize Alpaca instance:", error);
                reject(error);
            }
        });
    },
    getAlpaca: () => {
        if (alpacaInstance) {
            return { alpaca: alpacaInstance, apiKey: apiKeyStored, secretKey: secretKeyStored };
        } else {
            return null;
        }
    }
});
