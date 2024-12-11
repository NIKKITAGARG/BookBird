import http from "http";
// app
import { app } from "./app.js";

let server = null;
try {
  server = http.createServer(app);

  server.listen(80, (err) => {
    if (err) {
      console.log(err);
    } else {
      console.log("Server Started...");
    }
  });
} catch (err) {
  console.log(err);
  server.close();
}
