import { Stories } from "../stories";
const fetch = require("node-fetch");
import { expect } from "chai";
import { IDevice } from "@cxss/interfaces";

export const createDevice = async (device: {
  hardware_model: string;
  name: string;
}): Promise<IDevice> => {
  let res = await fetch(`${Stories.apiUrl}/devices`, {
    method: "POST",
    body: JSON.stringify(device),
    headers: {
      ["Content-Type"]: "application/json",
      ["Cookie"]: Stories.activeSession,
    },
  });

  expect(res.status).to.be.eq(201);
  return await res.json();
};
