// TODO REFACTOR REQUEST remove this logic and render a csrftoken
// into an http-only cookie using next-csrf, which can then be picked up
// by django views. That's a more secure approach because JS can't hijack
// the csrf token.

function getCookie(name: string) {
  let cookieValue = null
  if (document.cookie && document.cookie !== '') {
    const cookies = document.cookie.split(';')
    for (let i = 0; i < cookies.length; i++) {
      const cookie = cookies[i].trim()
      // Does this cookie string begin with the name we want?
      if (cookie.substring(0, name.length + 1) === `${name}=`) {
        cookieValue = decodeURIComponent(cookie.substring(name.length + 1))
        break
      }
    }
  }
  return cookieValue
}

export function getCSRFToken() {
  return getCookie('csrftoken')
}
