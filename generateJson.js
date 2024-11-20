// generateJson.js
const fs = require("fs");
const xlsx = require("xlsx");

// Function to generate a random 9-character code (numbers and small letters)
function generateRandomCode() {
  const chars = "abcdefghijklmnopqrstuvwxyz0123456789";
  let code = "";
  for (let i = 0; i < 9; i++) {
    code += chars[Math.floor(Math.random() * chars.length)];
  }
  return code;
}

// Function to read the XLSX file and extract the 'names' and 'links' columns
function readXlsxFile(filePath, sheetName = null) {
  const workbook = xlsx.readFile(filePath);
  const sheet = sheetName
    ? workbook.Sheets[sheetName]
    : workbook.Sheets[workbook.SheetNames[0]];
  const data = xlsx.utils.sheet_to_json(sheet, { header: 1 });

  // Skip the header row and extract data
  const entries = [];
  data.slice(1).forEach((row) => {
    // Start from the second row
    if (row[0] && row[1]) {
      entries.push({ name: row[0], linkTo: row[1] });
    }
  });
  return entries;
}

// Function to update the JSON file with generated codes and links
function updateJsonWithLinks(entries, jsonFilePath) {
  let jsonData = [];
  let lastId = 0;

  // Check if the JSON file exists and read the current content
  if (fs.existsSync(jsonFilePath)) {
    const rawData = fs.readFileSync(jsonFilePath);
    jsonData = JSON.parse(rawData);
    // Determine the highest existing ID
    lastId = jsonData.reduce((maxId, item) => Math.max(maxId, item.id), 0);
  }

  // Iterate over the entries and add them to the JSON with a unique random code
  entries.forEach((entry, index) => {
    let randomCode;
    // Generate a new unique code not already in the JSON
    do {
      randomCode = generateRandomCode();
    } while (jsonData.some((item) => item.link === randomCode));

    jsonData.push({
      id: lastId + index + 1,
      name: entry.name,
      link: randomCode,
      linkTo: entry.linkTo,
    });
    console.log(
      `Added: { id: ${lastId + index + 1}, name: ${
        entry.name
      }, link: ${randomCode}, linkTo: ${entry.linkTo} }`
    );
  });

  // Write the updated JSON back to the file
  fs.writeFileSync(jsonFilePath, JSON.stringify(jsonData, null, 2));
  console.log(`Data saved to ${jsonFilePath}`);
}

function main() {
  const xlsxFilePath = "links.xlsx"; // Your XLSX file path
  const jsonFilePath = "data.json"; // Your JSON file path

  const entries = readXlsxFile(xlsxFilePath);
  updateJsonWithLinks(entries, jsonFilePath);
}

// Execute the script
main();
