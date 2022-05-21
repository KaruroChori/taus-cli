## TAUS-CLI
A Command line interface for [Tauri Updater Server](https://github.com/KaruroChori/tauri-update-server) to perform back-end operation on the DB.  
It is an optional component, but its installation alongside TAUS is warmly suggested.  
Design-wise, it tries to address two issues:
- To provide a meaningful set of operations which are relevant for administrative tasks on the DB, to simplify its usage an make it safer.
- To generate pre-processed data for presentation purposes; data about the current adoption of different releases, peak access to the service, possible mis-usage of licences.

Not completed yet: this tool is still under construction and has only partial functionality. A beta release will be out soon.

### Configuration
TAUS-CLI requires a `config.json` file stored in `~/.config/taus-cli` with the sequelize parameters used to connect with the DB server in order to operate.  

### Supported operations
...

### Examples
...
