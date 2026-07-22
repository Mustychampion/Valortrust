const Datastore = require('nedb-promises');
const path = require('path');

const createStore = (name) => {
  return Datastore.create({
    filename: path.join(__dirname, 'data', `${name}.db`),
    autoload: true,
    timestampData: true
  });
};

const db = {
  users: createStore('users'),
  profile: createStore('profile'),
  skills: createStore('skills'),
  certificates: createStore('certificates'),
  projects: createStore('projects'),
  messages: createStore('messages'),
  analytics: createStore('analytics')
};

console.log('Connected to NeDB databases.');

module.exports = db;
