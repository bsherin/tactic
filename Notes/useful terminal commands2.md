
/usr/local/bin/ip -4 addr show en0

`ssh tactic.northwestern.edu`

When logged into server can type this to restart docker:
Doing this might help the server restart more quickly.

`sudo systemctl restart docker`

`source tactic_venv/bin/activate`

---

mongo on the server
```
sudo mongod --config /etc/mongod.conf

sudo tail -n 50 /var/log/mongodb/mongod.log
``````



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

`sudo docker image prune` 
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
````
cd /srv/tactic
sudo /srv/venv/bin/python launch_tactic.py
````

### Lately I've had to do these steps first

Ceate this directory `/var/run/mongodb` 
Set limits with `ulimit -n 4096`
manually start mongodb server
`sudo mongod --config /etc/mongod.conf`

---

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
