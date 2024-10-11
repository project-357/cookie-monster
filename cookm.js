const axios = require('axios');
const fs = require('fs');
const { URL } = require('url');
const path = require('path');

// Function to generate a valid folder and file name from the domain and routes
function generateFilePathFromURL(urlString) {
  const parsedUrl = new URL(urlString);
  const domain = parsedUrl.hostname.replace(/\./g, '-'); // Replace dots with dashes for folder name
  const routes = parsedUrl.pathname.split('/').filter(route => route); // Split the path by '/' and remove empty parts

  // If no routes, use the domain itself as the filename
  const fileName = routes.length ? `${domain}-${routes.join('-')}` : domain;

  // Create the folder path (domain as folder name)
  const folderPath = path.join(__dirname, domain);

  // Return the full file path (folder + file name)
  return { folderPath, fileName };
}

// Function to fetch cookies and save them to CSV or JSON in case of error
async function fetchCookiesAndSaveToCSV(url) {
  try {
    // Make a GET request to the website
    const response = await axios.get(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.3',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
      },
      withCredentials: true,
    });
    
    // Extract cookies from the response headers
    const setCookieHeaders = response.headers['set-cookie'];
    
    if (!setCookieHeaders) {
      console.log('No cookies found.');
      return;
    }

    // Parse the cookies into a structured format
    const cookies = setCookieHeaders.map(cookieStr => {
      const [cookie, ...cookieAttributes] = cookieStr.split('; ');
      const [name, value] = cookie.split('=');
      return {
        name,
        value: decodeURIComponent(value),
        attributes: cookieAttributes.join('; '),
      };
    });

    // Convert cookies to CSV format
    let csvContent = "name,value,attributes\n";
    cookies.forEach(cookie => {
      csvContent += `"${cookie.name}","${cookie.value}","${cookie.attributes}"\n`;
    });

    // Generate the folder and file path
    const { folderPath, fileName } = generateFilePathFromURL(url);

    // Ensure the domain folder exists
    if (!fs.existsSync(folderPath)) {
      fs.mkdirSync(folderPath, { recursive: true });
    }

    // Define the full output path for the CSV file
    const outputFile = path.join(folderPath, `${fileName}.csv`);

    // Save the CSV to a file
    fs.writeFileSync(outputFile, csvContent);
    console.log(`Cookies saved to ${outputFile}`);

  } catch (error) {
    // Handle the error by saving it to a JSON file
    const { folderPath, fileName } = generateFilePathFromURL(url);

    if (!fs.existsSync(folderPath)) {
      fs.mkdirSync(folderPath, { recursive: true });
    }

    // Prepare error information
    const errorDetails = {
      message: error.message,
      code: error.code,
      status: error.response?.status || 'Unknown',
      headers: error.response?.headers || {},
    };

    // Save error details in a JSON file
    const errorFile = path.join(folderPath, `${fileName}-error.json`);
    fs.writeFileSync(errorFile, JSON.stringify(errorDetails, null, 2));
    console.error(`Error fetching cookies. Details saved to ${errorFile}`);
  }
}

module.exports = { fetchCookiesAndSaveToCSV };