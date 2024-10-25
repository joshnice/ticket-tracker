import puppeteer from "puppeteer-extra";
import chromium from "@sparticuz/chromium";
import StealthPlugin from "puppeteer-extra-plugin-stealth";

puppeteer.use(StealthPlugin());

const url = "https://tickets.dcfc.co.uk/en-GB/categories/home";

/**
 * @returns {Promise<{  screenshot: Base64 }>}
 */
export async function getUpcomngMatches() {
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


		const links = await page.evaluate(() => {
			return new Promise((res) => {
				const links = [];
				const elements = document.getElementsByClassName("itemsButtonsContainer");
				for (const element of elements) {
					const anchorElements = element.getElementsByTagName("a");
					links.push(anchorElements.item(0).href);
				}
				res(links);
			});
		});

		const matchLinks = links.filter((link) => link.includes("pride%20park%20stadium"));
		const matchesReqs = matchLinks.map((link) => getMatchDetails(link, browser))
		const matchesReps = await Promise.all(matchesReqs);

		await page.close();
		await browser.close();
		return { matches: matchesReps };
	} catch (error) {
		console.log("error", error);
		return [];
	}
}

/**
 * @param {string} url
 */
async function getMatchDetails(url, browser) {
	const page = await browser.newPage();
	await page.goto(url, { waitUntil: "networkidle0" });

	const name = await page.evaluate(() => {
		return new Promise((res) => {
			const elements = document.getElementsByClassName("name");
			for (const element of elements) {
				const text = element.textContent;
				console.log(text);
				if (text?.toLowerCase()?.includes("derby county")) {
					res(element.textContent);
				}
			}
			res();
		});
	});

	return {
		url,
		name: name.replace("Derby County v ", ""),
		date: url.split("/")[6].replace("_", " ").replace(".", ":")
	}
}
