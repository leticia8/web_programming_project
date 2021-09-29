const todoList = [
  {
    id: '1',
    description: 'resolve objective',
    completed: false,
  },
  { id: '2', description: 'configure environment', completed: true },
  {
    id: '3',
    description: 'design modules',
    completed: false,
  },
  {
    id: '4',
    description: 'obtain approval',
    completed: false,
  },
];

exports.handler = function server(event, context, callback) {
  const method = event.httpMethod;
  const re = /functions\/todos\/(\w+)/;
  const { path } = event;
  const idPathMatch = re.exec(path);
  const todoId = idPathMatch && idPathMatch[1];
  if (method === 'GET') {
    callback(null, {
      statusCode: 200,
      body: JSON.stringify(todoList),
    });
  } else if (method === 'POST') {
    const body = JSON.parse(event.body);
    callback(null, {
      statusCode: 201,
      body: JSON.stringify({
        id: 'not_implemented',
        description: body.description,
        completed: false,
      }),
    });
  } else if (method === 'PATCH' && todoId) {
    const body = JSON.parse(event.body);
    callback(null, {
      statusCode: 200,
      body: JSON.stringify({
        id: todoId,
        description: 'loaded_from_database',
        completed: body.completed,
      }),
    });
  } else if (method === 'DELETE' && todoId) {
    callback(null, {
      statusCode: 204,
    });
  } else {
    callback(null, {
      statusCode: 405,
      body: JSON.stringify({ error: 'unsupported_method' }),
    });
  }
};
