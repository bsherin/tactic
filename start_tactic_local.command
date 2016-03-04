cd /Users/bls910/PycharmProjects/tactic
source tactic_venv/bin/activate
export USE_SSL=False
export STEP_SIZE=100
export PYTHONUNBUFFERED=1
export USE_LOCAL_SERVER=True
export CHUNK_SIZE=200
export ANYONE_CAN_REGISTER=True
/Users/bls910/PycharmProjects/tactic/tactic_venv/bin/gunicorn -b 127.0.0.1:5000 --worker-class socketio.sgunicorn.GeventSocketIOWorker tactic_run:app