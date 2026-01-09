const asyncHnadler  = (requestHandler) => {
  return (req, res, next) => {
    Promise.resolve(requestHandler(req, res, next)).catch((err) => {
     
      if (err.name === 'CastError') {
        return res.status(400).json({ error: 'Invalid ID format' });
      }

      if (err.name === 'ValidationError') {
        return res.status(400).json({
          error: 'Validation error',
          details: err.errors,
        });
      }

      if (err.code === 11000) {
        return res.status(400).json({
          error: 'Duplicate key error',
          field: Object.keys(err.keyValue),
        });
      }

      next(err);
    });
  };
};

export { asyncHnadler  };
