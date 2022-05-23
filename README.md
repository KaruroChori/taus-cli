## TAUS-CLI
An optional component for [Tauri Updater Server](https://github.com/KaruroChori/tauri-update-server) to perform back-end operation on the DB via a command line interface.  
The queries performed are also suggested as a potential starting point to implement web-api to integrate with custom user interfaces and visualization tools.  
While optional, it is suggested to be installed alongside TAUS as it provides a simpler and more secure way to operate on the DB directly.  

Design-wise, this is the scope of its implementation:
- To provide a meaningful and minimal set of operations which are relevant for administrative tasks on the DB, mostly for testing purposes.
- To return pre-processed data to be later integrated in a presentation workflow, e.g. data about the current adoption for different releases, peak access to the service, possible mis-usage of licences.

All core features have been completed, however both the cli interface and the schema for any returned data is not fixed yet. Please, consider it as alpha software if you plan to integrate it with other tools or workflows.

### Configuration
Before running `taus-cli` you will need to provide some configuration to connect with the database server. You will require a `config.json` file stored in `~/.config/taus-cli`, integrating the sequelize parameters used to the connection.  
You can use those files stored in the subfolder `template` and copy them to `~/.config/taus-cli` for a test environment based on sqlite3.  

### Supported operations
Since there is no better documentation at the moment, I would simply suggest to use the `--help` option in the command line itself to access the inline descriptions.

### Examples
...

### TODO
- Refine & stabilize the command line interface and the output format.
- Add some commands more oriented towards analytics.
- Complete a proper documentation.
