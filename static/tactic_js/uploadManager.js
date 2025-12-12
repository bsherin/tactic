// uploadManager.js
const uploads = new Map();     // id -> upload state
const listeners = new Set();

function snapshot() {
    return Array.from(uploads.values()).map(u => ({
        id: u.id,
        fileName: u.file?.name,
        size: u.file?.size,
        pct: u.pct,
        loaded: u.loaded,
        total: u.total,
        status: u.status, // uploading|done|error|aborted
        error: u.error,
    }));
}

function notify() {
    const s = snapshot();
    for (const fn of listeners) fn(s);
}

export const uploadManager = {
    subscribe(fn) {
        listeners.add(fn);
        fn(snapshot());
        return () => listeners.delete(fn);
    },

    abort(id) {
        const u = uploads.get(id);
        if (!u) return;
        if (u.xhr && u.status === "uploading") {
            u.status = "aborted";
            u.error = "Canceled by user";
            try {
                u.xhr.abort();
            } catch {
            }
            notify();
        }
    },

    clear(id) {
        if (id) {
            uploads.delete(id);
            notify();
        }
    },

    async startPresignedPostUpload({file, url, fields, meta = {}}) {
        const id = `${Date.now()}-${Math.random().toString(16).slice(2)}`;

        const u = {
            id,
            file,
            pct: 0,
            loaded: 0,
            total: file.size || 0,
            status: "uploading",
            error: null,
            xhr: null,
            meta, // e.g. dest_path, bucket, key, etc.
        };
        uploads.set(id, u);
        notify();

        const fd = new FormData();
        Object.entries(fields).forEach(([k, v]) => fd.append(k, v));
        fd.append("file", file);

        return await new Promise((resolve) => {
            const xhr = new XMLHttpRequest();
            u.xhr = xhr;

            xhr.open("POST", url, true);

            xhr.upload.onprogress = (e) => {
                u.loaded = e.loaded || 0;
                u.total = e.total || u.total;
                if (e.lengthComputable && e.total) u.pct = (e.loaded / e.total) * 100;
                notify();
            };

            xhr.onload = () => {
                if (u.status === "aborted") return resolve({id, success: false, aborted: true});
                if (xhr.status >= 200 && xhr.status < 300) {
                    u.status = "done";
                    u.pct = 100;
                    notify();
                    return resolve({id, success: true});
                } else {
                    u.status = "error";
                    u.error = xhr.responseText || `Status ${xhr.status}`;
                    notify();
                    return resolve({id, success: false, error: u.error});
                }
            };

            xhr.onerror = () => {
                if (u.status === "aborted") return resolve({id, success: false, aborted: true});
                u.status = "error";
                u.error = "Network error";
                notify();
                return resolve({id, success: false, error: u.error});
            };

            xhr.send(fd);
        });
    },
};