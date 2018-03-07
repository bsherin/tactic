Running a Tactic Server
=======================

This is some preliminary documentation for running your own Tactic
server. I haven’t tried following these instruction myself, so it very
well might not work. But this should get you started.

I have so far run Tactic on Linux and under OS X.

(1) Install and start a MongoDb server. I have a note to myself that
    says: “Have to edit mongodb.conf so that it listens on all
    interfaces (comment out the bindIp line).” But I didn’t do this when
    recently creating an installation under OS X.

(2) Install and start Docker.

(3) Get the source code from the Tactic repository on Github.

(4) Create and activate a python virtual environment inside the folder.
    I did something like this:

``virtualenv -p /usr/bin/python2.7 tactic_env``

(The -p option lets you select a the python interpreter to be used. You
want 2.7.x)

After creating the virtual environment, you have to activate it:

``source tactic_venv/bin/activate``

(4) Download all of the dependencies. I have sometimes found that is it
    necessary to first run:

``sudo apt-get install build-essential``

in order to get the installation of gevent to work. In any case, run
this next to install the requirements.

``pip install -r requirements.txt``

(5) Create all of the needed docker images by cding into the tactic_app
    folder and running:

``docker-compose build``

(6) There is no longer a step (6). Enjoy the added free time.

(7) Create a script for starting tactic. The terminal script that I use
    on my ubuntu linux computer looks like this:

::

    cd ~/PycharmProjects/tactic
    source tactic_venv/bin/activate
    export USE_SSL=False
    export STEP_SIZE=100
    export PYTHONUNBUFFERED=1
    export USE_LOCAL_SERVER=True
    export CHUNK_SIZE=200
    export MAX_QUEUE_LENGTH=500
    export ANYONE_CAN_REGISTER=True
    export SHORT_SLEEP_PERIOD=.0001
    export LONG_SLEEP_PERIOD=.1
    ~/PycharmProjects/tactic/tactic_venv/bin/gunicorn -b 0.0.0.0:5000 --worker-class socketio.sgunicorn.GeventSocketIOWorker tactic_run:app

You’ll have to edit the first and last lines so that they contain the
correct paths for your own machine.

(8)  Execute this script. If you have lived a good life to this point,
     then the Tactic server will start. If it starts, but gives an error
     message or two, count your blessings and go on to step (9).

(9)  Go to a browser and enter 0.0.0.0:5000. You should see the prompt
     to log in. Since there aren’t any user accounts, you can’t log in
     yet. So, click the “register’ button to create an account. The
     first thing you should do is to create an account with the
     username”admin." That’s the administration account. The other
     special account is called “repository.” This is where the shared
     resources live. If you set ANYONE_CAN_REGISTER=False then the admin
     user can still create new accounts, but no one else can.

(10) One remaining problem is that the repository on your local machine
     isn’t populated. There’s no simple fix for this right now. The
     right fix might be to allow a local server to still use a remote
     repository. But that isn’t implemented.
