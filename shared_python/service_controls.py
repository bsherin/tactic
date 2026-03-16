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
    log.error("TEST error")

def process_control_message(msg: dict):
    if msg.get("type") == "set_log_level":
        apply_log_level(msg["level"])

def set_to_redis_log_level() -> str:
    level = r.get("control:log_level")
    print(f"*** set_to_redis_log_level {level} ***")
    if level:
        apply_log_level(level)
    return

def get_true_current_log_level() -> str:
    level = logging.getLogger().level
    return logging.getLevelName(level)

def get_redis_log_level() -> str:
    level = r.get("control:log_level")
    if level:
        return level.upper()
    else:
        return "NOT SET"
