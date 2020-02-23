import {
  GraphQLInterfaceType,
  GraphQLNonNull,
  // GraphQLObjectType,
  // GraphQLString,
  GraphQLEnumType,
} from 'graphql';

import {GraphQLDateTime} from 'graphql-iso-date';

export const PointInTimeStateEnum = new GraphQLEnumType({
  name: 'PointInTimeStateEnum',
  values: {ACTIVE: {value: 'ACTIVE'}, INACTIVE: {value: 'INACTIVE'}},
});

export const PointInTimeInterface = new GraphQLInterfaceType({
  name: 'PointInTimeInterface',
  fields: () => ({
    createdAt: {type: GraphQLNonNull(GraphQLDateTime)},
    updatedAt: {type: GraphQLDateTime},
    state: {type: GraphQLNonNull(PointInTimeStateEnum)},
  }),
});

export const pointInTimeFields = {
  createdAt: {type: GraphQLNonNull(GraphQLDateTime)},
  updatedAt: {type: GraphQLDateTime},
  state: {type: GraphQLNonNull(PointInTimeStateEnum)},
};
