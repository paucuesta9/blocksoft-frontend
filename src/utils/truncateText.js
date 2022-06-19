export const truncate = (input, options) => input.length > options.length ? `${input.substring(0, options.length)}...` : input
