let userFilter = require('../utils/userFilter');
let advancedResults = (model) => async (req,res, next) => {

    // copy the query params object
    let reqQuery = {...req.query};

    // fields to exclude
    let specialFields = ['select', 'sort', 'page', 'limit'];

    // actually remove them from the query
    specialFields.forEach(field => delete reqQuery[field]);

    // mongoose uses $lte, $gt, $lt, etc. for its queries, so we do a little find-and-replace here

    // get the string version
    let queryString = JSON.stringify(reqQuery);

    // add $ to recognized operators
    queryString = queryString.replace(/\b(gt|gte|lt|lte|in)\b/g, match => `$${match}`);

    // get back to the object version
    reqQuery = JSON.parse(queryString);

    // create the query
    let query = userFilter(model.find(reqQuery), req);

    // select fields to include (note that we use the original req.query here)
    if(req.query.select) {
        // convert the commas to spaces which are mongoose standard for selecting fields
        let fields = req.query.select.split(',').join(' ');
        query = query.select(fields);
    }

    // sort results
    if(req.query.sort) {
        let sortBy = req.query.sort.split(',').join(' ');
        query = query.sort(sortBy);
    } else {
        // default sort
        query = query.sort('-createdAt');
    }

    // pagination
    let page = parseInt(req.query.page, 10) || 1;
    let limit = parseInt(req.query.limit, 10) || 100;
    let startIndex = (page-1) * limit;
    let endIndex = page * limit;
    let total = await model.countDocuments(reqQuery);

    query = query.skip(startIndex).limit(limit);

    // run the query and wait for the result
    let items = await query;

    // pagination results
    let pagination = {total};

    if(endIndex < total) {
        pagination.next = {page: page+1, limit}
    }
    if(startIndex > 0) {
        pagination.prev = { page: page-1, limit}
    }

    res.advancedResults = { success: true, count: items.length, pagination, data: items };
    next();
};

module.exports = advancedResults;
