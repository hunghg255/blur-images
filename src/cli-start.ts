const COLORS = {
  black: '\u001B[30m',
  red: '\u001B[31m',
  green: '\u001B[32m',
  yellow: '\u001B[33m',
  blue: '\u001B[34m',
  magenta: '\u001B[35m',
  cyan: '\u001B[36m',
  white: '\u001B[37m',
  console_color: '\u001B[0m',
} as const;

const colorConsoleText = (text: string, color: keyof typeof COLORS) => {
  const coloredText = `${COLORS[color]}${text}${COLORS.console_color}`;
  return console.log(coloredText);
};

export function startCli() {
  try {
    // const fixtures = globby.globbySync('test/original/*.{jpg,jpeg,webp,png}');
    // const outputDir = 'test/output';
    // const type = 'webp';
    // const start = async () => {
    //   for (const fixture of fixtures) {
    //     const name = fixture.split('/').pop().split('.').shift();
    //     const result1 = await blurImage(fixture, { outputFormat: type });
    //     await fs.writeFile(path.join(outputDir, `${name}.${type}`), result1.content);
    //   }
    // };
    // start();
  } catch (error: any) {
    colorConsoleText('❌ Agile CSS Error: ' + error.message, 'red');
  }
}
