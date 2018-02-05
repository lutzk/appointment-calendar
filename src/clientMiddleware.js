const clientMiddleware = client => ({ dispatch, getState }) => next => action => {// eslint-disable-line
  const { promise, types, ...rest } = action;

  if (!promise) {
    return next(action);
  }

  const [REQUEST, SUCCESS, FAILURE] = types;

  next({ ...rest, type: REQUEST });
  return promise(client).then((result) => {

    const { error } = result;

    if (error) {
      const { status } = error;

      if (status === 500) {
        return next({ ...rest, error, type: FAILURE });
      }
      return next({ ...rest, error, type: FAILURE });
    }

    return next({ ...rest, result, type: SUCCESS });
  });
};

export { clientMiddleware };
