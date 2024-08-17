const puppeteer = require("puppeteer-extra");
const chromium = require("@sparticuz/chromium");
const StealthPlugin = require("puppeteer-extra-plugin-stealth");

puppeteer.use(StealthPlugin());

module.exports = {
	/**
	 * @param {string} url
	 * @returns {Promise<number>}
	 */
	getAmountOfTickets: async (url) => {
		try {
			const browser = await puppeteer.launch({
				args: chromium.args,
				defaultViewport: chromium.defaultViewport,
				executablePath: await chromium.executablePath(),
				headless: true,
				ignoreHTTPSErrors: true,
			});

			const page = await browser.newPage();

			await page.goto(url, { waitUntil: "networkidle0" });

			console.log("Starting count", url);

			const screenshot = await page.screenshot();

			const amounts = await page.evaluate(() => {
				return new Promise((res) => {
					const amountStrings = [];
					const elements = document.getElementsByClassName("amount");
					console.log("amount of amounts", elements.length);
					for (const element of elements) {
						amountStrings.push(element.innerText);
					}
					res(amountStrings);
				});
			});

			const totalAmount = amounts.reduce((total, amountValue) => {
				if (amountValue === "") {
					return total;
				}

				const parsedAmount = Number.parseInt(amountValue, 10);

				if (Number.isNaN(parsedAmount) || typeof parsedAmount !== "number") {
					console.log("Can't parse amount", amountValue);
					return total;
				}

				return parsedAmount + total;
			}, 0);

			console.log("totalAmount", totalAmount);

			await page.close();
			await browser.close();
			return { totalAmount, screenshot };
		} catch (error) {
			console.log("error", error);
			return null;
		}
	},
};
