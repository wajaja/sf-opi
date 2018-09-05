module.exports = {
    path: '/posts/:id',

    /**
     * getComponent
     * @param location
     * @param cb {Function} callback
     */
    getComponent(location, cb) {
        cb(null, require('./Opinion').default)
    },
}