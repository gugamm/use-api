export type ExtractPromiseType<T> = T extends Promise<infer K> ? K : never
