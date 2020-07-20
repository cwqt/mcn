import { Stories } from "../stories";
const fetch = require("node-fetch");
import { expect } from "chai";

export const setUp = async () => {
  await clearData();
};

export const clearData = async () => {
  await fetch(`${Stories.apiUrl}/test/drop`, { method: "POST" });
};
