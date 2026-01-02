# The unused imports here are required so that the
# various handlers are registered via decorators

# Much of the setup is done in tactic_app.py
# This avoids circular imports since the view functions make use
# of things such as app, socketio, and db that are created in __init__.py

from gevent import monkey, hub
monkey.patch_all()

from tactic_logging import setup_logging, log
setup_logging("host")
log.info("starting", extra_flag=True)

try:
    # Silence benign queue-empty/timeouts in gevent hub
    try:
        from queue import Empty as QueueEmpty
    except Exception:  # Py2 fallback if you still need it
        from Queue import Empty as QueueEmpty
    hub.Hub.NOT_ERROR = hub.Hub.NOT_ERROR + (QueueEmpty,)

    from tactic_logging import setup_logging, log
    setup_logging("host")
    log.info("starting", extra_flag=True)

    log.debug("entering host main with suppressed logging")
    log.debug("monkey patching done")
    from rabbit_manage import sleep_until_rabbit_alive
    log.debug("Waiting for rabbit")
    success = sleep_until_rabbit_alive()
    log.debug("Done waiting")

    from tactic_app import app, socketio
    log.debug("back in host_main")
    import users
    log.debug("imported user")
    import auth_views, main_views, library_views, admin_views, pool_views
    import list_views, code_views, tile_views, project_views, collection_views
    import module_viewer_views
    log.debug("imported views")
    import host_workers
    log.debug("imported host_workers")

    log.debug("trying redis stuff")
    import redis_tools
except Exception:
    log.exception("*** fatal error starting host ***")
    log.critical("*** exiting host due to fatal error ***")
    raise


