export const countWords = (text: string) => {
    const words = text.split(/\W+/)
    return words.filter((word) => word.length > 0).length
}