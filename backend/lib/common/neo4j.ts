import config from '../config';
var neo4j = require('neo4j-driver')

export const n4j = neo4j.driver('neo4j://localhost', neo4j.auth.basic(config.N4J_USER, config.N4J_PASS));
