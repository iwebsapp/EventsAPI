'use strict'

const Debug = require('debug')
const config = require('../config')
const usersModel = require('../models/users-model')
const jwt = require('jsonwebtoken')
const helper = require('sendgrid').mail
const guard = require('express-jwt-permissions')()
const debug = new Debug(`${config.settings.name}:functions:users`)
const chalk = require('chalk')
const async = require('async')
const fs = require('fs')

// function find user by email
function findUserByEmail (email) {
  let arrayUser = []
  for (var i = 0; i < usersModel.users.length; i++) {
    if (usersModel.users[i].email == email) {
      arrayUser.push(usersModel.users[i])
    }
  }
  return arrayUser
}

// function find user by passoword
function findUserByPassword (pass) {
  for (var i = 0; i < usersModel.users.length; i++) {
    if (usersModel.users[i].password == pass) {
      return true
    }
  }
  return false
}

// function create token from user
function createToken (user) {
  const users = {
    idUser: user.idUser,
    permissions: user.permissions
  }
  return jwt.sign({ users }, config.settings.secret, { expiresIn: config.settings.exp })
}

//function verify token
function verifyToken (token) {
  return jwt.verify(token, config.settings.secret, (err, auth) => {
    if(err){
      return 'This token is invalid'
    } else {
      return 'Correct verification'
    }
  })
}


//meet information the jwt
function meetInfoToken(token){
  const tokenArray = token.split(".")
  const tokenString = tokenArray[1].toString()
  const tokenDesencryp = Buffer.from(tokenString, 'base64').toString()
  const tokenObject = JSON.parse(tokenDesencryp)
  return tokenObject.users
}

// function send email with create user
function sendEmail (
  parentCallback,
  fromEmail,
  toEmails,
  subject,
  textContent,
  htmlContent
) {
  const errorEmails = []
  const successfulEmails = []
  const sg = require('sendgrid')('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')
  async.parallel([
    function (callback) {
      // Add to emails
      for (let i = 0; i < toEmails.length; i += 1) {
        // Add from emails
        const senderEmail = new helper.Email(fromEmail)
        // Add to email
        const toEmail = new helper.Email(toEmails[i])
        // HTML Content
        const content = new helper.Content('text/html', htmlContent)
        const mail = new helper.Mail(senderEmail, subject, toEmail, content)
        var request = sg.emptyRequest({
          method: 'POST',
          path: '/v3/mail/send',
          body: mail.toJSON()
        })
        sg.API(request, function (error, response) {
          // console.log('SendGrid');
          if (error) {
            console.log('Error response received')
          }
          // console.log(response.statusCode);
          // console.log(response.body);
          // console.log(response.headers);
        })
      }
      callback(null, true)
    }
  ], function (err, results) {
    console.log('Done')
  })
  parentCallback(null, {
    successfulEmails: successfulEmails,
    errorEmails: errorEmails
  })
}

// function create new user
export const createUserFunction = (req, res, next) => {
  const { email, password } = req.body
  const user = findUserByEmail(email)
  const allUsers = usersModel['users']
  if (user.length == 0) {
    user.idUser = +new Date()
    user.email = email
    user.password = password
    user.createdAt = new Date()
    user.state = -1
    user.avatar = 'default.png'
    user.permissions = {
      free: true
    }

    async.parallel([
      function (callback) {
        sendEmail(
          callback,
          'support@gloomitty.com',
          [user.email],
          'Bienvenido a ' + config.settings.name,
          'Bienvenido a ' + config.settings.name,
          '<p style="font-size: 32px;">Bienvenido</p>'
        )
      }
    ], function (err, results) {
      if (!err) {
        req.message = 'Create success'
        allUsers.push(user)
        next()
      } else {
        res.status(202).json({ message: 'An error has occurred, the email has not been sent' })
      }
    })
  } else {
    res.status(202).json({ message: 'This user already exist' })
  }
}

// funcion login user
export const loginUserFunction = (req, res, next) => {
  const { email, password } = req.body
  const secret = config.settings.secret
  const user = findUserByEmail(email)

  if (user.length > 0) {
    if (user[0].state === 0 || user[0].state === 1) {
      const valid = findUserByPassword(password)
      if (!valid) {
        debug('the passwords do not match')
        res.status(400).json({ message: 'The password do not match' })
      } else {
        const token = createToken(user[0])
        req.message = 'Login success'
        req.token = token
        req.idUser = user.idUser
        next()
      }
    } else {
      res.status(500).json({ message: 'This user not has been activated' })
    }
  } else {
    debug(`User with email ${email} not found`)
    res.status(404).json({ message: 'User not found' })
  }
}

export const uploadAvatarUserFunction = (req, res, next) => {
  if (req.files.avatar === undefined) {
    user.avatar = 'default.png'
  } else {
    const imgName = user.idUser
    const extensionImage = req.files.avatar.name.split('.').pop()
    fs.rename(req.files.avatar.path, 'server/images/' + imgName.idUser + '.' + extensionImage)
    user.avatar = imgName.idUser + '.' + extensionImage
  }
}

export const activateUserFunction = (req,res, next) => {
  const token = req.params.id
  const verify = verifyToken(token)
  if (verify == "Correct verification"){
    const idU = meetInfoToken(token)
    for (var i = 0; i < usersModel["users"].length; i++){
        if (usersModel["users"][i].idUser == idU.idUser){
            const user = usersModel["users"][i]
            user.state = 0
            usersModel["users"].splice(i, 1, user)
        }
    }
    req.message = "This user has been activated with success"
    next()
  } else {
    res.status(401).json({ message: 'This token is invalid' })
  }
}



export const changeEmailUserFunction = (req,res, next) => {
  const token = req.token
  const data = req.body
  const user = findUserByEmail(data["email"])
  debug(user)
  if (user.length > 0) {
    res.status(400).json({ message: 'This email already exists' })
  } else {
    const verify = verifyToken(token)
    if (verify == "Correct verification"){
      const idU = meetInfoToken(token)
      for (var i = 0; i < usersModel["users"].length; i++){
          if (usersModel["users"][i].idUser == idU.idUser){
              const user = usersModel["users"][i]
              user.email = data.email
              usersModel["users"].splice(i, 1, user)
          }
      }
      req.message = "The email has been changed with this user"
      next()
    } else {
      res.status(401).json({ message: 'This token is invalid' })
    }
  }
}



export const changePasswordUserFunction = (req,res, next) => {
  const token = req.token
  const data = req.body
  const verify = verifyToken(token)
  if (verify == "Correct verification"){
    const idU = meetInfoToken(token)
    for (var i = 0; i < usersModel["users"].length; i++){
        if (usersModel["users"][i].idUser == idU.idUser){
            const user = usersModel["users"][i]
            user.password = data.newpass
            usersModel["users"].splice(i, 1, user)
        }
    }
    req.message = "The password has been changed with this user"
    next()
  } else {
    res.status(401).json({ message: 'This token is invalid' })
  }
}

export const changeBirthdayUserFunction = (req,res, next) => {
  const token = req.token
  const data = req.body
  const verify = verifyToken(token)
  if (verify == "Correct verification"){
    const idU = meetInfoToken(token)
    for (var i = 0; i < usersModel["users"].length; i++){
        if (usersModel["users"][i].idUser == idU.idUser){
            const user = usersModel["users"][i]
            user.birthday = data.birthday
            usersModel["users"].splice(i, 1, user)
        }
    }
    req.message = "The birthday has been changed with this user"
    next()
  } else {
    res.status(401).json({ message: 'This token is invalid' })
  }
}



// FORMAT OF TOKEN
// Authorization <access_token>
export const verifyHeadersTokenFunction = (req,res, next) => {
   const bearerHeader = req.headers['authorization']
   if(typeof bearerHeader !== 'undefined') {
       req.token = bearerHeader
       next()
   } else {
       res.status(403).json({ message: 'This not is a token' })
   }
}
