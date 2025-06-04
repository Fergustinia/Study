const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
  // Получаем токен из заголовка
  const token = req.header('x-auth-token');

  // Проверяем наличие токена
  if (!token) {
    return res.status(401).json({ message: 'No token, authorization denied' });
  }

  try {
    // Проверяем токен
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded.user;
    next();
  } catch (error) {
    res.status(401).json({ message: 'Token is not valid' });
  }
}; 