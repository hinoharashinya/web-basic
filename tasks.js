const tableBody = document.getElementById('table-body')
const inputTitle = document.getElementById('title')
const addButton = document.getElementById('add-button')

const getTasks = async () => {
  const res = await fetch('/api/tasks')
  const resBody = await res.json()
  console.log(resBody)

  while(tableBody.firstChild){
    tableBody.removeChild(tableBody.firstChild)
  }

  resBody.forEach((task) => {
    const titleElement = document.createElement('td')
    titleElement.innerHTML = task.title

    const dateElement = document.createElement('td')
    dateElement.innerHTML = task.date

    const trElemment = document.createElement('tr')
    trElemment.appendChild(titleElement)
    trElemment.appendChild(dateElement)

    tableBody.appendChild(trElemment)
  })
}

const createTask = async () => {
  const value = inputTitle.value
  console.log(value)

  const requestBody = {
    title: value
  }

  await fetch('/api/tasks',{
    method: 'POST',
    body: JSON.stringify(requestBody)
  })

  await getTasks()
}

const validate = async() => {
  const value = inputTitle.value

  addButton.disabled = value.length === 0
}

const main = async() => {
  await getTasks()
  title.addEventListener('input', validate)
  addButton.addEventListener('click', createTask)
}

main()