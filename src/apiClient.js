import superagent from 'superagent';

const setReqData = ({ request, incomingReq, headers, params, data } = {}) => {

  if (__SERVER__ && incomingReq && incomingReq.get('cookie')) {
    request.set('cookie', incomingReq.get('cookie'));
  }

  if (headers) {
    request.set(headers);
  }

  if (params) {
    request.query(params);
  }

  if (data) {
    request.send(data);
  }

  return request;
};

function client(verb) {
  return async (path, { params, data, headers } = {}) => {

    let request = null;
    let result = null;
    const incomingReq = this.incomingReq || false;

    try {
      request = superagent[verb](path);
      // request = setReqData({ request, incomingReq, headers, params, data });
      result = await request;
      
    } catch (error) {
      if (error && error.code && !error.status) {
        result = { error: error.code };
      } else if (error && error.response) {
        result = { error: { status: error.status, error: error.response.body || error.response.text } };
      } else {
        result = { error: 'SOLAR FLARE' };
      }

      return result;
    }

    return result.body;
  };
}

const verbs = ['get', 'post'];

function ApiClient(incomingReq) {
  this.incomingReq = incomingReq;
  verbs.map(verb =>// eslint-disable-line
    ApiClient.prototype[verb] = client.apply(this, [verb]));
}

export { ApiClient };
