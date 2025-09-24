/**
 * Netlify Function per gestire i webhook di Prismic
 * Endpoint: /.netlify/functions/prismic-webhook
 */

const { handlePrismicWebhook } = require('../../netlify-webhook.js');

exports.handler = handlePrismicWebhook;