const express = require("express");

const app = express();

app.use("/worldclock", express.static("www"));

const boot = function () {
    let port = process.env["APP_PORT"] || 8080;
    const listener = app.listen(port, _ => {
        console.log("listening on", listener.address().port);
    });
}

if (require.main === module) {
    boot();
}

// End
