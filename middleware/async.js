/**
 * Create a wrapper function for async middleware
 * with error handling
 *
 * @param fn the function to wrap
 * @returns {function(*=, *=, *=): Promise<unknown>}
 */
let asyncHandler = fn => (req, res, next) =>
    Promise.resolve(fn(req, res, next)).catch(next);
module.exports = asyncHandler;

