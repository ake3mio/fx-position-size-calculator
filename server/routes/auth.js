const express = require('express');
const {account} = require('../core/forex-provider');

const router = express.Router();

router.post('/validate', function (req, res) {

    const {accountId, token} = req.body;

    try {
        account(token).instruments(accountId, undefined, ({body}) => {
            res.json({success: !body.errorMessage});
        });
    } catch (e) {
        res.json({success: false});
    }
});

module.exports = router;
