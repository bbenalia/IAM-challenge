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
exports.deletePostHandler = async (event, context) => {
  const { id: postId } = event.pathParameters;

  try {
    if (!postId) {
      return httpResponse(400, {
        status: "error",
        message: "Please type a post Id",
      });
    }

    // only for HASH key
    // const result = await dynamo.get(params).promise();

    // both HASH key and RANGE key
    const result = await dynamo
      .query({
        TableName: tableName,
        KeyConditionExpression: "id = :postId",
        ExpressionAttributeValues: {
          ":postId": postId,
        },
        Limit: 1,
      })
      .promise();

    if (result.Count) {
      const [post] = result.Items;
      const params = {
        TableName: tableName,
        Key: { id: postId, createdAt: post.createdAt },
      };

      await dynamo.delete(params).promise();

      return httpResponse(200, {
        status: "success",
        message: "Post successfully deleted",
        id: postId,
      });
    }

    return httpResponse(400, {
      status: "Error",
      message: "Post not found",
      data: result,
    });
  } catch (err) {
    return httpResponse(500, { status: "error", message: err.message });
  }
};
