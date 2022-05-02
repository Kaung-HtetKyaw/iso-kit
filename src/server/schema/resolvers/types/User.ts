import { GraphQLUserResolvers } from '../definitions';

const UserGraphQL: GraphQLUserResolvers = {
    id: root => root._id,
    topics: (root, args, { loaders }) => loaders.topicById.load(root._id),
};

export default UserGraphQL;
