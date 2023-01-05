import * as mysql from "mysql2/promise";
import { UserResponse } from "../types";

const UserSQL = `
SELECT 
  username,
  password,
  name,
  email, 
  blocked,
  EXISTS (select * from users_groups ug where ug.userid=u.userid and ug.groupid= 1017) as isDev
FROM users u where username like `;

async function connect() {
  let connection = await mysql.createConnection("mysql://login:KmgqnZYYC7Gc_Q@191.252.58.28:3310/login");
  //let connection = await mysql.createConnection("mysql://root:SmgoQu33n!@191.252.58.28:3310/login");
  return connection;
}

const selectUserByUserName = async (username: string) => {
  const conn = await connect();
  const sql = UserSQL + "'%" + username + "%'";
  const [rows] = await conn.query(sql);
  return rows as UserResponse[];
};
const selectUserById = async (userid: string) => {
  const conn = await connect();
  const sql = "SELECT username,name FROM users where userid = " + userid;
  const [rows] = await conn.query(sql);
  return rows[0] as { username: string; name: string };
};
const selectColaboradorIdByMatricula = async (matricula: string) => {
  const conn = await connect();
  const sql = "select c.userid from colaboradores c where matricula = " + matricula;
  const [rows] = await conn.query(sql);
  return rows[0] as { userid: number };
};

export { selectUserByUserName, selectColaboradorIdByMatricula, selectUserById };
