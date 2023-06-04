
To start the mongo database on my mac just execute this from the terminal:

mongod

cd /Users/bls910/Library/Caches/Google/Chrome/Default/

/usr/local/bin/ip -4 addr show en0

pushing

ssh tactic.northwestern.edu

When logged into server can type this to restart docker:
Doing this might help the server restart more quickly.

sudo systemctl restart docker

source tactic_venv/bin/activate

---

manually start mongo on server
sudo mongod --config /etc/mongod.conf

sudo tail -n 50 /var/log/mongodb/mongod.log

2021-10-01T17:02:32.234-0500 I

---
error: [Errno 24] Too many open files
https://docs.mongodb.com/manual/reference/ulimit/
Recommended ulimit Settings

Every deployment may have unique requirements and settings; however, the following thresholds and settings are particularly important for mongod and mongos deployments:

-f (file size): unlimited
-t (cpu time): unlimited
-v (virtual memory): unlimited [1]
-n (open files): 64000
-m (memory size): unlimited [1] [2]
-u (processes/threads): 64000

ulimit -n 64000
sudo bash -c "ulimit -n 64000"

---
Debugging containers.

Have to build the images with this command.
docker-compose -f dc-debug.yml build

And run with a run configuration that has DEBUG_MAIN/TILE_CONTANER = True

---
sudo docker stats --format "table {{.Name}}\t{{.MemPerc}}\t{{.CPUPerc}}\t{{.MemUsage}}"
---

Hi Bruce, it looks to me like most of what’s filling up that /var partition is “dangling” docker images.
That is, when you create a new image and tag it, any previous images with that same tag are not deleted but are
instead considered “dangling”. You can remove them by running `sudo docker image prune` on that host.

Let me know if you have any questions or would like me to go ahead and run that command.

file sizes:

CD to /var and run:

du -dk| sort -nr| more

This will give you a listing of the largest files under /var (assuming it's a separate FS from root judging by the error you received). You can then explore from there, but I wouldn't delete anything under sadm or patch.
---

alias tactic='cd /Users/bls910/PycharmProjects/tactic'
alias t_active='source tactic_venv/bin/activate'
alias tdeploy='cd /Users/bls910/PycharmProjects/tactic_deployment/tactic-deployment'
alias aplay='ansible-playbook -i production deploy.yml'
alias tlog='ssh -t tactic.northwestern.edu sudo tail -f /srv/log/tactic.log'
alias terrorlog='ssh -t tactic.northwestern.edu sudo tail -f /srv/log/tactic_errors.log'
alias trestart='ansible servers -i production -m service -a "name=gunicorn state=restarted"'

---
on server: to relaunch reset start
cd /srv/tactic
sudo /srv/venv/bin/python launch_tactic.py
Lately I've had to do these three steps after restarting server:
One time I had to create a this directory `/var/run/mongodb` to get the mongo server to start.

Often have to set limits with `ulimit -n 4096`
manually start mongodb server: `sudo mongod --config /etc/mongod.conf`
---
Now mongo is running in a docker container.
The command for creating the mongodb container on the server
`sudo docker run -p 27017:27017 -v /var/lib/mongo2:/data/db --name tactic-mongo --network=tactic-net --restart always -d mongo:latest`

----
sudo systemctl daemon-reload && sudo systemctl restart gunicorn.service

And if you want to do it with ansible, you need the “-b” flag (for “become”, IE “use sudo”). I guess I forgot that when sending you the command earlier:

ansible servers -b -i production -m service -a "name=gunicorn state=restarted"

----
docker rm -f $(docker ps -a -q)

---
sudo docker exec -it tactic_host5001 /bin/bash
--

my current procedure for updating the server with new source is captured in building_steps.md

---
documentation in rst

touch *.rst
make html
