#!/bin/sh
# sfumato installer — https://sfumato.sh
#
#   curl -fsSL https://sfumato.sh/install.sh | sh
#
# Environment:
#   SFUMATO_VERSION   version to install (default: latest release)
#   SFUMATO_BIN_DIR   install directory (default: ~/.local/bin)
#   SFUMATO_NO_MODIFY_PATH=1   skip the PATH hint

set -eu

REPO="getsfumato/cli"
BIN="sfumato"
TMP=""

# ---- output ----------------------------------------------------------------

if [ -t 2 ] && [ -z "${NO_COLOR:-}" ]; then
  C_DIM=$(printf '\033[2m'); C_GOLD=$(printf '\033[33m')
  C_RED=$(printf '\033[31m'); C_OFF=$(printf '\033[0m')
else
  C_DIM=''; C_GOLD=''; C_RED=''; C_OFF=''
fi

say()  { printf '%s\n' "$*" >&2; }
step() { printf '%s>%s %s\n' "$C_GOLD" "$C_OFF" "$*" >&2; }
dim()  { printf '%s  %s%s\n' "$C_DIM" "$*" "$C_OFF" >&2; }
die()  { printf '%serror%s %s\n' "$C_RED" "$C_OFF" "$*" >&2; exit 1; }

cleanup() { [ -n "$TMP" ] && [ -d "$TMP" ] && rm -rf "$TMP"; }
trap cleanup EXIT INT TERM

need() { command -v "$1" >/dev/null 2>&1; }

# ---- platform -------------------------------------------------------------

# The glibc the `-gnu` release artifacts are linked against, from the runner image
# release.yml pins. Raise it only alongside that image.
GLIBC_FLOOR=2.35

host_glibc() {
  # "ldd (Ubuntu GLIBC 2.35-0ubuntu3.1) 2.35" -> "2.35"
  ldd --version 2>/dev/null | head -n 1 | tr ' ' '\n' | tail -n 1
}

# older_than <version> <floor>
older_than() {
  # sort -V puts the lower version first, so $1 is older exactly when it sorts
  # first and the two differ.
  [ "$1" != "$2" ] && [ "$(printf '%s\n%s\n' "$1" "$2" | sort -V | head -n 1)" = "$1" ]
}

detect_target() {
  os=$(uname -s)
  arch=$(uname -m)

  case "$arch" in
    x86_64 | amd64) arch=x86_64 ;;
    aarch64 | arm64) arch=aarch64 ;;
    *) die "unsupported architecture: $arch" ;;
  esac

  case "$os" in
    Darwin) echo "${arch}-apple-darwin" ;;
    Linux)
      # a musl host needs the statically linked build
      if need ldd && ldd --version 2>&1 | grep -qi musl; then
        echo "${arch}-unknown-linux-musl"
      elif [ -n "$(host_glibc)" ] && older_than "$(host_glibc)" "$GLIBC_FLOOR"; then
        # The -gnu builds are linked on Ubuntu 22.04, so a host below its glibc
        # cannot run them: the install would succeed and every later invocation
        # would fail with "GLIBC_2.xx not found". The musl build is fully static
        # and runs anywhere, so prefer it over a confident failure.
        echo "${arch}-unknown-linux-musl"
      else
        echo "${arch}-unknown-linux-gnu"
      fi
      ;;
    *) die "unsupported operating system: $os (macOS and Linux only)" ;;
  esac
}

# ---- download -------------------------------------------------------------

fetch() {
  # fetch <url> <dest>
  if need curl; then
    curl -fsSL --retry 3 --connect-timeout 20 -o "$2" "$1"
  elif need wget; then
    wget -qO "$2" "$1"
  else
    die "need curl or wget"
  fi
}

fetch_stdout() {
  if need curl; then
    curl -fsSL --retry 3 --connect-timeout 20 "$1"
  elif need wget; then
    wget -qO- "$1"
  else
    die "need curl or wget"
  fi
}

latest_version() {
  fetch_stdout "https://api.github.com/repos/$REPO/releases/latest" 2>/dev/null \
    | sed -n 's/.*"tag_name"[[:space:]]*:[[:space:]]*"v\{0,1\}\([^"]*\)".*/\1/p' \
    | head -n 1
}

verify() {
  # verify <file> <expected-sha256>
  if need sha256sum; then
    actual=$(sha256sum "$1" | cut -d' ' -f1)
  elif need shasum; then
    actual=$(shasum -a 256 "$1" | cut -d' ' -f1)
  else
    dim "no sha256 tool available — skipping checksum verification"
    return 0
  fi
  [ "$actual" = "$2" ] || die "checksum mismatch
  expected $2
  actual   $actual"
  dim "checksum ok"
}

# ---- cargo fallback -------------------------------------------------------

# Builds from the repository rather than from crates.io: sfumato is not
# published there yet. Switch to `cargo install sfumato --locked` once it is.
cargo_fallback() {
  say ''
  if need cargo; then
    step "no prebuilt binary for this platform — building from source"
    dim "this takes a few minutes"
    cargo install --git "https://github.com/$REPO" --locked "$BIN"
    say ''
    say "  installed $BIN via cargo"
    exit 0
  fi
  die "no prebuilt binary available for $TARGET, and cargo was not found.

  Install Rust, then build from source:
    curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh
    cargo install --git https://github.com/$REPO --locked $BIN"
}

# ---- main -----------------------------------------------------------------

TARGET=$(detect_target)
step "target $TARGET"

VERSION="${SFUMATO_VERSION:-}"
if [ -z "$VERSION" ]; then
  VERSION=$(latest_version || true)
  [ -n "$VERSION" ] || cargo_fallback
fi
VERSION="${VERSION#v}"
step "version $VERSION"

BIN_DIR="${SFUMATO_BIN_DIR:-${XDG_BIN_HOME:-$HOME/.local/bin}}"
ARCHIVE="${BIN}-v${VERSION}-${TARGET}.tar.gz"
BASE="https://github.com/$REPO/releases/download/v${VERSION}"

TMP=$(mktemp -d 2>/dev/null || mktemp -d -t sfumato)

step "downloading $ARCHIVE"
if ! fetch "$BASE/$ARCHIVE" "$TMP/$ARCHIVE" 2>/dev/null; then
  cargo_fallback
fi

# checksums file is optional; verify when it is published
if fetch "$BASE/${ARCHIVE}.sha256" "$TMP/sum" 2>/dev/null; then
  verify "$TMP/$ARCHIVE" "$(cut -d' ' -f1 < "$TMP/sum")"
fi

step "extracting"
tar -xzf "$TMP/$ARCHIVE" -C "$TMP" || die "could not extract $ARCHIVE"

FOUND=$(find "$TMP" -type f -name "$BIN" -perm -u+x 2>/dev/null | head -n 1)
[ -n "$FOUND" ] || FOUND=$(find "$TMP" -type f -name "$BIN" 2>/dev/null | head -n 1)
[ -n "$FOUND" ] || die "archive did not contain a '$BIN' binary"

mkdir -p "$BIN_DIR" || die "could not create $BIN_DIR"
[ -w "$BIN_DIR" ] || die "$BIN_DIR is not writable
  retry with:  SFUMATO_BIN_DIR=\"\$HOME/.local/bin\" sh"

# install to a temp name in the target dir, then rename, so a running binary is
# never truncated mid-write
install -m 755 "$FOUND" "$BIN_DIR/.${BIN}.new" 2>/dev/null || {
  cp "$FOUND" "$BIN_DIR/.${BIN}.new" && chmod 755 "$BIN_DIR/.${BIN}.new"
} || die "could not write to $BIN_DIR"
mv -f "$BIN_DIR/.${BIN}.new" "$BIN_DIR/$BIN"

step "installed $BIN_DIR/$BIN"

# macOS quarantines downloaded binaries; clear it so the first run is not blocked
if [ "$(uname -s)" = "Darwin" ] && need xattr; then
  xattr -d com.apple.quarantine "$BIN_DIR/$BIN" 2>/dev/null || true
fi

# ---- PATH -----------------------------------------------------------------

case ":$PATH:" in
  *":$BIN_DIR:"*) on_path=1 ;;
  *) on_path=0 ;;
esac

say ''
if [ "$on_path" = 1 ]; then
  say "  $BIN $("$BIN_DIR/$BIN" --version 2>/dev/null | head -n1 | awk '{print $NF}' || echo "$VERSION") is ready"
  say ''
  dim "next:  $BIN init user"
elif [ "${SFUMATO_NO_MODIFY_PATH:-0}" != 1 ]; then
  say "  $BIN_DIR is not on your PATH. Add it:"
  say ''
  # Defaulted before the expansion: `set -u` makes a bare ${SHELL##*/} abort when
  # SHELL is unset, which is common in containers — so the script died on its last
  # and most helpful line, after having installed successfully.
  shell_name="${SHELL:-}"
  case "${shell_name##*/}" in
    zsh)  say "    echo 'export PATH=\"$BIN_DIR:\$PATH\"' >> ~/.zshrc && exec zsh" ;;
    fish) say "    fish_add_path $BIN_DIR" ;;
    *)    say "    echo 'export PATH=\"$BIN_DIR:\$PATH\"' >> ~/.bashrc && exec bash" ;;
  esac
  say ''
  dim "then:  $BIN init user"
fi
say ''
