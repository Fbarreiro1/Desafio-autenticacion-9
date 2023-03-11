const app = require('./index')
const {Server} = require("socket.io")
const { port } = require('./config')
const MessageDao = require('./dao/Message.dao')
const Message = new MessageDao()
let messages = [];



  const HTTTPServer = app.listen(port, () => {
  console.log(`server runnning at port ${port}`)
})



 

