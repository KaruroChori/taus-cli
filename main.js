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

    //This is here until a new version of Sequelize will add a specific directive to prevent the automatic generation of a primary key.
    subscriptions.removeAttribute('id')

let argv = yargs(process.argv.slice(2));

async function arch_ls(){
    const query = await archs.findAll({})
    if(query.length>0)query.forEach((i) => { console.log(i.id+"\t"+i.label) })
}

async function arch_add(label){
    const query = await archs.create({ label: label })
    console.log(query.id+"\t"+query.label)  
}

async function arch_rm(label){
    const query = await archs.destroy({ where: { label: label } })
    if (!query) throw new Error("Arch not in DB. It cannot be removed.");
}

async function channel_ls(){
    const query = await channels.findAll({})
    if(query.length>0)query.forEach((i) => { console.log(i.id+"\t"+i.label) })
}

async function channel_add(label){
    const query = await channels.create({ label: label })
    console.log(query.id+"\t"+query.label)  
}

async function channel_rm(label){
    const query = await channels.destroy({ where: { label: label } })
    if (!query) throw new Error("Channel not in DB. It cannot be removed.");
}
    
async function licence_ls(){
    const query = await licences.findAll({})
    if (query.length > 0) for(const i of query) {
        const subs = await subscriptions.findAll({ attributes: ["licence", "channel"], where: { licence: i.id } });
        let subs_list = []
        for(const i of subs) {
            const tmp = await channels.findAll({ where: { id: i.channel } });
            subs_list.push(tmp[0].label)            
        }
        console.log(i.id + "\t" + i.secret + "\t" + i.enabled + "\t" + subs_list)
    }
}

async function licence_add(secret,enabled,chs){
    const t = await db.transaction();
    try {
        const query = await licences.create({ secret: secret, enabled: enabled }, { transaction: t })
        for (const i in chs) {
            const query2 = await channels.findAll({ where: { label: chs[i] } }, { transaction: t })
            if (query2.length != 1) throw new Error(`Channel ${chs[i]} not matched!`);
            const tmp = await subscriptions.create({ licence: query.id, channel: query2[0].id }, { transaction: t })
        }

        await t.commit();
    }
    catch (error) {
        await t.rollback();
        throw (error)
    }
}
    
async function licence_subscribe(secret, chs) {
    const t = await db.transaction();
    try {
        const query = await licences.findAll({ where: { secret: secret } }, { transaction: t })
        if (query.length != 1) throw new Error(`Licence not matched!`);
        for (const i in chs) {
            const query2 = await channels.findAll({ where: { label: chs[i] } }, { transaction: t })
            if (query2.length != 1) throw new Error(`Channel ${chs[i]} not matched!`);
            const tmp = await subscriptions.create({ licence: query[0].id, channel: query2[0].id }, { transaction: t })
        }

        await t.commit();
    }
    catch (error) {
        await t.rollback();
        throw (error)
    }
}
    
async function licence_leave(secret, chs) {
    const t = await db.transaction();
    try {
        const query = await licences.findAll({ where: { secret: secret } }, { transaction: t })
        if (query.length != 1) throw new Error(`Licence not matched!`);
        for (const i in chs) {
            const query2 = await channels.findAll({ where: { label: chs[i] } }, { transaction: t })
            if (query2.length != 1) throw new Error(`Channel ${chs[i]} not matched!`);
            const tmp = await subscriptions.destroy({ where: { licence: query[0].id, channel: query2[0].id } }, { transaction: t })
        }

        await t.commit();
    }
    catch (error) {
        await t.rollback();
        throw (error)
    }
}

async function licence_rm(secret){
    const query = await licences.destroy({ where: { secret: secret } })
    if (!query) throw new Error("Licence cannot be removed.");
}

async function licence_status(secret,status){
    const query = await licences.update({ enabled: status }, { where: { secret: secret }});
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
                command: "delete <label>",
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
                handler: (argv) => { return licence_ls(); },
            })
            .command({
                command: "new <secret> [enabled] [channels]",
                desc: "Register a new licence",
                aliases:["add"],
                builder: {
                    secret: {
                        positional:true
                    },
                    enabled: {
                        boolean: true,
                        default: false
                    },
                    channels: {
                        type: 'array'
                    }
                },
                handler: (argv) => { return licence_add(argv.secret,argv.enabled,argv.channels); },
            })
            .command({
                command: "delete <secret>",
                desc: "Destroy a licence",
                aliases:["remove","rm"],
                builder: {
                    secret: {
                        positional:true
                    }
                },
                handler: (argv) => { return licence_rm(argv.secret); },
            })
            .command({
                command: "subscribe <secret> [channels]",
                desc: "Subscribe a licence to channels",
                aliases:["join","sub"],
                builder: {
                    secret: {
                        positional:true
                    },
                    channels: {
                        type:'array'
                    }
                },
                handler: (argv) => { return licence_subscribe(argv.secret,argv.channels); },
            })
            .command({
                command: "leave <secret> [channels]",
                desc: "Let a licence leave channels",
                aliases:[],
                builder: {
                    secret: {
                        positional:true
                    },
                    channels: {
                        type:'array'
                    }
                },
                handler: (argv) => { return licence_leave(argv.secret,argv.channels); },
            })
            .command({
                command: "activate <secret>",
                desc: "Activate a licence",
                aliases:[],
                builder: {
                    secret: {
                        positional:true
                    }
                },
                handler: (argv) => { return licence_status(argv.secret,true); },
            })
            .command({
                command: "revoke <secret>",
                desc: "Revoke a licence",
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

    .command("release", "Command aggregator for operations on releases.", (argv) => {
        return argv
            .command({
                command: "list",
                desc: "List all releases",
                aliases:["ls"],
                builder: {
                },
                handler: (argv) => { return licence_ls(); },
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
