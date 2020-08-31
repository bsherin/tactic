
# Mongo collected stuff

Log file is at: `/var/log/mongodb`

To view log: `sudo tail -n100 /var/log/mongodb/mongod.log`

manually start mongodb server: `sudo mongod --config /etc/mongod.conf`

stop mongo servers
`mongo
use admin
db.db.shutdownServer()


	
