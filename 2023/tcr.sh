node $1 && (git add . -A && git commit -m "$1 TCR") || git reset --hard
