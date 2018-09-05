module.exports = {
    path: '/pictures/:id',

    /**
     * getComponent
     * @param location
     * @param cb {Function} callback
     */
    getComponent(location, cb) {
        cb(null, require('./Picture').default)
    },
}