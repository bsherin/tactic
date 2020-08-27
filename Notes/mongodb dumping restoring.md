# mongo dumping, restoring stuff
#tactic/coding
## This actually seems very way - dumps directly from server to my laptop
this line lets me mount the remote as if it's local. Explained here: [shell - Sync MongoDB Via ssh - Stack Overflow](https://stackoverflow.com/questions/16619598/sync-mongodb-via-ssh)
I didn’t end up using this for anything.

### set up an ssh tunnel like this:
```
ssh -i ~/.ssh/id_rsa_tactic_azure sadmin@tactic.northwestern.edu -L27018:localhost:27017
```
leave the ssh terminal open

### run mongo on port 27018
Then in another window run:
```
mongo —port 27018 
```
and leave this open

### dump from this port
then can directly dump like this
it’s better to dump fs.chunks separately because it takes a very long time - it’s most of the time
note that dumping overwrites what's in the old folder
```
mongodump --host="localhost" --port=27018 --db=tacticdb --collection=fs.chunks
mongodump --host="localhost" --port=27018 --db=tacticdb --collection=fs.files
mongodump —host=“localhost” —port=27018 --db=tacticdb —-excludeCollectionsWithPrefix=fs
```

### restore to the local database
```
mongorestore —db totaldump dump/tacticdb
mongorestore —db totaldump --collection bsherinrem.code dump/tacticdb/bsherinrem.code.bson

mongorestore -db totaldump --nsExclude='fs.*' dump/tacticdb
```

## alternative stuff

This is how to dump an entire database or a single collection.
To do this on the server I first ssh in.

```
ssh -i ~/.ssh/id_rsa_tactic_azure sadmin@tactic.northwestern.edu 
mongodump —db=remotecopy
mongodump --db=tacticdb --collection=bsherinrem.tiles
```

This result of a dump as above is a directory called `dump`.
I can use this command to compress and copy it to my local machines

```
ssh -i ~/.ssh/id_rsa_tactic_azure sadmin@tactic.northwestern.edu "tar -cf - dump | gzip -9" >  newdump.tgz

```

Can use the mongo shell to drop (delete) a single collection:
```
mongo
> use copytest
switched to db copytest
> db.repository.tiles.drop()
```

To restore a single collection I use a line like one of those below.
```
mongorestore --db remotecopy --collection repository.tiles dump/tacticdb/repository.tiles.bson
mongorestore --db remotecopy --collection bsherinrem.tiles dump/tacticdb/bsherinrem.tiles.bson
mongorestore --db remotecopy --collection bsherinrem.code dump/tacticdb/bsherinrem.code.bson


```

