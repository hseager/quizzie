const WebSocket = require('ws')

export default (req, res) => {
    
    res.statusCode = 200
    res.json({
        type: req.body.type,
        name: req.body.name
    })

}