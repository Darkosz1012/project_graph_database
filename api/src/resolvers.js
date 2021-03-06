import { hash, verify, authenticateToken } from './auth.js'
import jwt from 'jsonwebtoken'

export default function (ogm, driver) {
  const User = ogm.model('User')
  const Post = ogm.model('Post')
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
            var data = result.records[0]._fields[0].properties
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
          console.log(data)
          if (!verify(password, data.password)) {
            throw new Error(`Incorrect password for user  ${usernameOrEmail}!`)
          }
          return createUserToken(data)
        } finally {
          await session.close()
        }
      },
      refreshToken: async (_source, { refreshToken }) => {
        authenticateToken(refreshToken)
        var data = jwt.decode(refreshToken)
        return createUserTokenWithoutRefresh(data, refreshToken)
      },
      createPost: async (_source, { content, onlyFriends }, context) => {
        const post = await Post.create({
          input: {
            content,
            onlyFriends,
            createdBy: {
              connect: { where: { node: { userId: context.jwt.sub } } },
            },
          },
        })
        return post
      },
      createInvitationToFriends: async (_source, { userId }, context) => {
        const user = await User.update({
          where: { userId: userId },
          connect: {
            invitationToFriends: {
              where: { node: { userId: context.jwt.sub } },
            },
          },
        })
        return true
      },
      declineFriendInvitation: async (_source, { userId }, context) => {
        const user = await User.update({
          where: { userId: context.jwt.sub },
          disconnect: {
            invitationToFriends: {
              where: { node: { userId: userId } },
            },
          },
        })
        return true
      },
      acceptFriendInvitation: async (_source, { userId }, context) => {
        await User.update({
          where: { userId: context.jwt.sub },
          disconnect: {
            invitationToFriends: {
              where: { node: { userId: userId } },
            },
          },
          connect: {
            friends: {
              where: { node: { userId: userId } },
            },
          },
        })
        await User.update({
          where: { userId: userId },
          connect: {
            friends: {
              where: { node: { userId: context.jwt.sub } },
            },
          },
        })
        return true
      },
    },
  }
}

function createUserToken(user) {
  return {
    accessToken: createJWT(user, '60m'),
    refreshToken: createJWT(user, '1h'),
    username: user.username,
  }
}
function createUserTokenWithoutRefresh(user, refreshToken) {
  return {
    accessToken: createJWT(user, '10m'),
    refreshToken: refreshToken,
    username: user.username,
  }
}

function createJWT(user, time) {
  return jwt.sign(
    {
      username: user.username,
      sub: user.userId,
      email: user.email,
    },
    process.env.GRAPHQL_SERVER_SECRET,
    { expiresIn: time }
  )
}
