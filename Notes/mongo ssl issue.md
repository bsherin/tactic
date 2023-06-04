# pip install mongo ssl issues openssl
It seems like I have to downgrade, start mongo, then re-upgrade

To get mongo to work I seem to have to downgrade openssl sometimes
[Mongodump cannot find openssl version on macOS Catalina - help - Meteor forums](https://forums.meteor.com/t/mongodump-cannot-find-openssl-version-on-macos-catalina/50912/2)

brew uninstall --ignore-dependencies openssl
brew install https://raw.githubusercontent.com/Homebrew/homebrew-core/30fd2b68feb458656c2da2b91e577960b11c42f4/Formula/openssl.rb

This site: https://stackoverflow.com/questions/59006602/dyld-library-not-loaded-usr-local-opt-openssl-lib-libssl-1-0-0-dylib

suggests this: `brew switch openssl 1.0.2t`


But other cases seem to require me to re-upgrade
brew reinstall openssl

Problems with pip install
[macos - SSLError in Python virtualenv - Stack Overflow](https://stackoverflow.com/questions/60073183/sslerror-in-python-virtualenv)

Running pip3 in some cases helped. 

Need the stuff below because path of root user doesn’t have pip3

`sudo env PATH=$PATH pip3 install -r requirements.txt`