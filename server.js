import jsonServer from 'json-server'

const PORT = 4000

const server = jsonServer.create()
const router = jsonServer.router('db.json')
const middlewares = jsonServer.defaults()

server.use(middlewares)
server.use(jsonServer.bodyParser)

server.post('/login', (req, res) => {
  const { email, password } = req.body

  const user = router.db.get('users').find({ email, password }).value()

  if (!user) {
    res.status(401).json({ message: 'Invalid email or password' })
    return
  }

  const safeUser = { ...user }
  delete safeUser.password

  res.status(200).json({
    accessToken: 'dummy-access-token',
    refreshToken: 'dummy-refresh-token',
    user: safeUser,
  })
})

server.use(router)

server.listen(PORT, () => {
  console.log(`JSON Server (auth backend) running at http://localhost:${PORT}`)
})
