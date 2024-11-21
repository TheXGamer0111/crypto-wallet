import { body, param, validationResult } from 'express-validator';

export const validateRequest = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next();
};

export const walletValidationRules = [
  body('address').isString().notEmpty(),
  body('type').isIn(['ETH', 'BTC']),
  body('userId').isMongoId()
];

export const transactionValidationRules = [
  body('hash').isString().notEmpty(),
  body('from').isString().notEmpty(),
  body('to').isString().notEmpty(),
  body('value').isString().notEmpty(),
  body('network').isString().notEmpty()
]; 