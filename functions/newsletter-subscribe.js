const mailjet = require('node-mailjet')
const jsonschema = require('jsonschema')

const { MJ_APIKEY_PUB, MJ_APIKEY_PRIV } = process.env

const KUBIRDS_LIST_ID = '42515'

const request_schema = {
  type: 'string',
  format: 'email'
}

const validate_request = event => {
  if (!MJ_APIKEY_PUB || !MJ_APIKEY_PRIV) {
    return { statusCode: 500, payload: 'No API key found for MailJet'}
  }
  else if (event.httpMethod !== 'GET') {
    return { statusCode: 400, payload: 'Only GET requests are accepted' }
  }

  const { email } = event.queryStringParameters
  const result = jsonschema.validate(email, request_schema, { required: true })

  if (!result.valid) {
    return {
      statusCode: 400,
      payload: `Invalid mail address: ${result.toString()}`
    }
  }

  return { statusCode: 200, payload: email }
}

const process_request = async mail => {
  const client = mailjet.connect(MJ_APIKEY_PUB, MJ_APIKEY_PRIV)

  try {
    const response = await client
      .post('contactslist', {version: 'v3'})
      .id(KUBIRDS_LIST_ID)
      .action('managecontact')
      .request({
        Action: 'addforce',
        Email: mail
      })

    return {
      statusCode: 200,
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({
        success: true,
        payload: response.body.Data.map(contact => contact.ContactID)
      })
    }
  }
  catch (err) {
    return {
      statusCode: 500,
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({
        success: false,
        payload: `Invalid response from Mailjet: ${err.toString()}`
      })
    }
  }
}

exports.handler = async event => {
  const { statusCode, payload } = validate_request(event)

  switch (statusCode) {
    case 200:
      return await process_request(payload)

    default:
      return {
        statusCode,
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({ success: false, payload })
      }
  }
}
