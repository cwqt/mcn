import { INode } from "../Node.model";
import { NodeType } from "../Types/Nodes.types";

export enum Jobs {
  Routine = "runRoutine",
  Subroutine = "runSubRoutine",
  Task = "runTask",
}

// GET http://tasks.corrhizal.net/task/:tid/TaskResolutionStates.Success
export enum TaskResolutionStates {
  Success = "success",
  Fail = "fail",
}

export enum TaskState {
  Complete = "complete",
  Pending = "pending",
  Inactive = "inactive",
  Failed = "failed",
  TimedOut = "timed_out",
}

export interface ITaskSeries extends INode {
  type: NodeType.TaskSeries;
  version: string; //semver
  routines: ITaskRoutine[];
}

export interface ITaskRoutine extends INode {
  type: NodeType.TaskRoutine;
  state: TaskState;
  name: string;
  cron: string; //cron string
  timezone: string;
  execution_count: number;

  short_desc?: string;
  last_started?: number;
  last_finished?: number;

  tasks?: ITask[];
}

export interface ITask {
  _id: string;
  name: string;
  command: string; // mcnlang string
  state: TaskState;
  created_at: number;

  error?: string;
  last_started?: number;
  last_finished?: number;
}
