import re
import subprocess
from pathlib import Path

ROOT = Path(__file__).parents[1]
ENV = ROOT / ".env.local"

def main() -> None:
    result = subprocess.run(
        ["genlayer", "deploy", "--contract", "contracts/Accordium.py"],
        cwd=ROOT, check=True, text=True, capture_output=True,
    )
    output = result.stdout + result.stderr
    match = re.search(r"0x[a-fA-F0-9]{40}", output)
    if not match:
        raise SystemExit("Deployment finalized but no contract address was found in CLI output.\n" + output)
    address = match.group(0)
    current = ENV.read_text() if ENV.exists() else ""
    line = f"NEXT_PUBLIC_ACCORDIUM_CONTRACT={address}"
    if "NEXT_PUBLIC_ACCORDIUM_CONTRACT=" in current:
        current = re.sub(r"NEXT_PUBLIC_ACCORDIUM_CONTRACT=.*", line, current)
    else:
        current = current.rstrip() + "\n" + line + "\n"
    ENV.write_text(current.lstrip())
    print(f"ACCORDIUM_CONTRACT={address}")

if __name__ == "__main__":
    main()
