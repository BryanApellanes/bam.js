RUNTIME=$1
TOOL=$2

[[ ":$PATH:" != *":~/.bam/toolkit/$RUNTIME/$TOOL:"* ]] && PATH="~/.bam/toolkit/$RUNTIME/$TOOL:${PATH}"