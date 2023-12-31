import { z } from 'zod'
import * as dotenv from 'dotenv'
import { scriptDirname } from './ubiquiti-db.ts'

dotenv.config({ path: `${scriptDirname()}/.env` })

export const UbiquitiEnvVariablesSchema = z.object({
  UbiquitiSshUsername: z.string(),
  UbiquitiIp: z.string().ip(),
})

export const UbiquitiEnvironment = UbiquitiEnvVariablesSchema.parse(process.env)

declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace NodeJS {
    interface ProcessEnv extends z.infer<typeof UbiquitiEnvVariablesSchema> {}
  }
}
