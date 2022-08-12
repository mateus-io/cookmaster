// colocar query do MongoDB
/*
===============================================================================
instruções que rodei dentro do container do mongo para criar o usuário admin
  mongo -u root -p pass
  use Cookmaster
  db.users.insertOne({ name: 'admin', email: 'root@email.com', password: 'admin', role: 'admin' })
  db.users.find() // para conferir se foi
==============================================================================

o arquivo init.js que está neste caminho relativo docker/mongo-init/init.js
executa 1 vez quando o mongo sobe porque coloquei ele na pasta docker-entrypoint-initdb.d do
container, dessa forma ele já roda o script dentro do banco que eu defino na
MONGO_INITDB_DATABASE no docker-compose.yml. Enfim, o usuário admin é criado automaticamente
quando o banco sobe

==============================================================================

para executar é
mongo localhost:27017/Cookmaster seed.js

*/

db = connect("localhost:27017/Cookmaster");
db.users.insertOne({ name: 'admin', email: 'root@email.com', password: 'admin', role: 'admin' });