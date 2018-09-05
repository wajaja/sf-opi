import _ from 'lodash';

class Database {
    constructor() {
        this.events = {};
    }

    on(event, fn) {
        if (this.events[event]) this.events[event].push(fn);
        else this.events[event] = [fn];
        return this;
    }

    
}

export default Database;
