import {
  NodeType,
  IFarm,
  IFarmStub,
  IRackStub,
  Paginated,
  IRecordable,
  IRack,
  IRecordableStub,
  DataModel,
} from "@cxss/interfaces";
import { cypher } from "../../common/dbs";
import { createPaginator } from "../../controllers/Node.controller";
import Recordable from "./Recordable.model";
import Rack from "./Rack.model";

/**
 * @description Read nodes in & reduce to interface
 * @param _id Indexed Node id
 * @param dataModel Interface format; stub, full or private
 */
const read = async <T extends IFarmStub | IFarm>(
  _id: string,
  dataModel: DataModel.Stub | DataModel.Full = DataModel.Stub
): Promise<T> => {
  let data;
  switch (dataModel) {
    case DataModel.Stub: {
      let res = await cypher(
        ` MATCH (f:Farm {_id:$fid})
          SIZE((f)-[:HAS_RACK]->(:Rack)) as rackCount
          RETURN f, rackCount `,
        { fid: _id }
      );

      data = res.records[0].get("f");
      data.racks = data.racks.toNumber();
      break;
    }

    case DataModel.Full: {
      let res = await cypher(
        ` MATCH (f:Farm {_id:$fid})
          MATCH (f)-[:HAS_RACK]->(r:Rack)
          RETURN f, r{._id}`,
        { fid: _id }
      );
      data = <IFarm>res.records[0].get("f");
      data.racks = await Promise.all(
        data.racks.map((r: IRack) => Rack.read<IRackStub>(r._id, DataModel.Stub))
      );
      break;
    }
  }

  return reduce<T>(data, dataModel);
};

const reduce = <T extends IFarmStub | IFarm>(data: T, dataModel: DataModel = DataModel.Stub): T => {
  switch (dataModel) {
    case DataModel.Stub:
      return {
        ...Recordable.reduce<IRecordable>(data, DataModel.Full),
        location: data.location,
        racks: data.racks as number,
      } as T;

    case DataModel.Full:
      return {
        ...Recordable.reduce<IRecordable>(data, DataModel.Full),
        racks: data.racks as IRackStub[],
        location: data.location,
      } as T;
  }
};

export default { read, reduce };
