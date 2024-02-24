
module.exports = (data, isSuccess, statusCode, count = 0, error = null, message = null) => {
    return {
        data,
        isSuccess,
        statusCode,
        count,
        error,
        message
    }
}