#!/usr/bin/env -S npx ts-node-esm

import {fileURLToPath} from 'url'
import {command, run, subcommands} from 'cmd-ts'
import {z} from 'zod'
import fs from 'fs'
import path from 'path'
import {getSimpleCameras} from './ubiquiti.ts'

export function scriptDirname() {
    return path.dirname(fileURLToPath(import.meta.url))
}

async function listCameras() {
    console.log(JSON.stringify(await getSimpleCameras(), null, 2))
}

const NameVersionDescriptionSchema = z.object({
    name: z.string(),
    description: z.string(),
    version: z.string(),
})

const packageInfo = NameVersionDescriptionSchema.parse(
    JSON.parse(
        fs.readFileSync(path.resolve(scriptDirname(), './package.json'), 'utf8'),
    ),
)

const listCamerasCommand = command({
    name: 'list-cameras',
    args: {},
    handler: async () => {
        await listCameras()
    },
})

const commandLineParser = subcommands({
    name: packageInfo.name,
    description: packageInfo.description,
    version: packageInfo.version,
    cmds: {
        list: listCamerasCommand,
    },
})

void run(commandLineParser, process.argv.slice(2)).finally()
