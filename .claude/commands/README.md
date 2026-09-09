# Vendored Comfy Cloud slash commands

These command files are copied verbatim from
[Comfy-Org/comfy-skills](https://github.com/Comfy-Org/comfy-skills) (MIT), at
commit `d50722a53585d0ab4fd1909fd59294b978aad449`.

They normally arrive via `/plugin install comfy-cloud@comfy-skills`, but the
plugin system isn't available in Claude Code cloud sessions, so they're vendored
here instead — that also makes them load automatically in future cloud sessions,
which a container-local install would not.

**The MCP server is not included here.** The upstream plugin also registers
`https://cloud.comfy.org/mcp` as an MCP server; that is connected separately as
the `comfy` custom connector in claude.ai settings.

To update: re-copy `claude-code/commands/*.md` from upstream and bump the commit
hash above.
