import { apiStatus, apiError } from '../../../lib/util';
import { Router } from 'express';
import axios from 'axios';
import cybersourceRestApi from 'cybersource-rest-client';
const Magento2Client = require('magento2-rest-client').Magento2Client;
const Base64 = require('js-base64').Base64;

module.exports = ({ config, db }) => {
  let csApi = Router()

  const verifyCaptcha = (req) => {
    if (config.extensions.cybersource.recaptcha) {
      const key = config.extensions.cybersource.recaptcha.secretKey
      const endpoint = config.extensions.cybersource.recaptcha.verifyEndpoint
      const recaptchaResponse = axios.post(endpoint, {
        secret: key,
        response: req.body.recaptcha,
        remoteip: req.headers['cf-connecting-ip'] || req.headers['x-forwarded-for'] || req.connection.remoteAddress || null
      });

      const recaptcha = recaptchaResponse.json()

      if (!recaptcha.success) {
        throw new Error('[Captcha] Validation failed.')
      }

      if (recaptcha.hostname !== req.origin) {
        throw new Error('[Captcha] Origin not allowed.')
      }
    }
  }

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
    const origin = req.get('origin')

    if (!config.extensions.cybersource.hasOwnProperty(origin)) {
      apiStatus(res, 'Origin not allowed', 500)
      return
    }

    let siteConfig = config.extensions.cybersource[origin]

    try {
      const instance = new cybersourceRestApi.KeyGenerationApi(siteConfig.configObj)

      const request = new cybersourceRestApi.GeneratePublicKeyRequest()
      request.encryptionType = siteConfig.encryptionType
      request.targetOrigin = siteConfig.targetOrigin

      let options = {
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

  csApi.post('/add-payment-data', (req, res) => {
    try {
      verifyCaptcha(req)
    } catch (e) {
      apiError(res, e)
      return
    }

    let client = Magento2Client(config.magento2.api)
    let request = {
      secureAcceptanceVSFData: {
        additional_info: Base64.encode(JSON.stringify(
          {
            quote_masked_id: req.body.quote_masked_id,
            payment_token: req.body.token,
            req_card_number: req.body.maskedPan,
            req_card_type: req.body.cardType,
            req_card_expiry_date: req.body.cardExpirationMonth + '-' + req.body.cardExpirationYear
          }
        ))
      }
    }
    client.addMethods('addCyberSourcePaymentData', (restClient) => {
      let module = {}
      module.addPayment = () => {
        return restClient.post('/SecureAcceptanceVSF', request)
      }
      return module
    })
    return client.addCyberSourcePaymentData.addPayment().then((result) => {
      apiStatus(res, result, 200)
    }).catch((err) => {
      apiStatus(res, err, 500)
    })
  })

  return csApi
}
