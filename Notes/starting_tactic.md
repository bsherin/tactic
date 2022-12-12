
### run on mac, arm, dev mode
```
start_tactic.sh \
	--root /Users/brucesherin/PycharmProjects/tactic \
	--mdir ~/mongo/data \
	--arm64 \
	--dev
	
./start_tactic.sh \
	--root /Users/bls910/PycharmProjects/tactic \
	--mdir ~/mongo/data \
	--dev

# starting with old remote repo on NU server
start_tactic.sh \
	--root /Users/brucesherin/PycharmProjects/tactic \
	--mdir ~/mongo/data \
	--arm64 \
	--dev \
	--remote-repo bls910 "geeb----"


# starting with aws remote repository
start_tactic.sh \
	--root /Users/brucesherin/PycharmProjects/tactic \
	--mdir ~/mongo/data \
	--arm64 \
	--dev \
	--remote-repo-key centos "/Users/brucesherin/PycharmProjects/tactic/LightsailDefaultKey-us-east-2.pem"
	
# starting with aws remote database
start_tactic.sh \
	--root /Users/brucesherin/PycharmProjects/tactic \
	--arm64 \
	--dev \
	--remote-db centos "/Users/brucesherin/PycharmProjects/tactic/LightsailDefaultKey-us-east-2.pem"

```

### run on NU server
```
sudo /srv/tactic/tactic_app/start_tactic.sh \
	--root /srv/tactic \
	--mdir /var/lib/mongo2
```

### run on AWS server
```
# from remote
sudo systemctl start docker
sudo /srv/tactic/tactic_app/start_tactic.sh --root /srv/tactic --mdir /tacticdata/mongo/data

# from local mac
ssh -i /Users/brucesherin/PycharmProjects/tactic/LightsailDefaultKey-us-east-2.pem centos@tactictext.net \
"sudo /srv/tactic/tactic_app/start_tactic.sh --root /srv/tactic --mdir /tacticdata/mongo/data"
```