import {z} from 'zod'
import {getPrismaClientOverSsh} from './prisma-client.ts'

export async function getFullCameras() {
    const prismaClientOverSsh = await getPrismaClientOverSsh()

    const cameras = await prismaClientOverSsh.prismaClient.cameras.findMany()

    await prismaClientOverSsh.prismaClient.$disconnect()
    prismaClientOverSsh.localServer.close()
    prismaClientOverSsh.ssh.dispose()

    return UbiquitiCamerasSchema.parse(cameras)
}

export async function getSimpleCameras() {
    return UbiquitiCamerasSchema.parse(await getFullCameras()).map((value) => ({
        id: value.id,
        name: value.name,
    }))
}

const UbiquitiCameraSchema = z.object({
    id: z.string().min(24).max(24),
    mac: z.string().min(12).max(12),
    host: z.string().ip(),
    connectionHost: z.string().ip(),
    type: z.string(),
    name: z.string(),
    channels: z.array(
        z.object({
            enabled: z.boolean(),
            isRtspEnabled: z.boolean(),
            width: z.number(),
            height: z.number(),
            fps: z.number(),
            bitrate: z.number(),
            minBitrate: z.number(),
            maxBitrate: z.number(),
        }),
    ),
    stats: z.object({
        rxBytes: z.number(),
        txBytes: z.number(),
        wifi: z.object({
            channel: z.any().optional(),
            frequency: z.any().optional(),
            linkSpeedMbps: z.any().optional(),
            signalQuality: z.number(),
            signalStrength: z.number(),
        }),
        battery: z.object({
            percentage: z.any().optional(),
            isCharging: z.boolean(),
        }),
        video: z.object({
            recordingStart: z.number().nullable(),
            recordingEnd: z.number().nullable(),
            recordingStartLQ: z.number().nullable(),
            recordingEndLQ: z.number().nullable(),
            timelapseStart: z.number().nullable(),
            timelapseEnd: z.number().nullable(),
            timelapseStartLQ: z.number().nullable(),
            timelapseEndLQ: z.number().nullable(),
        }),
    }),
})

const UbiquitiCamerasSchema = z.array(UbiquitiCameraSchema)
