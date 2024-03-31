const puppeteer = require("puppeteer-core");
const chromium = require("@sparticuz/chromium");

module.exports = {
	main: async () => {
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

			console.log("Starting count", await page.title());

			const amounts = await page.evaluate(() => {
				return new Promise((res) => {
					const amountStrings = [];
					const elements = document.getElementsByClassName("amount");
					for (const element of elements) {
						amountStrings.push(element.innerText);
					}
					res(amountStrings);
				});
			});

			const totalAmount = amounts.reduce((total, amountValue) => {
				const numberAmount =
					amountValue === "" ? 0 : Number.parseInt(amountValue, 10);

				if (Number.isNaN(numberAmount) || typeof numberAmount !== "number") {
					console.log("Can't parse amount", amountValue);
				}

				return numberAmount + total;
			}, 0);

			console.log("totalAmount", totalAmount);

			await page.close();
			await browser.close();
		} catch (error) {
			throw new Error(error.message);
		}
	},
};
