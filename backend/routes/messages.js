// routes/messages.js
const express = require('express');
const multer = require('multer');
const auth = require('../middleware/auth');
const { sendMessage, uploadFile, getMessages } = require('../controllers/messageController');
const router = express.Router();

const upload = multer({ dest: 'uploads/' });

router.post('/send', auth, sendMessage);
router.post('/upload', auth, upload.single('file'), uploadFile);
router.get('/:conversationId', auth, getMessages);

module.exports = router;