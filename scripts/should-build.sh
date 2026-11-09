#!/bin/sh
# Vercel "Ignored Build Step": exit 1 = build, exit 0 = skip.
# 0. Preview deployments (branches, PRs) are never built: they only cost build
#    minutes. Production = pushes to main and the admin's Publish hook.
if [ "$VERCEL_ENV" != "production" ]; then
  echo "Preview ($VERCEL_ENV): skipped."
  exit 0
fi
# 1. The admin pressed Publish (deploy hook) → the marker exists on R2 → build.
#    (A deploy hook brings no new commit, so the git check alone would skip it.)
if [ -n "$R2_PUBLIC_URL" ] && curl -fsS -o /dev/null --max-time 10 "${R2_PUBLIC_URL%/}/site/publish-pending"; then
  echo "Admin publish pending: building."
  exit 1
fi
# 2. Otherwise build only when something that affects the site changed.
git diff --quiet HEAD^ HEAD -- . ':(exclude)docs' ':(exclude)*.md' ':(exclude)media-src'
