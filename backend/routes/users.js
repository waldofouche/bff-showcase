const router = require('express').Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
let User = require('../models/user.model');
const auth = require('../middleware/auth');

/* GET Users */
router.route('/list').get((req, res) => {
  User.find()
    .then(users => res.json(users))
    .catch(err => res.status(400).json('Error: ' + err));
});


/* GET Unique User */
router.get("/", auth, async (req,res) => {
  const user = await User.findById(req.user);
  res.json({
    displayName: user.displayName,
    id: user._id
  });
});

/* REGISTER Users  */
router.post("/register", async (req, res) => {
  try {
    let { email, password, passwordCheck, displayName, priveldgeType } = req.body;

    // validate

    if (!email || !password || !passwordCheck || !priveldgeType)
      return res.status(400).json({ msg: "Not all fields have been entered." });
    if (password.length < 5)
      return res
        .status(400)
        .json({ msg: "The password needs to be at least 5 characters long." });
    if (password !== passwordCheck)
      return res
        .status(400)
        .json({ msg: "Enter the same password twice for verification." });

    const existingUser = await User.findOne({ email: email });
    if (existingUser)
      return res
        .status(400)
        .json({ msg: "An account with this email already exists." });

    if (!displayName) displayName = email;

    const salt = await bcrypt.genSalt();
    const passwordHash = await bcrypt.hash(password, salt);

    const newUser = new User({
      email,
      password: passwordHash,
      displayName,
      priveldgeType,
    });
    
    // Save user to db
    const savedUser = await newUser.save();
    res.json(savedUser);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/* LOGIN User */
router.post("/login", async (req,res) => {
  try {
    const {email,password} = req.body;

    // Validate

    if (!email || !password)
     return res.status(400).json({msg: "Not all fields have been entered."});
    
      // Check if email is associated with an existing account
    const user = await User.findOne({email: email});
    if (!user)
     return res.status(400)
      .json({msg: "No account with this email address has been registered."});
    
      // Check if password is correct
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch)
     return res.status(400).json({msg: "Invalid Credentials"});
    
     // Sign the JWT
    const token = jwt.sign({id: user._id}, process.env.JWT_SECRET);
    res.json({
      token,
      user: {
        id: user._id,
        displayName: user.displayName,
        email: user.email
      }
    })

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
})

/* DELETE User */
router.delete("/delete", auth, async (req,res) => {
  try{
    const deletedUser = await User.findByIdAndDelete(req.user);
    res.json(deletedUser);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
})

/* Verify Token and User -> check if logged in  */
router.post("/tokenIsValid", async(req,res) => {
  try{

    // Checks if a jwt token is recieved
    const token = req.header("x-auth-token");
    if (!token) return res.json(false);

    // Checks it token is legi
    const verified = jwt.verify(token, process.env.JWT_SECRET);
    if (!verified) return res.json(false);

    // Checks if User exists
    const user = await User.findById(verified.id);
    if (!user) return res.json(false);

    // If both return true, user is logged in
    return res.json(true);

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
})
module.exports = router;