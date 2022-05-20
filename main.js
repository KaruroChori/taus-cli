#!/usr/bin/env node

import yargs from "yargs"
let argv = yargs(process.argv.slice(2));

function arch_ls(){
    console.log("arch_ls")
    return false;
}

function arch_add(label){
    console.log("arch_add "+label)
    return false;
}

function arch_rm(label){
    console.log("arch_rm "+label)
    return false;
}

function channel_ls(visible){
    console.log("channel_ls")
    return false;
}

function channel_add(label, visible){
    console.log("channel_ls "+label+" "+visible)
    return false;
}

function channel_rm(label){
    console.log("channel_ls")
    return false;
}

function channel_status(label,status){
    console.log("channel_status")
    return false;
}

function licence_add(label,channels){
    console.log("licence_add")
    return false;
}

function licence_rm(label,channels){
    console.log("licence_rm")
    return false;
}

function licence_status(label,status){
    console.log("licence_status")
    return false;
}

function release_deploy(file,desc,arch,channels){
    console.log("release_deploy")
    return false;
}

function release_distrib(id,channels){
    console.log("release_distrib")
    return false;
}

function release_revoke(id,channels){
    console.log("release_revoke")
    return false;
}

function release_ls(arch_where,channel_where){
    console.log("release_ls")
    return false;
}

function release_rm(id){
    console.log("release_rm")
    return false;
}

function release_status(id,status){
    console.log("release_status")
    return false;
}

argv
    .command("arch", "Command aggregator for operations on architectures.", (argv) => {
        return argv
            .command({
                command: "list",
                desc: "List all supported architectures",
                aliases:["ls"],
                builder: {
                },
                handler: (argv) => { return arch_ls(); },
            })
            .command({
                command: "support <label>",
                desc: "Add support for an architecture",
                aliases:["add"],
                builder: {
                    label: {
                        positional:true
                    }
                },
                handler: (argv) => { return arch_add(argv.label); },
            })
            .command({
                command: "unsupport <label>",
                desc: "Remove support for an architecture",
                aliases:["remove","rem"],
                builder: {
                    label: {
                        positional:true
                    }
                },
                handler: (argv) => { return arch_rem(argv.label); },
            })
            .demandCommand(1)
            .strict()
    })

    .command("channel", "Command aggregator for operations on channels.", (argv) => {
        return argv
            .command({
                command: "list",
                desc: "List all channels",
                aliases:["ls"],
                builder: {
                },
                handler: (argv) => { return channel_ls(); },
            })
            .command({
                command: "new <label> [enabled]",
                desc: "Add a new channel",
                aliases:["add"],
                builder: {
                    label: {
                        positional:true
                    },
                    enabled: {
                        boolean: true,
                        default: false
                    }
                },
                handler: (argv) => { return channel_add(argv.label,argv.enabled); },
            })
            .command({
                command: "destroy <label>",
                desc: "Remove support for an architecture",
                aliases:["remove","rem"],
                builder: {
                    label: {
                        positional:true
                    }
                },
                handler: (argv) => { return channel_rem(argv.label); },
            })
            .command({
                command: "show <label>",
                desc: "Make a channel visible",
                aliases:[],
                builder: {
                    label: {
                        positional:true
                    }
                },
                handler: (argv) => { return channel_status(argv.label,true); },
            })
            .command({
                command: "hide <label>",
                desc: "Make a channel hidden",
                aliases:[],
                builder: {
                    label: {
                        positional:true
                    }
                },
                handler: (argv) => { return channel_status(argv.label,false); },
            })
            .demandCommand(1)
            .strict()
    })

    .command("licence", "Command aggregator for operations on licences.", (argv) => {
        return argv
            .command({
                command: "list",
                desc: "List all licences",
                aliases:["ls"],
                builder: {
                },
                handler: (argv) => { return channel_ls(); },
            })
            .command({
                command: "register <secret> [enabled]",
                desc: "Register a new channel",
                aliases:["add"],
                builder: {
                    secret: {
                        positional:true
                    },
                    enabled: {
                        boolean: true,
                        default: false
                    }
                },
                handler: (argv) => { return licence_add(argv.secret,argv.enabled); },
            })
            .command({
                command: "unregister <secret>",
                desc: "Remove a licence registation",
                aliases:["remove","rem"],
                builder: {
                    secret: {
                        positional:true
                    }
                },
                handler: (argv) => { return licence_rem(argv.label); },
            })
            .command({
                command: "enable <secret>",
                desc: "Enable a licence",
                aliases:[],
                builder: {
                    secret: {
                        positional:true
                    }
                },
                handler: (argv) => { return licence_status(argv.secret,true); },
            })
            .command({
                command: "suspend <secret>",
                desc: "Make a channel hidden",
                aliases:[],
                builder: {
                    secret: {
                        positional:true
                    }
                },
                handler: (argv) => { return licence_status(argv.secret, false); },
            })
            .demandCommand(1)
            .strict()
    })

    .demandCommand(1)
    .strict()
    .parse()
