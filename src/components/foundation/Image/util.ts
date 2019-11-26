type SrcSets = [string, string][]
type Sizes = [string, string][]

export const createSrcSet = (sets: SrcSets) => sets.map(([src, width]) => `${src} ${width}`).join(',')

export const createSizes = (sizes: Sizes) => sizes.map(([bp, size]) => `${bp} ${size}`).join(',')
