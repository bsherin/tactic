
### run on mac, arm, dev mode
```
start_tactic.sh \
	--root /Users/brucesherin/PycharmProjects/tactic \
	--mdir ~/mongo/data \
	--arm64 \
	--dev

start_tactic.sh \
	--root /Users/brucesherin/PycharmProjects/tactic \
	--mdir ~/mongo/data \
	--arm64 \
	--dev \
	--remote-repo bls910 "geeb----"

```

### run on server
```
start_tactic.sh \
	--root /srv/tactic \
	--mdir /var/lib/mongo2 \
```