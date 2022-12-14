const fs = require('fs')
const http = require('http')
const uid = require('uid-safe').sync

const sessions = {}

const PORT = 8080

const tasks = [
  {
    title: 'フロントエンドの実装',
    date: '2022/12/11',
  },
  {
    title: 'バックエンドの実装',
    date: '2022/12/12',
  }
]

const users = [
  {
    id:1,
    name:'alice',
  },
  {
    id:2,
    name:'bob',
  },
]

const getTasksHTML = () => {
  return `<!DOCTYPE html>
  <html lang="en">
  <head>
      <meta charset="UTF-8">
      <meta http-equiv="X-UA-Compatible" content="IE=edge">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Tasks</title>
  </head>
  <body>
      <h1>タスク一覧</h1>
      <a href="/tasks/new.html">タスク登録へ</a>
      <table>
        <thead>
          <tr>
            <th>タイトル</th>
            <th>作成日時</th>
          </tr>
        </thead>
        <tbody>
          ${tasks.map(task => (
            `<tr>
              <td>${task.title}</td>
              <td>${task.date}</td>
            </tr>`
          ))}          
        </tbody>
      </table>
  </body>
  </html>
  `
  //return fs.readFileSync('./mydir/tasks.html')
}

http.createServer((req,res) => {
  const path = req.url
  const method = req.method

  if(path === '/tasks' && method === 'GET'){
    const content = getTasksHTML()
    res.writeHead(200)
    res.write(content)
    res.end()
    return
  }else if(path === '/tasks' && method === 'POST'){
    let requestBody = ''
    req.on('data', (data) => {
      requestBody  += data
    })
    req.on('end', () => {
      console.log(requestBody)
      const taskTitle = requestBody.split('=')[1]
      const task = {
        title: taskTitle,
        date: new Date()
      }
      tasks.push(task)
      res.writeHead(303, {
        location: '/tasks'
      })
      //res.writeHead(201)
      //const responseBody = getTasksHTML()
      //res.write(responseBody)
      res.end()
    })
    return
  }else if(path === '/api/tasks' && method === 'GET'){
    const resBody = JSON.stringify(tasks)
    res.writeHead(200)
    res.write(resBody)
    res.end()
    return
  }else if(path === '/api/tasks' && method === 'POST'){
    let requestBody = ''
    req.on('data',(data) => {
      requestBody += data
    })

    req.on('end', () => {
      console.log(requestBody)
      const requestBodyJson = JSON.parse(requestBody)
      const title = requestBodyJson.title

      if(title.length < 2){
        res.writeHead(400)
        res.end()
      }

      const newTask = {
        title,
        date: new Date()
      }

      tasks.push(newTask)

      res.writeHead(201)
      res.end()
    })
    return
  }else if(path === '/cookie-sample' && method === 'GET'){
    res.setHeader('Set-Cookie','name=alice')
    res.writeHead(200)
    res.write('set-cooki')
    res.end()
    return
  }else if(path === '/session-start' && method === 'GET'){
    const userId = 1
    const sessionId = uid(24)

    sessions[sessionId] = {
      userId
    }

    res.setHeader('Set-Cookie',`sid=${sessionId}`)
    res.writeHead(200)
    res.write('session start')
    res.end()
    return
  }else if(path === '/me' && method === 'GET'){
    const cookie = req.headers.cookie
    const sessionId = cookie.split('=')[1]

    const userId = sessions[sessionId].userId

    const user = users.find((user) => {
      return user.id === userId
    })

    res.writeHead(200)
    res.write(`userId:${userId},user:${user.name}`)
    res.end()
    return
  }
  res.writeHead(404)
  res.end()
}).listen(PORT, '127.0.0.1')