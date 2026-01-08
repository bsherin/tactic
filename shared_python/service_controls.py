import logging
from redis_tools import redis_client as r

CONTROL_EXCHANGE = "tactic.control.broadcast"

def apply_log_level(level_str: str):
    print(f"*** apply_log_level {level_str} ***")
    level = getattr(logging, level_str.upper(), logging.INFO)
    logging.getLogger().setLevel(level)
    import structlog
    log = structlog.get_logger()
    log.debug("TEST debug")
    log.info("TEST info")
    log.warning("TEST warning")

def process_control_message(msg: dict):
    if msg.get("type") == "set_log_level":
        apply_log_level(msg["level"])

def set_to_redis_log_level() -> str:
    level = r.get("control:log_level")
    print(f"*** set_to_redis_log_level {level} ***")
    if level:
        apply_log_level(level)
    return
