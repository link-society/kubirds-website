const jsonschema = require('jsonschema')
const fetch = require('node-fetch')
const { SLACK_WEBHOOK = '' } = process.env

const non_empty_string = {type: 'string', minLength: 1}
const request_schema = {
  type: 'object',
  required: [
    'contact_me_by',
    'name', 'mail', 'phone',
    'subject', 'message',
    'days', 'times'
  ],
  properties: {
    contact_me_by: {...non_empty_string, enum: ['mail', 'phone']},
    name: non_empty_string,
    mail: {...non_empty_string, format: 'email'},
    phone: {...non_empty_string, format: 'phone-number'},
    subject: non_empty_string,
    message: non_empty_string,
    days: {type: 'array', items: non_empty_string, minItems: 1},
    times: {type: 'array', items: non_empty_string, minItems: 1}
  }
}

const validate_request = event => {
  if (SLACK_WEBHOOK === '') {
    return { statusCode: 500, payload: 'Missing SLACK_WEBHOOK' }
  }
  else if (event.httpMethod !== 'POST') {
    return { statusCode: 400, payload: 'Only POST requests are accepted' }
  }
  else if (event.headers['content-type'] !== 'application/json') {
    return {
      statusCode: 400,
      payload: 'HTTP header Content-Type is not "application/json"'
    }
  }

  try {
    const payload = JSON.parse(event.body)

    const result = jsonschema.validate(payload, request_schema)

    if (!result.valid) {
      return {
        statusCode: 400,
        payload: `Invalid JSON payload: ${result.toString()}`
      }
    }

    return { statusCode: 200, payload }
  }
  catch (err) {
    return {
      statusCode: 400,
      payload: `Unable to parse JSON body: ${err.toString()}`
    }
  }
}

const process_request = async payload => {
  try {
    const response = await fetch(SLACK_WEBHOOK, {
      method: 'post',
      body: JSON.stringify({
        username: 'kubirds',
        blocks: [
          {
            type: 'section',
            text: {
              type: 'mrkdwn',
              text: `:left_speech_bubble: - *${payload.name}* sent a message from the *<https://kubirds.com|Kubirds>* contact form`
            }
          },
          { type: 'divider' },
          {
            type: 'section',
            text: {
              type: 'mrkdwn',
              text: `:phone: - \`${
                payload.phone || 'none'
              }\`\n:envelope: - \`${
                payload.mail || 'none'
              }\`\n\nI would like to be contacted on: *${
                payload.days.join(', ')
              }*\nBetween: *${
                payload.times.join(', ')
              }*\nBy ${payload.contact_me_by}`
            }
          },
          { type: 'divider' },
          {
            type: 'section',
            text: {
              type: 'mrkdwn',
              text: `*Subject:*\n${payload.subject}`
            }
          },
          {
            type: 'section',
            text: {
              type: 'mrkdwn',
              text: `*Message:*\n${
                payload.message
                  .split('\n')
                  .map(line => `> ${line}`)
                  .join('\n')
              }`
            }
          }
        ]
      }),
      headers: {'Content-Type': 'application/json'}
    })

    if (!response.ok) {
      return {
        statusCode: 500,
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({
          success: false,
          payload: `Invalid response from Slack: ${response.statusText}`
        })
      }
    }
  }
  catch (err) {
    return {
      statusCode: 500,
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({
        success: false,
        payload: `Unable to send request to Slack: ${err.toString()}`
      })
    }
  }

  return {
    statusCode: 200,
    headers: {'Content-Type': 'application/json'},
    body: JSON.stringify({ success: true, payload: null })
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
