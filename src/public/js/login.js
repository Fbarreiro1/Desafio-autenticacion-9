const form = document.getElementById('formLogin')

form.addEventListener('submit', e => {
  e.preventDefault()

  const data = new FormData(form)
  const obj = {}

  data.forEach((value, key) => obj[key] = value)

  const url = '/auth'
  const headers = {
    'Content-Type': 'application/json'
  }
  const method = 'POST'
  const body = JSON.stringify(obj)

  fetch(url, {
    headers,
    method,
    body
  })
    .then(response => {
      if (response.redirected) {
        window.location.href = response.url;
      } else {
        throw new Error('Unexpected response');
      }
    })
    .catch(error => console.log(error))
})
