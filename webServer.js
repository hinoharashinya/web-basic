const net = require('net')
const fs = require('fs')

const PORT = 3000

const helloResponse = `HTTP/1.1 200 OK
content-length: 152

<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Document</title>
</head>
<body>
    <h1>hello</h1>
</body>
</html>
`

net
  // 接続されたら何をするか設定する
  .createServer((socket) => {
    // まずは接続されたことを表示する
    console.log('connected')

    // データを受け取ったら何をするかを設定する
    socket.on('data', (data) => {
      // 受け取ったデータに関係なく固定の値を返す
      //socket.write(helloResponse)
      const httpRequest = data.toString()
      const requestLine = httpRequest.split('\r\n')[0]
        console.log(requestLine)
      const path = requestLine.split(' ')[1]
      console.log(path)
      const filePath = path.endsWith('/') ? path + 'index.html' : path
      if(fs.existsSync(`.${filePath}`)){
        const fileContent = fs.readFileSync(`.${filePath}`)
        const httpResponse = `HTTP/1.1 200 OK
content-length: ${fileContent.length}

${fileContent}`
        socket.write(httpResponse)
      }else{
        const httpResponse = `HTTP/1.1 404 Not Fount
content-length: 0

`
        socket.write(httpResponse)
      }
        
    })

    // 接続が閉じたら何をするか設定する
    socket.on('close', () => {
      console.log(`connection closed`)
    })
  })
  // ポートを指定して、サーバを起動する
  .listen(PORT, '127.0.0.1')

// サーバが起動したことを表示する
console.log(`Server started on port ${PORT}`)
