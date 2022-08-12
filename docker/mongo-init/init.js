db.createUser(
  {
      user: 'user',
      pwd: 'pass',
      roles: [
          {
              role: 'readWrite',
              db: 'Cookmaster',
          },
      ],
  },
);

db.users.insertOne({ name: 'admin', email: 'root@email.com', password: 'admin', role: 'admin' });