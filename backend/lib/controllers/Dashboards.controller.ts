import { IDashboard, IDashboardItem, IDashboardSection } from "@cxss/interfaces";
import { Request } from "express";
import DashboardSection from "../classes/Dashboard/DashboardSection.model";
import Dashboard from "../classes/Dashboard/Dashboard.model";
import { cypher } from "../common/dbs";
import DashboardItem from "../classes/Dashboard/DashboardItem.model";

export const getDashboard = async (req: Request): Promise<IDashboard> => {
    return await Dashboard.read(req.params.did);
}

export const updateDashboard = async (req: Request): Promise<IDashboard> => {
    await Dashboard.update(req.params.did, req.body);
    return await Dashboard.read(req.params.did);
}

export const deleteDashboard = async (req: Request): Promise<void> => {
    return await Dashboard.remove(req.params.did, null);
}

export const addSection = async (req: Request): Promise<IDashboardSection> => {
    return await DashboardSection.create(req.body, req.params.did);
}

export const updateSection = async (req: Request): Promise<IDashboardSection> => {
    await DashboardSection.update(req.params.sid, req.body);
    return await DashboardSection.read(req.params.sid);
}

export const deleteSection = async (req: Request): Promise<void> => {
    return await DashboardSection.remove(req.params.sid);
}

export const addItem = async (req: Request): Promise<IDashboardItem> => {
    return await DashboardItem.create(req.body, req.params.sid);
}

export const updateItem = async (req: Request): Promise<IDashboardItem> => {
    await DashboardItem.update(req.params.iid, req.body);
    return await DashboardItem.read(req.params.iid);
}

export const deleteItem = async (req: Request): Promise<void> => {
    return await DashboardItem.remove(req.params.iid, null);
}
