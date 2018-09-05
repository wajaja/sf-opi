import createHistory from 'history/createMemoryHistory';

// Create a server history based on a location (path)
export default createServerHistory = (location = '/', base, context) => {
    // We don't have a DOM, so let's create some fake history and push the current path
    return createHistory({ 
        initialEntries: [ location ],   // The initial URLs in the history stack
        initialIndex: 0,                // The starting index in the history stack
        // keyLength: 6,                   // The length of location.key
        // A function to use to confirm navigation with the user. Required
        // if you return string prompts from transition hooks (see below)
        getUserConfirmation: null
    });
};  