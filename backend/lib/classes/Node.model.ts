import { cypher } from "../common/dbs";
import { plainToClass } from "class-transformer";
import { Types } from "mongoose";
import { ErrorHandler } from "../common/errorHandler";
import { HTTP } from "../common/http";
import { capitalize } from "../controllers/Node.controller";
import { NodeType, INode } from "@cxss/interfaces";

export class Node {
  _id: string;
  created_at: number;
  type: NodeType;
  modifiableFields: string[];

  constructor(node: NodeType, _id?: string) {
    this._id = _id ?? new Types.ObjectId().toHexString();
    this.created_at = Date.now();
    this.type = node;
    this.modifiableFields = [];
  }

  toStub(): INode {
    return {
      _id: this._id,
      created_at: this.created_at,
      type: this.type,
    };
  }

  //fallbacks
  toFull(): INode {
    return this.toStub();
  }
  toPrivate(): INode {
    return this.toStub();
  }

  async create() {
    let results = await cypher(
      `
      CREATE (n:${capitalize(this.type)} $body)
      RETURN n
    `,
      {
        body: this,
      }
    );
    return objToClass(this.type, results.records[0].get("n").properties);
  }

  async read(_id?: string) {
    let results = await cypher(
      `
      MATCH (n:${capitalize(this.type)} {_id:$nid})
      RETURN n
    `,
      {
        nid: _id ?? this._id,
      }
    );

    if (!results.records[0]?.get("n"))
      throw new ErrorHandler(HTTP.NotFound, `${this.type} does not exist`);
    return objToClass(this.type, results.records[0].get("n").properties);
  }

  async update(body: any) {
    let results = await cypher(
      `
      MATCH (n:${capitalize(this.type)} {_id:$nid})
      SET n += $body
      RETURN n
    `,
      {
        nid: this._id,
        body: body,
      }
    );
    return objToClass(this.type, results.records[0].get("n").properties);
  }

  async delete() {
    await cypher(
      `
      DETACH DELETE (n:${capitalize(this.type)} {_id:$nid})
    `,
      {
        nid: this._id,
      }
    );
  }
}

import { User } from "./Users/User.model";
import { Org } from "./Orgs.model";
import { Device } from "./IoT/Device.model";
import { DeviceProperty, DeviceSensor, DeviceState } from "./IoT/DeviceProperty.model";

export interface Class<T> extends Function {
  new (...args: any[]): T;
}

export const objToClass = (type: NodeType, object: any) => {
  const NodeClassMap: { [index in NodeType]?: Class<any> } = {
    [NodeType.Organisation]: Org,
    [NodeType.User]: User,
    [NodeType.Device]: Device,
    [NodeType.DeviceProperty]: DeviceProperty,
    [NodeType.Sensor]: DeviceSensor,
    [NodeType.Sensor]: DeviceState,
  };

  // some stupid bullshit with circular dependencies
  return plainToClass(NodeClassMap[type], object);
};
