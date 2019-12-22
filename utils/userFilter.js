module.exports = function userFilter(query, req){
  if(!req.user){
      throw 'User required but not found, did you run the protect middleware?';
  }
  let id = req.user._id;
  query.where('user').equals(id);
  return query;
};
