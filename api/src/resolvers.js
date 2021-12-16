import { hash, verify } from './auth.js'
import jwt from 'jsonwebtoken'

export default function (ogm, driver) {
  const User = ogm.model('User')
  return {
    Mutation: {
      signUp: async (_source, { email, username, password }) => {
        const session = driver.session()
        try {
          const result = await session.run(
            `MATCH (u:User)
                      WHERE u.username = $username OR u.email = $email
                      RETURN u`,
            { username, email }
          )
          var data = result.records[0]._fields[0].properties
          if (result.records.length == 0) {
            const user = await User.create({
              input: [
                {
                  username,
                  email,
                  password: await hash(password),
                },
              ],
            })
            return createUserToken(user)
          } else {
            if (data.username == username)
              throw new Error(`User with username ${username} already exists!`)
            else throw new Error(`User with email ${email} already exists!`)
          }
        } finally {
          await session.close()
        }
      },
      signIn: async (_source, { usernameOrEmail, password }) => {
        const session = driver.session()
        try {
          const result = await session.run(
            `MATCH (u:User)
                      WHERE u.username = $usernameOrEmail OR u.email = $usernameOrEmail
                      RETURN u`,
            { usernameOrEmail }
          )

          if (result.records.length == 0) {
            throw new Error(
              `User with username/email ${usernameOrEmail} not found!`
            )
          }

          var data = result.records[0]._fields[0].properties

          if (!verify(password, data.password)) {
            throw new Error(`Incorrect password for user  ${usernameOrEmail}!`)
          }
          return createUserToken(data)
        } finally {
          await session.close()
        }
      },
    },
  }
}

function createUserToken(user) {
  return {
    accessToken: createJWT(user, '1h'),
    username: user.username,
  }
}

function createJWT(user, time) {
  return jwt.sign(
    {
      username: user.username,
      id: user._id,
    },
    process.env.GRAPHQL_SERVER_SECRET,
    { expiresIn: time }
  )
}
