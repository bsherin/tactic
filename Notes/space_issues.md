### Problems with space on the server

Steps that I can take:

* delete the existing tactic_tile image
* delete other unused images: `sudo docker image rm image_name` `sudo docker rmi imageid`
* prune images: `sudo docker image prune`
* prune volumes: `sudo docker volume prune`
* remove log files in `/srv/log` (in one case tactic_errors.log was very large)


## Usage of a single folder

`sudo du -sh /home`
`sudo du -sh /home/*`

### Some results
- 2.8G /home/sadmin tactic.archive
- 24G /var/lib
- 14G     /var/lib/docker
- 7.7G    /var/lib/mongo

Restarting docker and then doing docker system prune got docker down to 9.9GB
When I restarted docker it went back to 14GB


## finding usage info
https://linuxhint.com/check_disk_space_centos/
    

## server linux version
$ cat /etc/*-release
CentOS Linux release 7.8.2003 (Core)
NAME="CentOS Linux"
VERSION="7 (Core)"
ID="centos"
ID_LIKE="rhel fedora"
VERSION_ID="7"
PRETTY_NAME="CentOS Linux 7 (Core)"
ANSI_COLOR="0;31"
CPE_NAME="cpe:/o:centos:centos:7"
HOME_URL="https://www.centos.org/"
BUG_REPORT_URL="https://bugs.centos.org/"

CENTOS_MANTISBT_PROJECT="CentOS-7"
CENTOS_MANTISBT_PROJECT_VERSION="7"
REDHAT_SUPPORT_PRODUCT="centos"
REDHAT_SUPPORT_PRODUCT_VERSION="7"

CentOS Linux release 7.8.2003 (Core)

