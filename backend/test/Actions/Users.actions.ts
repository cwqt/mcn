import { Stories } from "../stories";
const fetch = require("node-fetch");
import { expect } from "chai";
import { IUser } from "@cxss/interfaces";

export const createUser = async (user: {
  username: string;
  email: string;
  password: string;
}): Promise<IUser> => {
  let res = await fetch(`${Stories.apiUrl}/users`, {
    method: "POST",
    body: JSON.stringify(user),
    headers: {
      ["Content-Type"]: "application/json",
    },
  });

  expect(res.status).to.be.eq(201);
  return await res.json();
};

export const logoutUser = async () => {
  // "/users/logout",

  Stories.activeSession = null;
};

export const loginUser = async (email: string, password: string): Promise<IUser> => {
  let res = await fetch(`${Stories.apiUrl}/users/login`, {
    method: "POST",
    body: JSON.stringify({ email: email, password: password }),
    headers: {
      "Content-Type": "application/json",
    },
  });

  expect(res.status).to.be.eq(201);

  Stories.activeSession = res.headers
    .get("set-cookie")
    .split(";")
    .find((s: string) => s.includes("connect.sid"));

  return await res.json();
};

export const readUserByUsername = async () => {
  // "/u/:username",
};

export const readUserById = async () => {
  // "/users/:uid",
};

export const updateUser = async () => {
  // "/users/:uid",
};

export const readUserOrgs = async () => {
  // "/users/:uid/orgs",
};

export const updateUserAvatar = async () => {
  // "/users/:uid/avatar",
};

export const deleteUser = async () => {
  // "/users/:uid",
};
