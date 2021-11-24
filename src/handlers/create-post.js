const AWS = require("aws-sdk");
const { httpResponse } = require("../utils/http");
const { uuid } = require("uuidv4");
require("dotenv").config();

AWS.config.update({ dynamodb: { endpoint: process.env.DYNAMODB_ENDPOINT } });

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
exports.createPostHandler = async (event, context) => {
  const { body: postBody, title: postTitle } = JSON.parse(event.body);

  try {
    if (!postBody || !postTitle) {
      return httpResponse(400, { message: "Please complete all fields" });
    }

    const params = {
      TableName: tableName,
      Item: { id: uuid(), body: postBody, title: postTitle },
    };

    await dynamo.put(params).promise();

    return httpResponse(200, {
      status: "success",
      message: "Post successfully created",
      id: params.Item.id,
    });
  } catch (err) {
    return httpResponse(500, { status: "error", message: err.message });
  }
};
