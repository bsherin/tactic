class LatestUpdateCoalescer:
    """Keep at most one update in flight and one trailing update pending."""

    def __init__(self, snapshot, send, on_result=None):
        self.snapshot = snapshot
        self.send = send
        self.on_result = on_result
        self._in_flight_token = None
        self._dirty = False

    @property
    def in_flight(self):
        return self._in_flight_token is not None

    @property
    def dirty(self):
        return self._dirty

    def reset(self):
        # Replacing a tile instance invalidates callbacks for the old instance.
        self._in_flight_token = None
        self._dirty = False

    def request_update(self):
        if self.in_flight:
            self._dirty = True
            return False

        token = object()
        self._in_flight_token = token
        self._dirty = False
        payload = self.snapshot()

        def completed(result):
            # A reset can leave a response for an older tile in the queue.
            if self._in_flight_token is not token:
                return

            if self.on_result is not None:
                self.on_result(result)

            send_trailing_update = self._dirty
            self._in_flight_token = None
            self._dirty = False
            if send_trailing_update:
                self.request_update()

        try:
            self.send(payload, completed)
        except Exception:
            if self._in_flight_token is token:
                self._in_flight_token = None
                self._dirty = False
            raise
        return True
