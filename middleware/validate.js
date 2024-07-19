
module.exports = (validator) => {
  return (req, res, next) => {
    const { error } = validator(req.body);
    if (error) return res.status(400).send("يوجد خطأ بالمدخلات");
    next();
  }
}
