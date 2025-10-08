function requireUser(req, res, next) {
  const userId = req.header("x-user-id");
  if (!userId) return res.status(401).json({ error: "Falta x-user-id" });
  req.user = { id: userId };
  next();
}

module.exports = { requireUser };
