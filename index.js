const { ApolloServer, gql } = require('apollo-server-express');
const express = require('express');

const typeDefs = gql`
  type Chef {
    id: ID!
    name: String!
    bio: String
    specialties: [String]
    location: String
    experience: Int
  }

  type Query {
    chefs(name: String, specialty: String, location: String): [Chef]
    chef(id: ID!): Chef
  }

  type Mutation {
    updateChef(id: ID!, name: String, bio: String, specialties: [String], location: String, experience: Int): Chef
  }
`;

const chefs = [
  { id: '1', name: 'Chef John', bio: 'Expert in Italian cuisine.', specialties: ['Italian'], location: 'New York', experience: 10 },
  // More chefs
];

const resolvers = {
  Query: {
    chefs: (parent, args) => chefs.filter(chef => {
      return (!args.name || chef.name.includes(args.name)) &&
             (!args.specialty || chef.specialties.includes(args.specialty)) &&
             (!args.location || chef.location.includes(args.location));
    }),
    chef: (parent, args) => chefs.find(chef => chef.id === args.id),
  },
  Mutation: {
    updateChef: (parent, args) => {
      let chef = chefs.find(chef => chef.id === args.id);
      if (chef) {
        chef = { ...chef, ...args };
        return chef;
      }
      return null;
    },
  },
};

async function startApolloServer() {
  const app = express();
  const server = new ApolloServer({ typeDefs, resolvers });
  await server.start();
  server.applyMiddleware({ app });

  app.listen({ port: 4000 }, () =>
    console.log(`Server ready at http://localhost:4000${server.graphqlPath}`)
  );
}

startApolloServer();
