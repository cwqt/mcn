import { Stories } from "../stories";
const fetch = require("node-fetch");
import { expect } from "chai";
import { IUser } from "@cxss/interfaces";

export const verifyUserEmail = async (email: string) => {
  await fetch(`${Stories.apiUrl}/auth/verify?email=${email}&hash=wow`, { redirect: "manual" });
};
