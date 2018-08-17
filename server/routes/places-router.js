'use strict'

const express = require('express')
const chalk = require('chalk')
const { allPlacesFunction, allMyPlacesFunction,
  verifyHeadersTokenFunction, handleError, handleFatalError  } = require('../functions')
const app = express.Router()
// const guard = require('express-jwt-permissions')()

// route show all places
app.get('/all', verifyHeadersTokenFunction, allPlacesFunction, (req, res, next) => {
  try {
    const { message, data } = req
    if (message === 'List of all places') {
      res.status(200).json({
        status: 200,
        message,
        data
      })
    } else {
      return handleError(res)
    }
  } catch (err) {
    return handleFatalError(res, err)
  }
})


// route show all my places
app.get('/my/all', verifyHeadersTokenFunction, allMyPlacesFunction, (req, res, next) => {
  try {
    const { message, data } = req
    if (message === 'List of all my places') {
      res.status(200).json({
        status: 200,
        message,
        data
      })
    } else {
      return handleError(res)
    }
  } catch (err) {
    return handleFatalError(res, err)
  }
})

// get menu of the places
app.get('/menu/:id', (req, res, next) => {
  // try {
  //   const { message, data } = req
  //   if (message === 'List of all reports') {
  //     res.status(200).json({
  //       status: 200,
  //       message,
  //       data
  //     })
  //   } else {
  //     return handleError(e)
  //   }
  // } catch (e) {
  //   return handleFatalError(e)
  // }
})

// get show information
app.get('/info/:id', (req, res, next) => {
  // try {
  //   const { message, data } = req
  //   if (message === 'This is a report') {
  //     res.status(200).json({
  //       status: 200,
  //       message,
  //       data
  //     })
  //   } else {
  //     return handleError(e)
  //   }
  // } catch (e) {
  //   return handleFatalError(e)
  // }
})

// route show all reviews
app.get('/review/all/:id', (req, res, next) => {
  // try {
  //   const { message } = req
  //   if (message === 'This report has been deleted with success') {
  //     res.status(200).json({
  //       status: 200,
  //       message
  //     })
  //   } else {
  //     return handleError(e)
  //   }
  // } catch (e) {
  //   return handleFatalError(e)
  // }
})



// route new review
app.get('/review/create/:id', (req, res, next) => {
  // try {
  //   const { message } = req
  //   if (message === 'This report has been deleted with success') {
  //     res.status(200).json({
  //       status: 200,
  //       message
  //     })
  //   } else {
  //     return handleError(e)
  //   }
  // } catch (e) {
  //   return handleFatalError(e)
  // }
})



// route show all coupons
app.get('/coupons/all/:id', (req, res, next) => {
  // try {
  //   const { message } = req
  //   if (message === 'This report has been deleted with success') {
  //     res.status(200).json({
  //       status: 200,
  //       message
  //     })
  //   } else {
  //     return handleError(e)
  //   }
  // } catch (e) {
  //   return handleFatalError(e)
  // }
})


// route show all promotions
app.get('/promotions/all/:id', (req, res, next) => {
  // try {
  //   const { message } = req
  //   if (message === 'This report has been deleted with success') {
  //     res.status(200).json({
  //       status: 200,
  //       message
  //     })
  //   } else {
  //     return handleError(e)
  //   }
  // } catch (e) {
  //   return handleFatalError(e)
  // }
})


// route show all product
app.get('/products/all/:id', (req, res, next) => {
  // try {
  //   const { message } = req
  //   if (message === 'This report has been deleted with success') {
  //     res.status(200).json({
  //       status: 200,
  //       message
  //     })
  //   } else {
  //     return handleError(e)
  //   }
  // } catch (e) {
  //   return handleFatalError(e)
  // }
})


// route show guaranteed
app.get('/guaranteed/all/:id', (req, res, next) => {
  // try {
  //   const { message } = req
  //   if (message === 'This report has been deleted with success') {
  //     res.status(200).json({
  //       status: 200,
  //       message
  //     })
  //   } else {
  //     return handleError(e)
  //   }
  // } catch (e) {
  //   return handleFatalError(e)
  // }
})



// route show guaranteed items
app.get('/guaranteed/items/:id', (req, res, next) => {
  try {
    const { message } = req
    if (message === 'This report has been deleted with success') {
      res.status(200).json({
        status: 200,
        message
      })
    } else {
      return handleError(e)
    }
  } catch (e) {
    return handleFatalError(e)
  }
})


// route new guaranteed
app.get('/guaranteed/create/:id', (req, res, next) => {
  // try {
  //   const { message } = req
  //   if (message === 'This report has been deleted with success') {
  //     res.status(200).json({
  //       status: 200,
  //       message
  //     })
  //   } else {
  //     return handleError(e)
  //   }
  // } catch (e) {
  //   return handleFatalError(e)
  // }
})


// route cancel guaranteed
app.get('/guaranteed/cancel/:id', (req, res, next) => {
  // try {
  //   const { message } = req
  //   if (message === 'This report has been deleted with success') {
  //     res.status(200).json({
  //       status: 200,
  //       message
  //     })
  //   } else {
  //     return handleError(e)
  //   }
  // } catch (e) {
  //   return handleFatalError(e)
  // }
})



  // route show one product
  app.get('/product/:id', (req, res, next) => {
    // try {
    //   const { message } = req
    //   if (message === 'This report has been deleted with success') {
    //     res.status(200).json({
    //       status: 200,
    //       message
    //     })
    //   } else {
    //     return handleError(e)
    //   }
    // } catch (e) {
    //   return handleFatalError(e)
    // }
  })


export default app