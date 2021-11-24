/**
 * @param {Number} status - http status response
 * @param {Object} body - http response
 *
 * @returns {Object} -
 */
function httpResponse(status = 200, body = {}) {
  return {
    statusCode: status,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  };
}

module.exports = { httpResponse };
