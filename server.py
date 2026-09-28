#!/usr/bin/env python3
"""Local portfolio server.

Serves site/dist, resolves /j/<token> into a referral cookie, and records a
small set of first-party events. It does not look up who the visitor is.
"""

from __future__ import annotations

import json
import mimetypes
import secrets
import threading
from datetime import datetime
from hashlib import sha256
from http.server import BaseHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path
from urllib.parse import parse_qsl, unquote, urlencode, urlparse

ROOT = Path(__file__).resolve().parent
DIST = ROOT / "site" / "dist"
CONFIG_PATH = ROOT / "referrals.config.json"
DATA = ROOT / "data"
EVENTS_PATH = DATA / "events.jsonl"
NOTICES_PATH = DATA / "notices.log"
ACTIVITY_PATH = DATA / "activity.json"

HOST = "127.0.0.1"
PORT = 4174

EVENTS = {
    "portfolio_opened": "Portfolio opened",
    "play_journey_started": "Journey started",
    "quick_view_opened": "Quick View opened",
    "project_opened": "Project viewed",
    "resume_opened": "Resume viewed",
    "contact_opened": "Contact opened",
    "secret_login_opened": "Login opened",
    "secret_login_success": "Secret unlocked",
    "easter_egg_started": "Easter egg started",
}

LOCK = threading.Lock()


def load_config():
    with CONFIG_PATH.open(encoding="utf-8") as handle:
        return json.load(handle)


def read_activity():
    if not ACTIVITY_PATH.exists():
        return {"sessions": {}}
    with ACTIVITY_PATH.open(encoding="utf-8") as handle:
        return json.load(handle)


def write_activity(activity):
    DATA.mkdir(exist_ok=True)
    temporary = ACTIVITY_PATH.with_suffix(".tmp")
    with temporary.open("w", encoding="utf-8") as handle:
        json.dump(activity, handle)
    temporary.replace(ACTIVITY_PATH)


def cookies_from(header):
    found = {}
    for part in (header or "").split(";"):
        if "=" not in part:
            continue
        name, value = part.split("=", 1)
        found[name.strip()] = value.strip()
    return found


def referral_for(token, config):
    for item in config.get("referrals", []):
        if item.get("referralId") == token:
            return item
    return None


def matching_egg(password, config):
    digest = sha256(password.encode("utf-8")).hexdigest()
    found = None
    for egg in config.get("eggs", []):
        if not egg.get("enabled"):
            continue
        if secrets.compare_digest(digest, egg.get("passwordSha256", "")):
            found = egg["id"]
    return found


def append_event(session_id, referral_id, event):
    DATA.mkdir(exist_ok=True)
    line = {
        "t": datetime.now().isoformat(timespec="seconds"),
        "session": session_id,
        "referralId": referral_id,
        "event": event,
    }
    with EVENTS_PATH.open("a", encoding="utf-8") as handle:
        handle.write(json.dumps(line) + "\n")


def write_notice(referral, title, lines):
    if not referral or not referral.get("notificationsEnabled"):
        return
    stamp = datetime.now().strftime("%-I:%M %p")
    body = [
        title,
        "",
        referral.get("company", "Portfolio"),
        referral.get("role", ""),
        "",
        *lines,
        stamp,
        "",
    ]
    DATA.mkdir(exist_ok=True)
    with NOTICES_PATH.open("a", encoding="utf-8") as handle:
        handle.write("\n".join(body))


def record(session_id, referral, event):
    with LOCK:
        activity = read_activity()
        sessions = activity.setdefault("sessions", {})
        state = sessions.setdefault(
            session_id,
            {"events": [], "pending": [], "notices": 0, "lastNotice": 0},
        )
        if event in state["events"]:
            if (
                referral
                and referral.get("notificationsEnabled")
                and state["notices"] == 0
                and state["events"]
            ):
                write_notice(
                    referral,
                    "Portfolio visit",
                    [EVENTS[name] for name in state["events"]],
                )
                state["notices"] = 1
                state["lastNotice"] = datetime.now().timestamp()
                write_activity(activity)
            return
        state["events"].append(event)
        referral_id = referral.get("referralId") if referral else None
        append_event(session_id, referral_id, event)
        if not referral or not referral.get("notificationsEnabled"):
            write_activity(activity)
            return
        label = EVENTS[event]
        if state["notices"] == 0:
            write_notice(referral, "Portfolio visit", [label])
            state["notices"] = 1
            state["lastNotice"] = datetime.now().timestamp()
        elif state["notices"] == 1:
            state["pending"].append(label)
            cooldown = load_config().get("notificationCooldownSeconds", 1800)
            elapsed = datetime.now().timestamp() - state["lastNotice"]
            unlock = event in {"secret_login_success", "easter_egg_started"}
            if unlock or elapsed >= cooldown:
                company = referral.get("company", "Portfolio")
                write_notice(
                    referral,
                    f"{company} portfolio activity",
                    [EVENTS[name] for name in state["events"]],
                )
                state["pending"] = []
                state["notices"] = 2
                state["lastNotice"] = datetime.now().timestamp()
        write_activity(activity)


class Handler(BaseHTTPRequestHandler):
    server_version = "portfolio"

    def log_message(self, fmt, *args):
        # Request lines can include addresses. Keep the console quiet.
        return

    def do_GET(self):
        parsed = urlparse(self.path)
        parts = [unquote(part) for part in parsed.path.split("/") if part]
        if len(parts) == 2 and parts[0] == "j":
            self.redirect_referral(parts[1])
            return
        self.serve_static(parsed.path)

    def do_POST(self):
        parsed = urlparse(self.path)
        length = int(self.headers.get("Content-Length", "0") or 0)
        if length > 4000:
            self.send_error(413)
            return
        raw = self.rfile.read(length) if length else b"{}"
        try:
            payload = json.loads(raw.decode("utf-8") or "{}")
        except json.JSONDecodeError:
            self.send_error(400)
            return
        if parsed.path == "/api/events":
            self.post_event(payload)
            return
        if parsed.path == "/api/login":
            self.post_login(payload)
            return
        self.send_error(404)

    def redirect_referral(self, token):
        config = load_config()
        jar = cookies_from(self.headers.get("Cookie"))
        session_id = jar.get("pf_session") or secrets.token_hex(16)
        self.send_response(302)
        query = dict(parse_qsl(urlparse(self.path).query))
        if referral_for(token, config):
            query["ref"] = token
        self.send_header("Location", "/" + ("?" + urlencode(query) if query else ""))
        self.send_header("Cache-Control", "no-store")
        if referral_for(token, config):
            self.send_header(
                "Set-Cookie",
                f"pf_ref={token}; HttpOnly; SameSite=Lax; Path=/",
            )
        if "pf_session" not in jar:
            self.send_header(
                "Set-Cookie",
                f"pf_session={session_id}; HttpOnly; SameSite=Lax; Path=/",
            )
        self.end_headers()

    def session(self):
        jar = cookies_from(self.headers.get("Cookie"))
        session_id = jar.get("pf_session")
        created = False
        if not session_id:
            session_id = secrets.token_hex(16)
            created = True
        config = load_config()
        referral = referral_for(jar.get("pf_ref", ""), config)
        return session_id, created, referral

    def post_event(self, payload):
        event = payload.get("event")
        if event not in EVENTS:
            self.send_error(400)
            return
        session_id, created, referral = self.session()
        record(session_id, referral, event)
        self.send_response(204)
        self.send_header("Cache-Control", "no-store")
        if created:
            self.send_header(
                "Set-Cookie",
                f"pf_session={session_id}; HttpOnly; SameSite=Lax; Path=/",
            )
        self.end_headers()

    def post_login(self, payload):
        password = payload.get("password", "")
        if not isinstance(password, str) or len(password) > 80:
            self.send_json({"ok": False})
            return
        config = load_config()
        egg = matching_egg(password, config)
        session_id, created, referral = self.session()
        if egg:
            record(session_id, referral, "secret_login_success")
            self.send_json({"ok": True, "egg": egg}, session_id if created else None)
            return
        self.send_json({"ok": False}, session_id if created else None)

    def send_json(self, payload, session_id=None):
        body = json.dumps(payload).encode("utf-8")
        self.send_response(200)
        self.send_header("Content-Type", "application/json")
        self.send_header("Cache-Control", "no-store")
        self.send_header("Content-Length", str(len(body)))
        if session_id:
            self.send_header(
                "Set-Cookie",
                f"pf_session={session_id}; HttpOnly; SameSite=Lax; Path=/",
            )
        self.end_headers()
        self.wfile.write(body)

    def serve_static(self, path):
        relative = unquote(path).lstrip("/") or "index.html"
        candidate = (DIST / relative).resolve()
        if DIST not in candidate.parents and candidate != DIST:
            self.send_error(404)
            return
        if candidate.is_dir():
            candidate = candidate / "index.html"
        if not candidate.is_file():
            self.send_error(404)
            return
        data = candidate.read_bytes()
        mime = mimetypes.guess_type(candidate.name)[0] or "application/octet-stream"
        self.send_response(200)
        self.send_header("Content-Type", mime)
        self.send_header("Content-Length", str(len(data)))
        self.send_header("Cache-Control", "no-store")
        self.end_headers()
        self.wfile.write(data)


def main():
    ThreadingHTTPServer.allow_reuse_address = True
    server = ThreadingHTTPServer((HOST, PORT), Handler)
    print(f"Portfolio at http://{HOST}:{PORT}")
    server.serve_forever()


if __name__ == "__main__":
    main()
