import { serverHttp } from "./app";
import fs from "fs";

const port = process.env.NODE_ENV === "development"?process.env.PORT:8080

fs.readFile('banner.txt', 'utf8', (err, data) => {
  if (err) {
    console.error(err);
    return;
  }
  console.log(data);
});
//process.env.TZ = "America/Sao_Paulo";
serverHttp.listen(port, () =>{
   process.env.TZ = "America/Sao_Paulo";
   console.log(new Date().toString());

  console.log(`🚀🚀🚀🚀  Server is running on PORT ${port}`)}
);
