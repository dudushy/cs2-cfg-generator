const TITLE = "cs2-cfg-generator";
console.log(`[${TITLE}] init`);

let selectedFiles = [];
let cfg = '';

const fileInput = document.getElementById('vcfgInput');
console.log(`[${TITLE}] fileInput`, fileInput);

fileInput.onchange = () => {
  console.log(`[${TITLE}#fileInput.onchange] (BEFORE) selectedFiles`, selectedFiles);

  selectedFiles = [...fileInput.files];

  console.log(`[${TITLE}#fileInput.onchange] (AFTER) selectedFiles`, selectedFiles);
}

const generateInput = document.getElementById('generateInput');
console.log(`[${TITLE}] generateInput`, generateInput);

generateInput.onclick = async () => {
  console.log(`[${TITLE}#generateInput.onclick]`);

  await generateCfg();
}

async function generateCfg() {
  for (const file of selectedFiles) {
    console.log(`[${TITLE}#generateCfg] file`, file);

    await readFile(file);
  }

  console.log(`[${TITLE}#generateCfg] cfg`, cfg);

  const blob = new Blob([cfg], { type: 'text/plain' });
  console.log(`[${TITLE}#generateCfg] blob`, blob);

  const a = document.createElement('a');
  a.download = `autoexec.cfg`;
  a.href = URL.createObjectURL(blob);
  a.click();

  console.log(`[${TITLE}#generateCfg] done`);
}

async function readFile(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = () => {
      const content = reader.result;
      console.log(`[${TITLE}#readFile#reader.onload] (${file.name}) content`, content);

      content.split('\n').forEach((line) => {
        // console.log(`[${TITLE}#readFile#reader.onload] (${file.name}) line`, line);

        const matches = line.match(/"([^"]+)"\s+"([^"]+)"/);
        if (matches && matches.length === 3) {
          const firstValue = matches[1];
          const secondValue = matches[2];

          let resultLine = '';

          if (file.name == 'cs2_user_keys_0_slot0.vcfg') {
            resultLine = `bind "${firstValue}" "${secondValue}"\n`;
          } else {
            resultLine = `${firstValue} "${secondValue}"\n`;
          }

          console.log(`[${TITLE}#readFile#reader.onload] (${file.name}) resultLine`, resultLine);
          cfg += resultLine;
        }
      });

      resolve();
    }

    reader.readAsText(file);
  });
}
