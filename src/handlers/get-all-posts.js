const AWS = require("aws-sdk");
const { httpResponse } = require("../utils/http");

require("dotenv").config();

// TODO: condition
// only for local development
// AWS.config.update({ dynamodb: { endpoint: process.env.DYNAMODB_ENDPOINT } });

// Get the DynamoDB table name from environment variables
const tableName = process.env.TABLE;

// Create a DocumentClient that represents the query to add an item
const dynamo = new AWS.DynamoDB.DocumentClient();

/**
 * @param {Object} event - API Gateway Lambda Proxy Input Format
 * @param {Object} context
 *
 * @returns {Object} object - API Gateway Lambda Proxy Output Format
 */
exports.getAllPostsHandler = async (event, context) => {
  try {
    const posts = await dynamo.scan({ TableName: tableName }).promise();

    return httpResponse(200, { status: "success", posts: posts?.Items || [] });
  } catch (err) {
    return httpResponse(500, { status: "error", message: err.message });
  }
};
