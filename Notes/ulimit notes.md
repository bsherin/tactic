https://www.thegeekdiary.com/how-to-set-nproc-hard-and-soft-values-in-centos-rhel-567/

Look at my limits in:
/etc/security/limits.d/20-nproc.conf (RHEL7):

currently running mongodb: version 3.2.22

To check process current limits
`cat /proc/<pid>/limits`

Get process id with: `ps -A` or `pidof mongod`

`ulimit -n 4096` temporarily sets limits

manually start mongodb server: `sudo mongod --config /etc/mongod.conf`
su
stop mongo servers
`mongo
use admin
db.db.shutdownServer()

I edited the file `/etc/security/limits.d/20-nproc.conf` so that it has
increased hard and soft limits for nofile.  These now seem to be reflected
in the limits I see when I do `cat /proc/<pid>/limits` for mongod.
