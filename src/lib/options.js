// Requires jQuery to be included
var FurkForChromeOptions = (function () {

    /// Public methods
    return {
        // Restores select box state to saved value from localStorage.
        restoreOptions: function () {
            var furkApiKey = localStorage["furkForChrome_apiKey"];
            if (!furkApiKey) {
                return;
            }
            var textBox = document.getElementById("furkForChrome_apiKey");
            textBox.value = furkApiKey;
        },
        // Saves options to localStorage.
        saveOptions: function () {
            var textBox = document.getElementById("furkForChrome_apiKey");
            var apiKey = textBox.value;
            localStorage["furkForChrome_apiKey"] = apiKey;
        },
        // Attempts to scrape the API key from Furk
        findApiKey: function () {
            $("#furkForChrome_apiKey").load(FurkAPI.FurkApiPage + " li:contains('Your API key is:')");
        },
        init: function () {
            // Load options from local storage
            FurkForChromeOptions.restoreOptions();

            // Bind options page event handlers

            // 1. Save options on close tab
            chrome.tabs.onRemoved.addListener(FurkForChromeOptions.saveOptions);
        }
    };
}());

window.addEventListener('DOMContentLoaded', function () {
    FurkForChromeOptions.init();
});