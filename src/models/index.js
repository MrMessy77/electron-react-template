const files = require.context('.', false, /\.js$/)
const models = [];

files.keys().forEach(key => {
  if (key === './index.js') return
  models.push(files(key).default);
})

export default models
