"""Build the pre-change backend without touching the user's working tree."""
import io
import os
from pathlib import Path
import subprocess
import tempfile
import zipfile

root = Path(__file__).resolve().parent.parent
revision = "84f11d508a1b0217e5b46f60ee2fd5919917ec1e"
archive = subprocess.check_output(["git", "archive", "--format=zip", revision, "backend"], cwd=root)
with tempfile.TemporaryDirectory(prefix="blog-baseline-") as temp:
    with zipfile.ZipFile(io.BytesIO(archive)) as bundle:
        bundle.extractall(temp)
    env = {**os.environ, "GOOS": "linux", "GOARCH": "amd64", "CGO_ENABLED": "0"}
    subprocess.run(["go", "build", "-o", str(root / "bench/backend-baseline"), "./main.go"], cwd=Path(temp)/"backend", env=env, check=True)
print(f"Built isolated baseline {revision}; no checkout or user changes modified.")
