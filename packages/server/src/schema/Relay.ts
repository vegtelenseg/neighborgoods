import {nodeDefinitions} from 'graphql-relay';

// import {User} from '../models';

const {nodeField, nodeInterface} = nodeDefinitions<{user: any}>(
  // resolve the ID to an object
  (_globalId, context) => {
    // parse the globalID
    // const {type, id} = fromGlobalId(globalId);

    if (!context.user) {
      // Only return data for authenticated users
      return null;
    }

    throw new Error('Not Implemented');
  },
  // determines the type. Join Monster places that type onto the result object on the "__type__" property
  (obj) => obj.__type__
);

export {nodeInterface, nodeField};
