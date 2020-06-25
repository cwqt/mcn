import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class OrganisationService {
  currentOrg:BehaviourSubject:IOrganisation = new BehaviorSubject();

  constructor() { }
}
