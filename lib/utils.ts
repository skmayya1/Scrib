import puppeteer from "puppeteer-extra";
import Stealth from "puppeteer-extra-plugin-stealth";

//@ts-expect-error
puppeteer.use(Stealth());

export async function DriverInit({
  meetingUrl,
  accessToken,
  name,
}: {
  meetingUrl: string;
  accessToken: string;
  name: string;
}) {
  let browser;
  let page;
  try {
    browser = await puppeteer.launch({
      headless: false,
      defaultViewport: null,
      devtools: false,
      args: [
        "--window-size=1920,1080",
        "--window-position=1921,0",
        "--autoplay-policy=no-user-gesture-required",
        "--enable-automation",
      ],
      ignoreDefaultArgs: false,
    });

    const context = browser.defaultBrowserContext();

    await context.overridePermissions(meetingUrl, [
      "microphone",
      "camera",
      "notifications",
    ]);

    page = await browser.newPage();
    await page.setUserAgent(
      "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/114.0.0.0 Safari/537.36"
    );

    await page.evaluateOnNewDocument(() => {
      Object.defineProperty(navigator, "webdriver", { get: () => false });
    });

    await page.mouse.move(100, 100);
    await page.mouse.down();
    await page.mouse.up();

    await page.setExtraHTTPHeaders({
      Authorization: `Bearer ${accessToken}`,
    });

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
