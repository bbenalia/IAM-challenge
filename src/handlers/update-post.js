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
exports.updatePostHandler = async (event, context) => {
  const { id: postId } = event.pathParameters;
  const { body: postBody, title: postTitle } = JSON.parse(event.body);

  try {
    if (!postId) {
      return httpResponse(400, {
        status: "error",
        message: "Please type a post Id",
      });
    }

    const params = {
      TableName: tableName,
      Key: { id: postId },
      UpdateExpression: "set body = :body, title = :title",
      ExpressionAttributeValues: { ":body": postBody, ":title": postTitle },
      ReturnValues: "UPDATED_NEW",
    };

    const result = await dynamo.get(params).promise();

    if (result?.Item) {
      await dynamo.update(params).promise();

      return httpResponse(200, {
        status: "success",
        message: "Post successfully updated",
        id: postId,
      });
    }

    return httpResponse(400, {
      status: "Error",
      message: "Post not found",
    });
  } catch (err) {
    return httpResponse(500, { status: "error", message: err.message });
  }
};
