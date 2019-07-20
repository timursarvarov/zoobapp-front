import { schema } from 'normalizr';

// Define a users schema
const manipulation = new schema.Entity('manipulations');

// Define your comments schema
const procedure = new schema.Entity('procedures', {
    manipulations: manipulation
}, { idAttribute: 'ID' });

// Define your article
const plan = new schema.Entity('plans', {
    procedures: [procedure]
}, { idAttribute: 'ID' });

const userListSchema = [plan];

export default userListSchema;