const puppeteer = require("puppeteer");
// our env variables
const C = require("./constants");
// these selectors are the css tags from DHIS2 homepage
const USERNAME_SELECTOR = "#j_username";
const PASSWORD_SELECTOR = "#j_password";
const CTA_SELECTOR = "#submit";

async function main() {
  const browser = await puppeteer.launch({
    args: ["--no-sandbox"],
  });
  const page = await browser.newPage();
  await page
    .goto(C.homeurl, {
      // Wait until de DOM loads
      waitUntil: "load",
      // Increase the timeout to 5000ms
      timeout: 5000,
    })
    .then(() => {
      console.log("Homepage has been loaded correctly");
    })
    .catch((res) => {
      console.log(
        "Homepage could not be loaded. The script should be launched again\n",
        res
      );
      browser.close();
    });
  await page.click(USERNAME_SELECTOR);
  await page.keyboard.type(C.username);
  await page.click(PASSWORD_SELECTOR);
  await page.keyboard.type(C.password);
  await page.click(CTA_SELECTOR);
  await page.waitForNavigation({ waitUntil: "load" });
  await page.goto(C.appurl, {
    // Wait until the are no more calls during 0.5 secs
    waitUntil: "networkidle0",
    // Remove the timeout for this call
    timeout: 0,
  });
  // to confirm that puppetteer works we take and save a screenshot in ./
  await page.screenshot({
    path: "example.png",
  });
  // we close the headless chromium
  await browser.close();
}

// Start the script
main();
