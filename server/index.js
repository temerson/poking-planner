import http from 'http';
import app from './server';

const server = http.createServer(app);
let currentApp = app;
server.listen(3001);

if (module.hot) {
  module.hot.accept('./server', () => {
    server.removeListener('request', currentApp);
    server.on('request', app);
    currentApp = app;
  })
}

app.listen(API_PORT, () => console.log(`Listening on port ${API_PORT}`));
