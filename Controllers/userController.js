const users = require("../Model/userSchema");
const jwt = require("jsonwebtoken");

exports.register = async (req, res) => {
   console.log(`Inside the register fuction`);

   const { username, acno, password } = req.body;

   try {
      const result = await users.findOne({ acno });

      if (result) {
         res.status(406).json("User already exists");
      } else {
         const newUser = new users({
            username,
            acno,
            password,
            balance: 5000,
            transactions: [],
         });
         await newUser.save();
         res.status(200).json(newUser);
      }
   } catch (err) {
      res.status(401).json(err);
   }
};

exports.login = async (req, res) => {
   console.log(`Inside login function`);

   const { acno, password } = req.body;

   try {
      const userData = await users.findOne({ acno, password });
      if (userData) {
         const token = jwt.sign({ loginAcno: acno }, "thesecretkey");
         res.status(200).json({
            loginUser: userData,
            token,
         });
      } else {
         res.status(404).json("*Incorrect Account No/Password");
      }
   } catch (err) {
      res.status(401).json(err);
   }
};

exports.getBalance = async (req, res) => {
   const { acno } = req.params;

   try {
      const userData = await users.findOne({ acno });
      if (userData) {
         res.status(200).json(userData.balance);
      } else {
         res.status(404).json("Account not found");
      }
   } catch (err) {
      res.status(401).json(err);
   }
};

exports.fundTransfer = async (req, res) => {
   console.log("Inside fundtransfer");
   const { loginData } = req;
   console.log(loginData);

   const { creditAcno, amount } = req.body;
   let amt = Number(amount);

   try {
      const debitUser = await users.findOne({ acno: loginData });
      console.log(debitUser);

      const creditUser = await users.findOne({ acno: creditAcno });
      console.log(creditUser);

      if (loginData == creditAcno) {
         res.status(406).json("Operation deined!!");
      } else {
         if (creditUser) {
            if (debitUser.balance >= amt) {
               debitUser.balance -= amt;
               debitUser.transactions.push({
                  transaction_type: "DEBIT",
                  transaction_amount: amt,
                  debit_account: loginData,
                  credit_account: creditAcno,
               });
               await debitUser.save();

               creditUser.balance += amt;
               creditUser.transactions.push({
                  transaction_type: "CREDIT",
                  transaction_amount: amt,
                  debit_account: loginData,
                  credit_account: creditAcno,
               });
               await creditUser.save();

               res.status(200).json("Transaction succesful");
            } else {
               res.status(406).json(
                  "Transaction failed... Insufficient balance!"
               );
            }
         } else {
            res.status(404).json(
               "Transacton failed... Invalid credit account details!"
            );
         }
      }
   } catch (err) {
      res.status(401).json(err);
   }
};

exports.getTransactions = async (req, res) => {
   console.log("Inside transactions function");
   const { loginData } = req;
   try {
      const userDetails = await users.findOne({ acno: loginData });
      if (userDetails) {
         const { transactions } = userDetails;
         res.status(200).json(transactions);
      } else {
         res.status(404).json("Invalid account details!");
      }
   } catch (err) {
      res.status(401).json(err);
   }
};

exports.deleteAcno = async (req, res) => {
   const { loginData } = req;
   try {
      await users.deleteOne({ acno: loginData });
      res.status(200).json("Account deleted successfully");
   } catch (err) {
      res.status(401).json(err);
   }
};
