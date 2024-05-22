// Importing the lightweight-charts library directly in the renderer process
import { createChart } from 'lightweight-charts';

// Define Alpaca client and chart variables
let alpaca = null;
let currentSymbol = null; // This will hold the currently selected symbol
let chart;
let series;
let dataFetchInterval;
let countdownTimeout;
let countdown = 30;
let countdownTimer; // Declaration at the top of your script




document.addEventListener('DOMContentLoaded', () => {
    const loginContainer = document.getElementById('loginContainer');
    const stockForm = document.getElementById('stockForm');
    const appContainer = document.getElementById('app');
    const addToWatchlistButton = document.getElementById('addToWatchlistButton');
    const apiKeyForm = document.getElementById('apiKeyForm');
    const symbolDateForm = document.getElementById('symbolDateForm');
    const newSymbol = document.getElementById('newSymbol');
    const timeframeSelect = document.getElementById('timeframe');
    const stockSymbolInput = document.getElementById('stockSymbol');
    const startDateInput = document.getElementById('startDate');
    const endDateInput = document.getElementById('endDate');
    const chartContainer = document.getElementById('chartContainer');
    const apiKeyInput = document.getElementById('apiKey');
    const secretKeyInput = document.getElementById('secretKey');
    const rememberKeysCheckbox = document.getElementById('rememberKeys');
    const watchlistItems = document.getElementById('watchlistItems');

    // Check if elements specific to index.html exist
    if (loginContainer && stockForm && appContainer) {
    

// Event listener for stock symbol form submission
document.getElementById('symbolDateForm').addEventListener('submit', function(event) {
    event.preventDefault();
    startDataFetch();
});

// Optionally, start fetching when the symbol changes
document.getElementById('stockSymbol').addEventListener('change', startDataFetch);



    // Disclaimer specific code
    const continueButton = document.getElementById('continueButton'); // Assuming this ID for your continue button in disclaimer.html
    if (continueButton) {
        continueButton.addEventListener('click', () => {
            // Handle the continue button's logic here
            console.log('Continue button clicked');
            // Possibly close window or load index.html depending on your setup
        });
    } else {
        console.log('Continue button not found');
    }}
// Check if elements specific to index.html exist
    if (loginContainer && stockForm && appContainer) {
    timeframeSelect.addEventListener('change', () => {
        const symbol = stockSymbolInput.value.toUpperCase();
        const startDate = startDateInput.value;
        const endDate = endDateInput.value;
        const timeframe = timeframeSelect.value;
    
        // Call to load chart data with the new timeframe
        if (symbol && startDate ) {
            loadChartData(symbol, startDate, endDate, timeframe);
        }
    });

        stockSymbolInput.addEventListener('change', () => {
        const symbol = stockSymbolInput.value.toUpperCase();
        const startDate = startDateInput.value;
        const endDate = endDateInput.value;
        const timeframe = timeframeSelect.value;
    
        // Call to load chart data with the new timeframe
        if (symbol && startDate ) {
            loadChartData(symbol, startDate, endDate, timeframe);
        }
    });

    startDateInput.addEventListener('change', () => {
        const symbol = stockSymbolInput.value.toUpperCase();
        const startDate = startDateInput.value;
        const endDate = endDateInput.value;
        const timeframe = timeframeSelect.value;
    
        // Call to load chart data with the new timeframe
        if (symbol && startDate ) {
            loadChartData(symbol, startDate, endDate, timeframe);
        }
    });

    endDateInput.addEventListener('change', () => {
        const symbol = stockSymbolInput.value.toUpperCase();
        const startDate = startDateInput.value;
        const endDate = endDateInput.value;
        const timeframe = timeframeSelect.value;
    
        // Call to load chart data with the new timeframe
        if (symbol && startDate ) {
            loadChartData(symbol, startDate, endDate, timeframe);
        }

        
    });







    function resizeChartContainer() {
        const chartContainer = document.getElementById('chartContainer');
        if (chartContainer && chart) {
            // Calculate new height considering not to cut off the bottom
            let newHeight = window.innerHeight - chartContainer.offsetTop - 20; // 20px for margin
            newHeight = Math.max(newHeight, 250); // Ensure minimum height of 250px
    
            chartContainer.style.height = `${newHeight}px`;
           
            // Resize the chart dynamically // Apply custom Date formatter to chart options
        chart.applyOptions({
            width: chartContainer.clientWidth,
            height: newHeight,
            
            
        });
        }
    }
    document.addEventListener('DOMContentLoaded', function() {
        resizeChartContainer(); // Ensure initial dimensions are set correctly
    });
    
    // Call resize function on page load and window resize
    window.addEventListener('load', resizeChartContainer);
    window.addEventListener('resize', resizeChartContainer);
    document.addEventListener('DOMContentLoaded', resizeChartContainer); // Initial setup
    
// Load keys if they are remembered
if (localStorage.getItem('rememberKeys') === 'true') {
    apiKeyInput.value = localStorage.getItem('apiKey') || '';
    secretKeyInput.value = localStorage.getItem('secretKey') || '';
    rememberKeysCheckbox.checked = true;
}
    
    // Ensure the container has size before initializing the chart
    if (chartContainer && chartContainer.clientWidth > 0 && chartContainer.clientHeight > 0) {
        chart = createChart(chartContainer, {
            width: chartContainer.clientWidth,
            height: chartContainer.clientHeight,
            layout: {
                background: { color: '#222' },
                textColor: '#DDD',
            },
            grid: {
                vertLines: { color: '#444' },
                horzLines: { color: '#444' },
            },
             timeScale: {
            timeVisible: true, // Show the time in the time scale
            secondsVisible: true // Show seconds for intraday data
        },
            
        });
        // Setting the border color for the vertical axis
chart.priceScale().applyOptions({
    borderColor: '#71649C',
    timeVisible: true,
    secondsVisible: true,
});

// Setting the border color for the horizontal axis
chart.timeScale().applyOptions({
    borderColor: '#71649C',
});
        console.log('Chart initialized:', chart);
    } else {
        console.error('Chart container not found or has zero dimensions.');
    }

    document.getElementById('apiKeyForm').addEventListener('submit', function(event) {
        event.preventDefault();
        const apiKey = apiKeyInput.value.trim();
        const secretKey = secretKeyInput.value.trim();
        const rememberKeys = rememberKeysCheckbox.checked;

    
        if (!apiKey || !secretKey) {
            console.error('API Key and Secret Key must be provided.');
            return;
        }
    
       // Save keys to local storage if Remember Keys is checked
       if (rememberKeys) {
        localStorage.setItem('apiKey', apiKey);
        localStorage.setItem('secretKey', secretKey);
        localStorage.setItem('rememberKeys', 'true');
    } else {
        // Clear local storage if Remember Keys is unchecked
        localStorage.removeItem('apiKey');
        localStorage.removeItem('secretKey');
        localStorage.removeItem('rememberKeys');
    }
    console.log('Keys saved:', apiKey, secretKey);

    
        window.api.initializeAlpaca(apiKey, secretKey, false)
            .then(alpacaClient => {
                alpaca = alpacaClient;
                console.log('Alpaca client initialized successfully with keys:', apiKey, secretKey);
                loginContainer.style.display = 'none';
                stockForm.style.display = 'block';
                appContainer.style.display = 'block';
            })
            .catch(error => {
                console.error('Failed to initialize Alpaca:', error);
            });
    });

    symbolDateForm.addEventListener('submit', async event => {
        event.preventDefault();
        console.log('Checking Alpaca client state:', alpaca);

        if (!alpaca) {
            console.error('Alpaca client not initialized.');
            return;
        }

        const stockSymbol = document.getElementById('stockSymbol').value.toUpperCase();
        const startDate = document.getElementById('startDate').value;
        const endDate = document.getElementById('endDate').value;
        const timeframe = document.getElementById('timeframe').value;

        try {
            await loadChartData(stockSymbol, startDate, endDate, timeframe);
        } catch (error) {
            console.error('Error loading chart data:', error);
        }
    });
    // Utility function to debounce calls to another function
function debounce(func, delay) {
    let debounceTimer;
    return function() {
        const context = this;
        const args = arguments;
        clearTimeout(debounceTimer);
        debounceTimer = setTimeout(() => func.apply(context, args), delay);
    };
}

    document.getElementById('stockSymbol').addEventListener('input', debounce(function() {
        currentSymbol = this.value.toUpperCase(); // Update global symbol based on input
        if (currentSymbol) {
            startDataFetch(); // Start fetching data for the new symbol
        }
    }, 1000)); 
    
    if (addToWatchlistButton) {
        addToWatchlistButton.addEventListener('click', addToWatchlist);
        newSymbol.addEventListener('keypress', function(event) {
            if (event.key === 'Enter') {
                addToWatchlist();}})
        console.log('Event listener attached');  // Confirm the listener is attached
    } else {
        console.log('Button not found');  // Error handling if button is not found
    }

    function addToWatchlist() {
        const symbol = newSymbol.value.trim().toUpperCase(); // Ensure the symbol is uppercase
        if (symbol) {
            currentSymbol = symbol; // Update the global symbol
            const listItem = document.createElement('li');
            listItem.textContent = symbol;
            listItem.style.position = 'relative'; // Needed to position the delete button absolutely within the listItem
            listItem.style.cursor = 'pointer'; // Change cursor on hover
            listItem.style.display = 'flex'; // Use flex to align text and button
            listItem.style.alignItems = 'center'; // Center items vertically
            listItem.style.justifyContent = 'space-between'; // Space between symbol and button
            listItem.addEventListener('click', () => updateChartForSymbol(symbol));
            watchlistItems.appendChild(listItem);
            newSymbol.value = ''; // Clear the input after adding
            document.getElementById('stockSymbol').value = symbol; // Update input field to reflect new symbol
            startDataFetch(); // Start fetching data when added to watchlist

    
            const deleteButton = document.createElement('button');
            deleteButton.textContent = 'x';
            deleteButton.style.width = '20px'; // Small square shape
            deleteButton.style.height = '20px'; // Small square shape
            deleteButton.style.lineHeight = '20px'; // Center the 'x' vertically
            deleteButton.style.textAlign = 'center'; // Center the 'x' horizontally
            deleteButton.style.padding = '0'; // Remove padding
            deleteButton.style.marginLeft = '10px'; // Space from the symbol
            deleteButton.style.display = 'none'; // Hide by default
            deleteButton.style.cursor = 'pointer';
            deleteButton.style.border = '1px solid #f0f0f0'; // Optional border
        
    
            // Change background color on hover
        deleteButton.onmouseenter = function() {
            deleteButton.style.backgroundColor = '#646464'; // Darker shade for hover
        };
        deleteButton.onmouseleave = function() {
            deleteButton.style.backgroundColor = '#f5f5f5'; // Original background color
        };

        deleteButton.onclick = function(event) {
            event.stopPropagation();
            listItem.remove();
        };

    
            // Show delete button on hover
            listItem.onmouseenter = function() {
                deleteButton.style.display = 'inline';
            };
            listItem.onmouseleave = function() {
                deleteButton.style.display = 'none';
            };
    
            listItem.appendChild(deleteButton); // Append the button to the list item
            watchlistItems.appendChild(listItem); // Append the list item to the watchlist
            newSymbol.value = ''; // Clear the input after adding
        }
        
if (addToWatchlistButton) {
    addToWatchlistButton.addEventListener('click', addToWatchlist);
// Event listener for keypress on the newSymbol input
    newSymbol.addEventListener('keypress', function(event) {
        if (event.key === 'Enter') {
            addToWatchlist();
        }
    })}}
        
};




async function loadChartData(symbol, startDate, endDate, timeframe) {
    console.log('Loading chart data for:', currentSymbol, startDate, endDate);
    // Show the countdown display
    const countdownDisplay = document.getElementById('countdownDisplay');
    countdownDisplay.style.display = "block"; // Make countdown visible
    resetCountdown(30); // Start with a 30 second countdown


    let allBars = [];
    let nextPageToken = null;
    let baseUrl = `https://data.alpaca.markets/v2/stocks/bars?symbols=${symbol}&timeframe=${timeframe}&start=${startDate}&end=${endDate}&limit=10000&adjustment=raw&feed=sip&sort=asc`;

    const options = {
        method: 'GET',
        headers: {
            'APCA-API-KEY-ID': alpaca.apiKey,
            'APCA-API-SECRET-KEY': alpaca.secretKey,
            'Content-Type': 'application/json'
        }
    };

    do {
        let url = baseUrl; // Start with the base URL each time
        if (nextPageToken) {
            url += `&page_token=${nextPageToken}`; // Append the next page token to the URL if it exists
        }

        try {
            const response = await fetch(url, options);
            if (!response.ok) {
                throw new Error(`Failed to fetch data from API: ${response.statusText}`);
            }

            const data = await response.json();
            console.log('Data received:', data);
            const bars = data.bars[symbol];
            if (bars && bars.length > 0) { // Ensure there are bars to process
                allBars = allBars.concat(bars);
                nextPageToken = data.next_page_token;
            } else {
                console.log('No more data or invalid data format.');
                break;
            }

        } catch (error) {
            console.error('Error loading chart data:', error);
            document.getElementById('chartTitle').textContent = `Error loading data for ${symbol}`;
            return; // Stop loading further data if an error occurs
        }

    } while (nextPageToken);

    if (allBars.length === 0) {
        console.error('No data received after processing all pages.');
        document.getElementById('chartTitle').textContent = `No data available for ${symbol}`;
        return;
    }

    document.getElementById('chartTitle').textContent = `${symbol.toUpperCase()}`; // Ensure symbol is in upper case for display

    if (series) {
        chart.removeSeries(series);
    }

    function convertUTCToUTCMinus4(timeStamp) {
        const date = new Date(timeStamp);
        date.setHours(date.getHours() - 4); // Subtract 4 hours for UTC-4
        return date;
    }

    series = chart.addCandlestickSeries();
    const formattedData = allBars.map(bar => ({
        time: convertUTCToUTCMinus4(bar.t).getTime() / 1000, // Convert to timestamp and adjust to UTC-4
        open: bar.o,
        high: bar.h,
        low: bar.l,
        close: bar.c
    }));

    series.setData(formattedData);
    console.log('Chart data fully loaded and series set for', symbol);
}

function updateChartForSymbol(symbol) {
    currentSymbol = symbol; // Update the global symbol when a new one is selected from the watchlist
    console.log('Updating chart for:', symbol);
    const stockSymbolInput = document.getElementById('stockSymbol');
    const startDate = document.getElementById('startDate').value;
    const endDate = document.getElementById('endDate').value;
    const timeframe = document.getElementById('timeframe').value;
   
    stockSymbolInput.value = currentSymbol; // Update the input field
    startDataFetch(); // Start automatic fetching with the new symbol
    resetCountdown();
}




function startDataFetch() {
    const symbol = currentSymbol;
    if (!currentSymbol) return; // Don't fetch if symbol is empty
    const startDate = document.getElementById('startDate').value;
    const endDate = document.getElementById('endDate').value;
    const timeframe = document.getElementById('timeframe').value;
            document.getElementById('countdownDisplay').classList.remove('show');

    // Clear any existing intervals and timeouts
    clearInterval(dataFetchInterval);
    clearTimeout(countdownTimeout);

    // Function to update chart data
    const updateData = () => {
        console.log(`Fetching data for: ${currentSymbol}`);
        loadChartData(currentSymbol, startDate, endDate, timeframe);
        resetCountdown(30); // Reset countdown whenever data is fetched
    };

    // Fetch data immediately and set an interval to fetch every 30 seconds
    updateData();
    dataFetchInterval = setInterval(updateData, 30000);
}

// Ensure countdown updates
function resetCountdown(duration) {
    clearInterval(countdownTimer);
    countdown = duration || 30; // Reset to 30 seconds by default
    countdownTimer = setInterval(updateCountdown, 1000);
}

function updateCountdown() {
    countdown--;
    countdownDisplay.textContent = "Data Refresh: " + countdown + " seconds";
    if (countdown <= 0) {
        clearInterval(countdownTimer);
        countdownDisplay.style.display = "none"; // Hide when countdown finishes
    }
    };



});


window.onload = function () {
    document.getElementById('startDate').value = getDefaultStartDate();
    //document.getElementById('endDate').value = getDefaultEndDate();
};

function getDefaultStartDate() {
    const today = new Date();
    const last100Days = new Date(today.setDate(today.getDate() - 100));
    return last100Days.toISOString().split('T')[0];
}


// optional function to implement a date range, some APIs require date specifics.
//function getDefaultEndDate() {
//    const today = new Date();
//    return today.toISOString().split('T')[0];
//}
