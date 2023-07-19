const express = require("express");
const middleware = require("../Middleware/authMiddlesware");
const userController = require("../Controllers/userController");
const router = new express.Router();

router.post("/register", userController.register);

router.post("/login", userController.login);

router.get(
   "/get-balance/:acno",
   middleware.jwtMiddleware,
   userController.getBalance
);

router.post(
   "/fund-transfer",
   middleware.jwtMiddleware,
   userController.fundTransfer
);

router.get(
   "/get-transactions",
   middleware.jwtMiddleware,
   userController.getTransactions
);

router.delete(
   "/delete-account",
   middleware.jwtMiddleware,
   userController.deleteAcno
);

module.exports = router;
