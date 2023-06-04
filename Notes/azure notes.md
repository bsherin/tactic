
https://tactic-staging.sesp.northwestern.edu

ssh sadmin@tactic-staging.sesp.northwestern.edu #Change this URL when we migrate to production


To deploy to tactic-azure with this repo, you'll need to follow these steps:
Ensure that you have added the id_rsa_tactic_azure key to your .ssh directory (as per previous email)

In Terminal:

```
cd <path-to-tactic-azure-deployment-clone>
ansible-playbook -i staging deploy.yml
```

I added these aliases in `.bash_profile`

```
alias azdeploy='cd /Users/bls910/PycharmProjects/tactic-azure-deployment'
alias azplay = 'ansible-playbook -i staging deploy.yml'

alias tazlog='ssh -i ~/.ssh/id_rsa_tactic_azure sadmin@tactic.northwestern.edu sudo tail -f /srv/log/tactic.log'
alias tazerrorlog='ssh -i ~/.ssh/id_rsa_tactic_azure sadmin@tactic.northwestern.edu sudo tail -f /srv/log/tactic_errors.log'

alias ssh_azure = 'ssh -t sadmin@tactic.northwestern.edu'

alias az_resdocker='ssh -i ~/.ssh/id_rsa_tactic_azure sadmin@tactic.northwestern.edu sudo systemctl restart docker'
```

To specify the key manually:

```
alias ssh_azure='ssh -i ~/.ssh/id_rsa_tactic_azure sadmin@tactic.northwestern.edu'
```

Run this ^ with --check at the end to perform a "dry-run"

Do not replace the "staging" inventory file with "production" until we migrate

---
Full deploy procedure now:
```
> az_resdocker
> azdeploy
> azplay
```
