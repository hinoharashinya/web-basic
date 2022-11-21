const fs = require('fs')
const http = require('http')

const PORT = 3000

http.createServer((req,res) => {
  const path = req.url
  const method = req.method
  const headers = req.headers
  const filePath = path.endsWith('/') ? path + 'index.html' : path

  if(!fs.existsSync(`.${filePath}`) ||
  fs.statSync(`.${filePath}`).isDirectory() ||
  method !== 'GET'){
    console.log("appl",filePath,method)
    const requestOptions = {
      method,
      path,
      headers,
    }
    const taskAppliServer = http.request(
      'http://localhost:8080',
      requestOptions
    )
    req.on('data', (data) => {
      taskAppliServer.write(data)
    })
    taskAppliServer.on('response', (appliRes) => {
      Object.entries(appliRes.headers).forEach((header) => {
        res.setHeader(header[0], header[1])
      })
      res.writeHead(appliRes.statusCode)
      appliRes.on('data', (data) => {
        res.write(data)
      })
      appliRes.on('end', () => {
        res.end()
      })
    })
    req.on('end', () => {
      taskAppliServer.end()
    })
    //res.writeHead(404)
    //res.end()
  }else{
    console.log(filePath)
    const fileContent = fs.readFileSync(`.${filePath}`)
    res.writeHead(200)
    res.write(fileContent)
    res.end()
  }
}).listen(PORT, '127.0.0.1')