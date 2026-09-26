#!/usr/bin/env python3
"""Add an application link to referrals.config.json. Prints the URL once."""

import argparse
import json
import secrets
from hashlib import sha256
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
CONFIG = ROOT / "referrals.config.json"
ALPHABET = "23456789ABCDEFGHJKLMNPQRSTUVWXYZ"


def token():
    return "".join(secrets.choice(ALPHABET) for _ in range(4))


def main():
    parser = argparse.ArgumentParser(description="Create an application portfolio link.")
    parser.add_argument("--company", required=True)
    parser.add_argument("--role", required=True)
    parser.add_argument("--egg", required=True, help="Easter egg id, such as wizard-chess")
    parser.add_argument("--password", help="Required only when this egg does not exist yet")
    parser.add_argument("--no-notify", action="store_true")
    args = parser.parse_args()

    config = json.loads(CONFIG.read_text(encoding="utf-8"))
    eggs = {egg["id"]: egg for egg in config.get("eggs", [])}
    if args.egg not in eggs:
        if not args.password:
            parser.error("--password is required when adding a new easter egg")
        config.setdefault("eggs", []).append(
            {
                "id": args.egg,
                "passwordSha256": sha256(args.password.encode("utf-8")).hexdigest(),
                "enabled": True,
            }
        )
    taken = {item["referralId"] for item in config.get("referrals", [])}
    referral_id = token()
    while referral_id in taken:
        referral_id = token()
    config.setdefault("referrals", []).append(
        {
            "referralId": referral_id,
            "company": args.company,
            "role": args.role,
            "easterEgg": args.egg,
            "notificationsEnabled": not args.no_notify,
        }
    )
    CONFIG.write_text(json.dumps(config, indent=2) + "\n", encoding="utf-8")
    print(f"Application URL: http://127.0.0.1:4174/j/{referral_id}")
    if args.password and args.egg not in eggs:
        print("Password: (the one you just set; it is stored only as a hash)")


if __name__ == "__main__":
    main()
