#!/bin/sh
# Chromium launcher for the renderer when running as root (containers): adds --no-sandbox.
exec /opt/pw-browsers/chromium-1194/chrome-linux/chrome --no-sandbox "$@"
