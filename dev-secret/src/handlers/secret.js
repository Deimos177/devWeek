const {
  v4: uuidv4
} = require('uuid')

require('../resources/db/connection')()

const draw = require('../utils/draw')

const secretModel = require('../resources/db/models/secret')

module.exports.create = async (event, context) => {
  context.callbacksWaitsForEmptyEventLoop = false

  const {
    name,
    email
  } = JSON.parse(event.body)
  const externalId = uuidv4()
  const adminKey = uuidv4()

  try {
    await secretModel.create({
      owner: name,
      ownerEmail: email,
      externalId,
      adminKey,
    })

    return {
      statusCode: 201,
      body: JSON.stringify({
        success: true,
        id: externalId,
        adminKey
      })
    }
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({
        success: false
      })
    }
  }
}
module.exports.get = async (event, context) => {
  context.callbacksWaitsForEmptyEventLoop = false

  const {
    id: externalId
  } = event.pathParameters
  const incomingAdminKey = event.headers['adminKey']

  try {
    const {
      participants,
      adminKey,
      drawResults
    } = await secretModel.findOne({
      externalId
    }).select('-_id participants adminKey drawResults').lean()

    const isAdmin = !!(incomingAdminKey && incomingAdminKey === adminKey)

    const result = {
      participants,
      hasDrew: !!drawResults.length,
      isAdmin
    }

    return {
      statusCode: 200,
      body: JSON.stringify({
        result
      })
    }

  } catch (error) {
    console.log(error)
    return {
      statusCode: 500,
      body: JSON.stringify({
        success: false
      })
    }
  }
}
module.exports.draw = async (event, context) => {
  context.callbacksWaitsForEmptyEventLoop = false

  const {
    id: externalId
  } = event.pathParameters
  const adminKey = event.headers['admin-key']

  try {
    const secret = await secretModel.findOne({
      externalId,
      adminKey
    }).select('participants ownerEmail').lean()

    if (!secret) {
      throw new Error()
    }

    const drawResult = draw(secret.participants)
    const drawMap = drawResult.map((result) => {
      return {
        giver: result.giver.externalId,
        receiver: result.receiver.externalId
      }
    })

    await secretModel.updateOne(
      {
        _id: secret._id,
      },
      {
        drawResults: drawMap
      }
    )

    return {
      statusCode: 200,
      body: JSON.stringify({
        drawResult,
        success: true
      })
    }

  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({
        success: false
      })
    }
  }
}