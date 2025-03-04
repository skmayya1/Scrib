import puppeteer from "puppeteer";

export async function DriverInit(meetingUrl = "https://meet.google.com/xqp-btzf-bkk") {
  let browser;
  let page;
  try {
    browser = await puppeteer.launch({
      headless: true,
      args: ["--no-sandbox", "--disable-setuid-sandbox"],
    });

    page = await browser.newPage();

    await page.goto(meetingUrl, {
      waitUntil: "networkidle2",
      timeout: 60000,
    });
    console.log("Current URL after navigation:", page.url());

    await page.screenshot({ path: "screenshot.png" });

    const CameraPermissionExists = (await page.content()).includes(
      "Continue without camera"
    );
    const InputExists = (await page.content()).includes("Your name");

    await page.screenshot({ path: "screenshot1.png" });

    if (CameraPermissionExists) {
      //continue without camera functionality
    }

    if (InputExists) {
      const name = "skanda";
      const nameInputSelector = 'input[aria-label="Your name"]';
      try {
        await page.waitForSelector(nameInputSelector, {
          visible: true,
          timeout: 15000,
        });
        await page.type(nameInputSelector, name);
        console.log(`Entered "${name}" into name field`);
      } catch (e) {
        console.log("Name input not found within 15 seconds:", e);
        await page.screenshot({ path: "name-input-screenshot.png" });
        console.log(
          "Proceeding without name input - check screenshot for page state"
        );
      }
    }

    return {
      res: "Meeting page loaded and Continue without camera clicked",
      content: {
        CameraPermissionExists,
        InputExists,
      },
    };
  } catch (error) {
    console.error("Error processing meeting page:", error);
    if (page) {
      await page.screenshot({ path: "error-screenshot.png" });
      console.log("Final URL:", page.url());
    }
    throw error;
  } finally {
  }
}
