export default function ({ redirect }) {
  console.log('Middleware Auth ejecutándose...')

  if (process.server) return

  const user = localStorage.getItem('user')
  console.log('Usuario encontradoxd:', user)

  if (!user) {
    console.log('No hay usuario, redirigiendo...')
    // return redirect('https://personalcount-85a4a.web.app/auth/login')
    return redirect('http://localhost:3000/auth/login')
  }
}
