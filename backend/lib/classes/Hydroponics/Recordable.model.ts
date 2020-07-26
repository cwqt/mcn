import { Node } from "../Node.model";
import { Measurement, RecordableType } from "@cxss/interfaces";
import { IRecordableStub, IRecordable } from "@cxss/interfaces/dist/Hydroponics/Recordable.model";

export class Recordable extends Node {
  name: string;
  thumbnail?: string;
  tagline?: string;

  images: string[];
  recording?: string[];
  feed_url?: string;
  parameters?: Map<Measurement, [number, number, number]>;
  description?: string;

  constructor(type: RecordableType, name: string) {
    super(type);
    this.name = name;
    this.images = [];
  }

  toStub(): IRecordableStub {
    return {
      ...super.toStub(),
      name: this.name,
    };
  }

  toFull(): IRecordable {
    return {
      ...this.toStub(),
      images: this.images,
    };
  }
}
