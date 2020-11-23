
## mongo docker container

	* I tried using this but there was a problem because my existing data isn’t compatible.
	* I can either upgrade the data by, I think, gradually upgrading versions. Or I can export the data with mongo dump and then import it.
	

## Some experiments

[shell commands](https://docs.mongodb.com/manual/reference/mongo-shell/)

to stop mongo server
`mongo
use admin
db.db.shutdownServer()

I started the mongo conainer with:

`docker run -p 27017:27017 --name tactic-mongo -d mongo:latest`

Then it seems like I can connect from other containers using identical data.

I haven't been able to figure out how to do a mongorestore from my host machine though

The above command to start a container doesn't make a persistent volumne
It goes away when the container is started and stopped.

This command will create a **docker-managed** persistent volumne

`docker run -p 27017:27017 -v /data/db --name tactic-mongo -d mongo:latest`

When I did this and then removed the container with portainer it seems the data was lost.

This command will create a **bind-mount** persistent volumne

`docker run -p 27017:27017 -v ~/mongo/data:/data/db --name tactic-mongo --restart always -d mongo:latest`

### Site on dump and restore

[site](https://dominicmotuka.com/posts/mongodump-and-mongorestore-mongodb-database/)


#### copy to container

`docker cp ~/smalldump/sdump tactic-mongo:/restore`

Then in the container:
`mongorestore /restore`

https://www.mongodb.com/blog/post/archiving-and-compression-in-mongodb-tools
https://docs.mongodb.com/v4.2/reference/program/mongodump/

#### dump to archive

`mongodump --db=totaldump --collection=bsherinrem.tiles --archive=btiles.archive`

`docker cp btiles.archive tactic-mongo:/`

Then, in the container

`mongorestore --archive=btiles.archive`

With compression

`mongodump --db=totaldump --collection=bsherinrem.lists --archive=blists.archive --gzip`

`docker cp blists.archive tactic-mongo:/`

Then, in the container (this seems to overwrite whatever was already there)

`mongorestore --gzip --archive=blists.archive`

### dump whole db (not compressed)

`mongodump --db=totaldump --archive=tdump.archive`

`docker run -p 27017:27017 -v ~/mongo/data:/data/db -v ~/restore:/restore --name tactic-mongo -d mongo:latest`

`mongorestore --archive=/restore/tdump.archive`

`docker run -p 27017:27017 -v ~/mongo/data:/data/db --name tactic-mongo -d mongo:latest`
