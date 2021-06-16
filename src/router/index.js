const baseRoute = require('../core/routerConfig');

baseRoute.get('/', (req, res) => res.status(200).send('<code>simple blog backend api running...<a target="_blank" href="https://documenter.getpostman.com/view/12307581/TzeTHUgF" style="text-decoration: none; cursor: pointer; color: black; font-weight: bold">&lt;View Documentation/&gt;</a></code>'));

module.exports = baseRoute;
