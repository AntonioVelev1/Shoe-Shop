function errorHandler(err, req, res, next) {
    if(err.status === 404) {
        res.status(404)
        .json({ message: 'Not Found'})
    }
    else if(err.status === 401) {
        res.status(401)
        .json({ message: 'Unauthorized' })
    }
    else if(err.status === 333) {
        res.status(333)
        .json({ message: 'Not allowed' })
    }
    else if(err.status === 500) {
        res.status(500)
        .json({ message: 'Something went wrong' })
    }
}

module.exports = errorHandler;