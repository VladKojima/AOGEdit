echo HC_INTERVAL = 10s > .env;
echo HC_TIMEOUT = 10s >> .env;
echo HC_RETRIES = 6 >> .env;

echo DB_HOST = db >> .env;

echo APP_DB_USER = app >> .env;

cat ./db/initScript_1.sql > ./db/createDB.sql;

echo Enter db_app password;
read buf;
echo APP_DB_PASSWORD = $buf >> .env;

echo "'"$buf"';" >> ./db/createDB.sql;

cat ./db/initScript_2.sql >> ./db/createDB.sql;

echo DB_USER = postgres >> .env;

echo Enter db_admin password;
read buf;
echo DB_PASSWORD = $buf >> .env;

echo Enter pg_admin email;
read buf;
echo PGADMIN_EMAIL = $buf >> .env;

echo Enter pg_admin password;
read buf;
echo PGADMIN_PASSWORD = $buf >> .env;

echo Enter app port;
read buf;
echo APP_PORT = $buf >> .env;

echo Enter pgadmin port;
read buf;
echo PGADMIN_PORT = $buf >> .env;

echo Enter pgadmin https port;
read buf;
echo PGADMIN_HTTPS_PORT = $buf >> .env;