const path = require("path");

function resolveSrc(_path) {
  return path.join(__dirname, _path);
}

const aliases = {
  "@src": "src",
  "@router": "src/router",
  "@views": "src/views",
  "@layouts": "src/views/layouts",
  "@components": "src/components",
  "@assets": "src/assets",
  "@utils": "src/utils",
  "@store": "src/store",
  "@design": "src/assets/index.scss",
  "@lib": "src/lib",
  "@locale": "src/i18n/locale",
  "@mixins": "src/mixins",
  "@entities": "src/store/entities",
};

module.exports = {
  webpack: {},
  jest: {},
};

for (const alias in aliases) {
  module.exports.webpack[alias] = resolveSrc(aliases[alias]);
  module.exports.jest["^" + alias + "/(.*)$"] =
    "<rootDir>/" + aliases[alias] + "/$1";
}
