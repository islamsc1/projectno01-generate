const fs = require("fs");
const xlsx = require("xlsx");

// Function to read JSON data and convert it to XLSX format
function generateXlsxFromJson(jsonFilePath, xlsxFilePath) {
  // Read the JSON file
  const rawData = fs.readFileSync(jsonFilePath);
  const jsonData = JSON.parse(rawData);

  // Modify the links by adding 'example.com/' prefix
  const modifiedData = jsonData.map((entry) => ({
    id: entry.id,
    name: entry.name,
    link: `http://localhost:3000/${entry.link}`,
  }));

  // Convert the modified data to a worksheet
  const worksheet = xlsx.utils.json_to_sheet(modifiedData);

  // Create a new workbook and append the worksheet
  const workbook = xlsx.utils.book_new();
  xlsx.utils.book_append_sheet(workbook, worksheet, "Sheet1");

  // Write the workbook to an XLSX file
  xlsx.writeFile(workbook, xlsxFilePath);
  console.log(`XLSX file generated at ${xlsxFilePath}`);
}

// Main function to execute the script
function main() {
  const jsonFilePath = "data.json"; // Your JSON file path
  const xlsxFilePath = "output.xlsx"; // Desired XLSX file path

  generateXlsxFromJson(jsonFilePath, xlsxFilePath);
}

// Execute the script
main();
