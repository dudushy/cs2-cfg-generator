const TITLE = "cs2-cfg-generator";
console.log(`[${TITLE}] init`);

let selectedFiles = [];
let cfg = '';
let excludeXhairViewmodel = true;
const excludeArray = [
  'cl_crosshair_drawoutline',
  'cl_crosshair_dynamic_maxdist_splitratio',
  'cl_crosshair_dynamic_splitalpha_innermod',
  'cl_crosshair_dynamic_splitalpha_outermod',
  'cl_crosshair_dynamic_splitdist',
  'cl_crosshair_outlinethickness',
  'cl_crosshair_sniper_show_normal_inaccuracy',
  'cl_crosshair_sniper_width',
  'cl_crosshair_t',
  'cl_crosshairalpha',
  'cl_crosshaircolor',
  'cl_crosshaircolor_b',
  'cl_crosshaircolor_g',
  'cl_crosshaircolor_r',
  'cl_crosshairdot',
  'cl_crosshairgap',
  'cl_crosshairgap_useweaponvalue',
  'cl_crosshairsize',
  'cl_crosshairstyle',
  'cl_crosshairthickness',
  'cl_crosshairusealpha',

  'viewmodel_fov',
  'viewmodel_offset_x',
  'viewmodel_offset_y',
  'viewmodel_offset_z',
  'viewmodel_presetpos'
];

const fileInput = document.getElementById('vcfgInput');
console.log(`[${TITLE}] fileInput`, fileInput);

fileInput.onchange = () => {
  console.log(`[${TITLE}#fileInput.onchange] (BEFORE) selectedFiles`, selectedFiles);

  if (!checkFiles(fileInput.files)) {
    alert('Please select the files in description!');
    fileInput.value = '';
    return;
  }

  selectedFiles = [...fileInput.files];

  console.log(`[${TITLE}#fileInput.onchange] (AFTER) selectedFiles`, selectedFiles);
}

const generateInput = document.getElementById('generateInput');
console.log(`[${TITLE}] generateInput`, generateInput);

generateInput.onclick = async () => {
  console.log(`[${TITLE}#generateInput.onclick]`);

  excludeXhairViewmodel = document.getElementById('excludeXhairViewmodel').checked;
  console.log(`[${TITLE}#generateInput.onclick] excludeXhairViewmodel`, excludeXhairViewmodel);

  await generateCfg();
}

function checkFiles(files) {
  console.log(`[${TITLE}#checkFiles] files`, files);

  if (files.length !== 3) {
    return false;
  }

  const filesName = [...files].map((file) => file.name);
  console.log(`[${TITLE}#checkFiles] filesName`, filesName);

  const filesNameExpected = [
    'cs2_machine_convars.vcfg',
    'cs2_user_convars_0_slot0.vcfg',
    'cs2_user_keys_0_slot0.vcfg'
  ];
  console.log(`[${TITLE}#checkFiles] filesNameExpected`, filesNameExpected);

  return filesName.every((fileName) => filesNameExpected.includes(fileName));
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
        if (!(matches && matches.length === 3)) return;

        const firstValue = matches[1];
        const secondValue = matches[2];

        let resultLine = '';

        if (file.name == 'cs2_user_keys_0_slot0.vcfg') {
          // console.log(`[${TITLE}#readFile#reader.onload] (${file.name}) secondValue`, secondValue);

          if (secondValue != '<unbound>') resultLine = `bind "${firstValue}" "${secondValue}"\n`;
        } else {
          if (excludeXhairViewmodel) {
            if (excludeArray.includes(firstValue)) {
              console.log(`[${TITLE}#readFile#reader.onload] (${file.name}) excludeArray.includes(${firstValue})`, excludeArray.includes(firstValue));
            } else {
              resultLine = `${firstValue.split('$')[0]} "${secondValue}"\n`;
            }
          } else {
            resultLine = `${firstValue.split('$')[0]} "${secondValue}"\n`;
          }
        }

        console.log(`[${TITLE}#readFile#reader.onload] (${file.name}) resultLine`, resultLine);
        cfg += resultLine;
      });

      resolve();
    }

    reader.readAsText(file);
  });
}

async function generateCfg() {
  cfg += '// Generated with cs2-cfg-generator\n';
  cfg += '// https://dudushy.github.io/cs2-cfg-generator/\n';
  cfg += '// Made by dudushy\n\n';

  const aliasTextarea = document.getElementById('aliasTextarea');
  console.log(`[${TITLE}#generateCfg] aliasTextarea`, aliasTextarea);
  console.log(`[${TITLE}#generateCfg] aliasTextarea.value`, aliasTextarea.value);

  aliasTextarea.value.split('\n').forEach((line) => {
    console.log(`[${TITLE}#generateCfg] aliasLines#forEach line`, line);

    cfg += line + '\n';
  });

  cfg += '\n';

  for (const file of selectedFiles) {
    console.log(`[${TITLE}#generateCfg] file`, file);

    await readFile(file);
  }

  console.log(`[${TITLE}#generateCfg] cfg`, cfg);

  const blob = new Blob([cfg], { type: 'text/plain' });
  console.log(`[${TITLE}#generateCfg] blob`, blob);

  const a = document.createElement('a');
  a.download = 'autoexec.cfg';
  a.href = URL.createObjectURL(blob);
  a.click();

  console.log(`[${TITLE}#generateCfg] done`);
}
