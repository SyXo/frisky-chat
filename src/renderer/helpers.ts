export const mapFilesList = (list: FileList, prop: string): File[] => {
  const results = []
  for (let i = 0; i < list.length; i++) {
    results.push(list[i][prop])
  }
  return results
}
