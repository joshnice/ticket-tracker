const puppeteer = require("puppeteer-core");
const chromium = require("@sparticuz/chromium");

module.exports = {
	handler: async () => {
		try {
			const browser = await puppeteer.launch({
				args: chromium.args,
				defaultViewport: chromium.defaultViewport,
				executablePath: await chromium.executablePath(),
				headless: chromium.headless,
				ignoreHTTPSErrors: true,
			});

			const page = await browser.newPage();

			await page.goto(
				"https://tickets.dcfc.co.uk/en-GB/events/derby%20county%20v%20leyton%20orient/2024-4-13_15.00/pride%20park%20stadium?hallmap",
				{ waitUntil: "networkidle0" },
			);

			console.log("Chromium:", await browser.version());
			console.log("Page Title:", await page.title());

			await page.evaluate(() => {
				const amountStrings = [];
				const elements = document.getElementsByClassName("amount");
				for (const element of elements) {
					console.log("innerText", element.innerText);
					amountStrings.push(element.innerText);
				}
				console.log("amountStrings", amountStrings);
				console.log("amountStrings length", amountStrings.length);
			});

			await page.close();

			await browser.close();
		} catch (error) {
			throw new Error(error.message);
		}
	},
};
