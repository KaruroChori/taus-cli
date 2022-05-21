#!/usr/bin/env node
import * as fs from 'fs';
import os  from 'os';
import { exit } from 'process';
import yargs from "yargs"

const HOME = os.homedir()

import { Sequelize, Op, Model, DataTypes } from 'sequelize';
import initModels from "./models/init-models.js"


try {
    let config = JSON.parse(fs.readFileSync(HOME + "/.config/taus-cli/config.json"))

    //Normalize path in case it is a local resource and relative path is selected.
    if (config["relative-path"] == true && config.db.dialect == 'sqlite') config.db.storage = HOME + "/.config/taus-cli/" + config.db.storage
    const db = new Sequelize(config.db);
    await db.authenticate();

    const { events, licences, releases, channels, subscriptions, archs } = initModels(db)


let argv = yargs(process.argv.slice(2));

async function arch_ls(){
    const query = await archs.findAll({})
    if(query.length>0)query.forEach((i) => { console.log(i["id"]+"\t"+i["label"]) })
}

async function arch_add(label){
    const query = await archs.create({ label: label })
    console.log(query["id"]+"\t"+query["label"])  
}

async function arch_rm(label){
    const query = await archs.destroy({ where: { label: label } })
    if (!query) throw new Error("Arch not in DB. It cannot be removed.");
}

async function channel_ls(){
    const query = await channels.findAll({})
    if(query.length>0)query.forEach((i) => { console.log(i["id"]+"\t"+i["label"]) })
}

async function channel_add(label){
    const query = await channels.create({ label: label })
    console.log(query["id"]+"\t"+query["label"])  
}

async function channel_rm(label){
    const query = await channels.destroy({ where: { label: label } })
    if (!query) throw new Error("Channel not in DB. It cannot be removed.");
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
                aliases:["remove","rm"],
                builder: {
                    label: {
                        positional:true
                    }
                },
                handler: (argv) => { return arch_rm(argv.label); },
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
                command: "new <label>",
                desc: "Add a new channel",
                aliases:["add"],
                builder: {
                    label: {
                        positional:true
                    }
                },
                handler: (argv) => { return channel_add(argv.label); },
            })
            .command({
                command: "destroy <label>",
                desc: "Destroy a channel",
                aliases:["remove","rm"],
                builder: {
                    label: {
                        positional:true
                    }
                },
                handler: (argv) => { return channel_rm(argv.label); },
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


}
catch(e) {
    console.error(e);
    exit(1)
}
