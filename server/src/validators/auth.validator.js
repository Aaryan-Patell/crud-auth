
import {body, validationResult} from "express-validator";

export const registerValidator = [
  body("name")
  .exists().withMessage("Name is required").bail()
    .trim()
    .isLength({ min: 2, max: 100 })
    .notEmpty()
    .withMessage("Name must be between 2 and 100 characters"),
  body("email")
    .exists().withMessage("Email is required").bail()
    .isEmail()
    .normalizeEmail()
    .withMessage("Please provide a valid email"),
  body("password")
    .exists().withMessage("Password is required").bail()
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 characters long"),
  body("confirmPassword")
    .exists().withMessage("Confirm Password is required").bail()
    .custom((value, { req }) => {
      if (value !== req.body.password) {
        throw new Error("Passwords do not match");
      }
      return true;
    }),
    (req, res, next) => {

      const errors = validationResult(req);

      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }
      next();
    }
];

export const loginValidator = [
  body("email")
    .exists().withMessage("Email is required").bail()
    .isEmail()
    .normalizeEmail()
    .withMessage("Please provide a valid email"),
  body("password")
    .exists().withMessage("Password is required").bail()
    .notEmpty()
    .withMessage("Password is required"),

    (req, res, next) => {

      const errors = validationResult(req); 
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }
      next();
    }
];

