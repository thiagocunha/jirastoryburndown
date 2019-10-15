# gojiramonitor
This is a plugin for monitoring changes on a Jira instance using a specific filter. It will only list the tickets that were updated by IDs that aren't in the configured list of internal IDs.

In order to use it, you need to first setup some parameters on the options menu.
Base Jira URL:
- Something like https://jira.domain.com/

Internal users ids:
- Include one ID per line. Something like X00000

Filter id:
- The id of the filter for getting the tickets from. Something like 92890230.
