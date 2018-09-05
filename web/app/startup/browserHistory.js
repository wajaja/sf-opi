import createHistory        from 'history/createBrowserHistory'

export default createHistory({
    basename: '/app_dev.php', // The base URL of the app (see below)
    forceRefresh: true,      // Set true to force full page refreshes
    keyLength: 12,             // The length of location.key
    // A function to use to confirm navigation with the user (see below)
    //getUserConfirmation: (message, callback) => callback(window.confirm(message))
});