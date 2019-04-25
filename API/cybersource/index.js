import { apiStatus } from '../../../lib/util'
import { Router } from 'express'
import cybersourceRestApi from 'cybersource-rest-client'

module.exports = ({ config, db }) => {
  let csApi = Router()

  /**
   *  Generate a one-time use public key and key ID to encrypt the card number
   *  in the follow-on Tokenize Card request.
   *  The key used to encrypt the card number on the cardholder’s device or browser is
   *  valid for 15 minutes and must be used to verify the signature in the response message.
   *  CyberSource recommends creating a new key for each order.
   *  Generating a key is an authenticated request initiated from your servers,
   *  prior to requesting to tokenize the card data from your customer’s device or browser.
   */
  csApi.get('/generate-key', (req, res) => {
    try {
      var instance = new cybersourceRestApi.KeyGenerationApi(config.extensions.cybersource.configObj)

      var request = new cybersourceRestApi.GeneratePublicKeyRequest()
      request.encryptionType = config.extensions.cybersource.encryptionType
      request.targetOrigin = config.extensions.cybersource.targetOrigin

      var options = {
        'generatePublicKeyRequest': request
      }

      instance.generatePublicKey(options, (error, data, response) => {
        if (error) {
          apiStatus(res, error, 500)
        } else if (data) {
          apiStatus(res, {key: data.jwk}, 200)
        } else {
          apiStatus(res, response, 500)
        }
      })
    } catch (error) {
      apiStatus(res, error, 500)
    }
  })

  return csApi
}
