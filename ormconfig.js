const { SnakeNamingStrategy } = require("typeorm-naming-strategies");

module.exports = {
  namingStrategy: new SnakeNamingStrategy(),
  cli: {
    entitiesDir: 'src/entities/postgres-entities',
    migrationsDir: 'src/migrations',
  },
};