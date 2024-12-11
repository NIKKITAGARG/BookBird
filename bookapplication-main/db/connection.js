import { Sequelize } from "sequelize";
import mysql2 from "mysql2"

export async function createDBConnection({
  host,
  username,
  password,
  database,
  dialect,
}) {
  try {
    const connection = new Sequelize({
      dialect: dialect,
      dialectModule : mysql2,
      host: host,
      username: username,
      password: password,
      database: database,
      logging: false
    });
    // createModels(connection)
    console.log("CONNECTED TO THE SERVER...");
    return connection;
  } catch (err) {
    console.log(err);
  }
}

export const dbconnection = await createDBConnection({
  host: "database-2.c9oze8lk7mub.ap-south-1.rds.amazonaws.com", //"bookappdb.cgw2xd35fmzw.ap-south-1.rds.amazonaws.com",
  database: "bookdee",
  password: "bookbird", //"aryanUIQ12",
  username: "admin", //"admin",
  dialect: "mysql"
});
