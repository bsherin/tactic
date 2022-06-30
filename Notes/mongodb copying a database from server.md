
[[mongodb dumping restoring]][[mongodb in a container]]
On the server:
`mongodump --db=boxerjs archive=boxerjs.archive`

Copy the file from the server using cyberduck

Back on the local machine:
* Copy the file to the mongo container (since I'm running it in a container)
`docker cp ~/boxerjs.archive tactic-mongo:/restore`

Then, using the docker dashboard, exec a terminal into the mongo container and run:
`mongorestore /restore`
I actually think it has to be:
`mongorestore --archive=restore`
in this case
