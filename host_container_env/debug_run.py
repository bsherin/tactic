from gevent import monkey
monkey.patch_all()

from host_main import app

if __name__ == "__main__":
    # single process, debugger-friendly
    app.run(host="0.0.0.0", port=5000, debug=True, use_reloader=False)