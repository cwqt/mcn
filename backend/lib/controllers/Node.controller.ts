import { NodeType, Paginated } from "@cxss/interfaces";
import config from "../config";

export const paginate = (
  nodeType: NodeType,
  results: any[],
  count: number,
  per_page: number,
  org_id?: string
): Paginated<any> => {
  count = count || 0;
  org_id = org_id || "";

  let pages: Paginated<any> = {
    results: results,
    next: `${config.API_URL}/${org_id && `orgs/${org_id}/`}${nodeType}s?page=1&per_page=${per_page}`,
    prev: `${config.API_URL}/${org_id && `orgs/${org_id}/`}${nodeType}s?page=${Math.ceil(
      count / per_page
    )}&per_page=${per_page}`,
    total: count,
    pages: Math.ceil(count / per_page),
  };

  return pages;
};

export const capitalize = (str: NodeType | string): string => str.charAt(0).toUpperCase() + str.slice(1);
