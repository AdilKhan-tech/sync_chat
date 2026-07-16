export const requireAdmin = (req, res, next) => {
  console.log("ADMIN CHECK USER:", req.user);

  if (!req.user?.isAdmin) {
    return res.status(403).json({
      message: "Admin access required",
      user: req.user,
    });
  }

  next();
};
