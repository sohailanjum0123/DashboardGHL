const errorHandler = (err, req, res, next) => {
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
  
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
  };
  
 export default errorHandler;
  