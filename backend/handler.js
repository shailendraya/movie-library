const AWS = require('aws-sdk');
const { v4: uuidv4 } = require('uuid');

const dynamoDb = new AWS.DynamoDB.DocumentClient();
const tableName = process.env.MOVIES_TABLE;

module.exports.listMovies = async (event) => {
  const params = {
    TableName: tableName,
  };

  try {
    const data = await dynamoDb.scan(params).promise();
    return {
      statusCode: 200,
      body: JSON.stringify(data.Items),
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Could not fetch movies' }),
    };
  }
};

module.exports.getMovie = async (event) => {
  const { id } = event.pathParameters;
  const params = {
    TableName: tableName,
    Key: { id },
  };

  try {
    const data = await dynamoDb.get(params).promise();
    if (!data.Item) {
      return {
        statusCode: 404,
        body: JSON.stringify({ error: 'Movie not found' }),
      };
    }
    return {
      statusCode: 200,
      body: JSON.stringify(data.Item),
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Could not fetch movie' }),
    };
  }
};

module.exports.createMovie = async (event) => {
  const { name, genre, actors, releaseDate, details } = JSON.parse(event.body);

  const movie = {
    id: uuidv4(),
    name,
    genre,
    actors,
    releaseDate,
    details,
  };

  const params = {
    TableName: tableName,
    Item: movie,
  };

  try {
    await dynamoDb.put(params).promise();
    return {
      statusCode: 201,
      body: JSON.stringify(movie),
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Could not create movie' }),
    };
  }
};

module.exports.updateMovie = async (event) => {
  const { id } = event.pathParameters;
  const { name, genre, actors, releaseDate, details } = JSON.parse(event.body);

  const params = {
    TableName: tableName,
    Key: { id },
    UpdateExpression: 'set #name = :name, #genre = :genre, #actors = :actors, #releaseDate = :releaseDate, #details = :details',
    ExpressionAttributeNames: {
      '#name': 'name',
      '#genre': 'genre',
      '#actors': 'actors',
      '#releaseDate': 'releaseDate',
      '#details': 'details',
    },
    ExpressionAttributeValues: {
      ':name': name,
      ':genre': genre,
      ':actors': actors,
      ':releaseDate': releaseDate,
      ':details': details,
    },
    ReturnValues: 'ALL_NEW',
  };

  try {
    const data = await dynamoDb.update(params).promise();
    return {
      statusCode: 200,
      body: JSON.stringify(data.Attributes),
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Could not update movie' }),
    };
  }
};

module.exports.deleteMovie = async (event) => {
  const { id } = event.pathParameters;
  const params = {
    TableName: tableName,
    Key: { id },
  };

  try {
    await dynamoDb.delete(params).promise();
    return {
      statusCode: 200,
      body: JSON.stringify({ message: 'Movie deleted successfully' }),
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Could not delete movie' }),
    };
  }
};

module.exports.searchMovies = async (event) => {
  const { query } = event.queryStringParameters || {};
  const params = {
    TableName: tableName,
    FilterExpression: 'contains(#name, :query) or contains(#genre, :query) or contains(#actors, :query)',
    ExpressionAttributeNames: {
      '#name': 'name',
      '#genre': 'genre',
      '#actors': 'actors',
    },
    ExpressionAttributeValues: {
      ':query': query,
    },
  };

  try {
    const data = await dynamoDb.scan(params).promise();
    return {
      statusCode: 200,
      body: JSON.stringify(data.Items),
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Could not search movies' }),
    };
  }
};
