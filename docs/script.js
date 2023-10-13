const TITLE = "cs2-cfg-generator";
console.log(`[${TITLE}] init`);

let selectedFiles = [];

const fileInput = document.getElementById('vcfgInput');
console.log(`[${TITLE}] fileInput`, fileInput);

fileInput.onchange = () => {
  console.log(`[${TITLE}#fileInput.onchange] (BEFORE) selectedFiles`, selectedFiles);

  selectedFiles = [...fileInput.files];

  console.log(`[${TITLE}#fileInput.onchange] (AFTER) selectedFiles`, selectedFiles);
}

const generateInput = document.getElementById('generateInput');
console.log(`[${TITLE}] generateInput`, generateInput);

generateInput.onclick = () => {
  console.log(`[${TITLE}#generateInput.onclick]`);

  generateCfg();
}

function generateCfg() {
  for (const file of selectedFiles) {
    console.log(`[${TITLE}#generateCfg] file`, file);

    const reader = new FileReader();

    reader.onload = () => {
      const content = reader.result;
      // const content = JSON.parse(reader.result);
      console.log(`[${TITLE}#generateCfg#reader.onload] content`, content);

      const cfg = 'test';
      console.log(`[${TITLE}#generateCfg#reader.onload] cfg`, cfg);

      const blob = new Blob([cfg], { type: 'text/plain' });
      console.log(`[${TITLE}#generateCfg#reader.onload] blob`, blob);

      const a = document.createElement('a');
      a.download = `autoexec.cfg`;
      a.href = URL.createObjectURL(blob);
      a.click();
    }

    reader.readAsText(file);
  }
}
