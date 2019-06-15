TOOL=$1

[[ ":$PATH:" != *":~/.bam/toolkit/$TOOL:"* ]] && PATH="~/.bam/toolkit/$TOOL:${PATH}"