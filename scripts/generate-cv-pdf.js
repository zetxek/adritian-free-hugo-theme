const puppeteer = require('puppeteer');
const path = require('path');
const fs = require('fs').promises;

async function generatePDF() {
  let browser = null;
  
  try {
    console.log('Launching browser...');
    browser = await puppeteer.launch({
      headless: 'new',
      args: ['--no-sandbox', '--disable-setuid-sandbox']
    });
    
    const page = await browser.newPage();
    
    // Enable console log from the page
    page.on('console', msg => console.log('Browser console:', msg.text()));
    page.on('pageerror', err => console.error('Browser error:', err));

    console.log('Loading local CV page...');
    await page.goto('http://localhost:1313/cv', {
      waitUntil: 'networkidle0',
      timeout: 30000
    });

    console.log('Loading Paged.js...');
    // Load Paged.js directly from CDN instead of local file
    await page.addScriptTag({ 
      url: 'https://unpkg.com/pagedjs/dist/paged.polyfill.js'
    });
    
    console.log('Adding print styles...');
    await page.addStyleTag({
      content: `
        @media print {
          /* Only apply these styles to the CV page */
          body.page-cv {
            * {
              -webkit-print-color-adjust: exact !important;
              color-adjust: exact !important;
            }

            nav, footer {
              display: none !important;
            }

            h2 {
              break-after: avoid;
            }

            section {
              margin-bottom: 1em;
            }
          }
        }
      `
    });

    // Make sure static directory exists
    const staticDir = path.resolve(__dirname, '../static');
    try {
      await fs.mkdir(staticDir, { recursive: true });
    } catch (err) {
      console.log('Static directory already exists');
    }

    console.log('Generating PDF...');
    await page.pdf({
      path: path.resolve(staticDir, 'cv.pdf'),
      format: 'A4',
      printBackground: true,
      margin: {
        top: '1cm',
        right: '1cm',
        bottom: '1cm',
        left: '1cm'
      }
    });

    console.log('PDF generated successfully!');
  } catch (error) {
    console.error('Error during PDF generation:', error);
    process.exit(1);
  } finally {
    if (browser) {
      console.log('Closing browser...');
      await browser.close();
    }
  }
}

// Wrap the main execution in a try-catch
try {
  generatePDF().catch(error => {
    console.error('Top level error:', error);
    process.exit(1);
  });
} catch (error) {
  console.error('Fatal error:', error);
  process.exit(1);
} 