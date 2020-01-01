const moment = require("moment-timezone");

d = moment();
s=d.tz("America/Los_Angeles").format('ha z');
console.log(s);
