module.exports = {
    path: '/photos/:id',

    /**
     * getComponent
     * @param location
     * @param cb {Function} callback
     */
    getComponent(location, cb) {
        cb(null, require('./Photo').default)
    },
}