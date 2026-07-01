const tenantMiddleware = (req, res, next) => {
  req.tenant = {
    tenant_id: req.user.tenant_id,
  };

  next();
};

module.exports = tenantMiddleware;
