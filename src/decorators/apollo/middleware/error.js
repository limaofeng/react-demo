/**
 *  解决 TypeError: Already read 异常
 *
 * @param {Response} response
 */
export default function error(response) {
  response.json = (prom => () =>
    new Promise((resolve, reject) => {
      prom.then(resolve).catch(reject);
    }))(
    response.json().then(result => {
      const { errors } = result;
      if (errors) {
        console.error(errors);
        if (errors.some(({ statusCode }) => statusCode === 401)) {
          console.error('logout', errors);
        }
        if (errors.some(({ data: { code } }) => code === 100503)) {
          console.error('logout', errors);
        }
      }
      return result;
    })
  );
}
