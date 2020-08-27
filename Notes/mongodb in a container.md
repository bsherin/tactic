
## mongo docker container

	* I tried using this but there was a problem because my existing data isn’t compatible.
	* I can either upgrade the data by, I think, gradually upgrading versions. Or I can export the data with mongo dump and then import it.
	

## Some experiments

I started the mongo conainer with:

`docker run -p 27017:27017 --name tactic-mongo -d mongo:latest`

Then it seems like I can connect from other containers using identical data.

I haven't been able to figure out how to do a mongorestore from my host machine though