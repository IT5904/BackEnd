export function genCode(address: string): string {
  let result = '';
  const characters: string = address;
  const charactersLength: number = characters.length;
  for (let i = 0; i < 6; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
}
