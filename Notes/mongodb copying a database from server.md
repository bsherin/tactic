
[[mongodb dumping restoring]][[mongodb in a container]]
On the server:
`mongodump --db=boxerjs --archive=boxerjs.archive`

Copy the file from the server using cyberduck

Back on the local machine:
* Copy the file to the mongo container (since I'm running it in a container)
`docker cp ~/boxerjs.archive tactic-mongo:/restore`
`sudo docker cp ~/tacticdb.archive tactic-mongo:/restore` on the server
A trick here is that instead of copying the file into the container, I can mount the directory containing the
archive as a volume on the container. This deals with the problem of running out of space because it seems
like docker has a cap on its space usage.

Then, using the docker dashboard, exec a terminal into the mongo container and run:
(`sudo docker exec -it tactic-mongo bash`) 
`mongorestore /restore`
I actually think it has to be:
`mongorestore --archive=tacticdb.archive`

A new trick:

