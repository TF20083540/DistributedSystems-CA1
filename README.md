# Thomas Farrell - 20083540

# Distributed Systems - CA1

GitRepo: https://github.com/TF20083540/DistributedSystems-CA1
Demonstration Video: https://youtu.be/_XEbaW58UIA

Baseline: Rest-Api
Removed: Movies DB
Added: Games DB
Added: Authentication required to POST game.
Added: DELETE function to remove game from gameTable.
Added: Authentication required to DELETE game.
Added: PUT function to update the contents of a gameTable object. This requires Authentication.

Authentication required is based on logic. Reading is public data, whereas adding or removing data would require authentication so as to avoid malicious users deleting data.