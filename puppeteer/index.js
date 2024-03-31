import chromium from "chrome-aws-lambda";

exports.handler = async (_, __, callback) => {
	let result = null;
	let browser = null;

	try {
		browser = await chromium.puppeteer.launch({
			args: chromium.args,
			defaultViewport: chromium.defaultViewport,
			executablePath: await chromium.executablePath,
			headless: chromium.headless,
			ignoreHTTPSErrors: true,
		});

		const page = await browser.newPage();

		await page.goto("https://www.dcfc.co.uk");

		result = await page.title();
	} catch (error) {
		return callback(error);
	} finally {
		if (browser !== null) {
			await browser.close();
		}
	}

	return callback(null, result);
};
