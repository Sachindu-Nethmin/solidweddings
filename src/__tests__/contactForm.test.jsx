const { Builder, By, until } = require('selenium-webdriver');
const chrome = require('selenium-webdriver/chrome');
const { expect } = require('chai');

describe('Contact Form Functional Test', function () {
  this.timeout(40000); // extra timeout for CI

  let driver;

  before(async () => {
    const options = new chrome.Options();
    options.addArguments('--headless', '--no-sandbox', '--disable-dev-shm-usage');
    driver = await new Builder()
      .forBrowser('chrome')
      .setChromeOptions(options)
      .build();
  });

  after(async () => {
    await driver.quit();
  });

  it('should fill contact form, submit, show message, and reset', async () => {
    // Navigate to the contact page
    await driver.get('http://localhost:5173/contact'); 

    // Wait for contact form to load
    try {
      const form = await driver.wait(until.elementLocated(By.css('.contact-form')), 10000);
      await driver.wait(until.elementIsVisible(form), 5000);
    } catch (error) {
      console.log('Contact form not found, trying to navigate to contact page...');
      // Try clicking the contact link if we're on homepage
      try {
        const contactLink = await driver.findElement(By.linkText('Contact'));
        await contactLink.click();
        await driver.wait(until.elementLocated(By.css('.contact-form')), 10000);
      } catch (navError) {
        throw new Error('Could not find or navigate to contact form');
      }
    }

    // Fill out form fields
    await driver.findElement(By.name('name')).sendKeys('Ashan Edirisinghe');
    await driver.findElement(By.name('email')).sendKeys('ashan@example.com');
    await driver.findElement(By.name('phone')).sendKeys('0712345678');
    await driver.findElement(By.name('weddingDate')).sendKeys('2025-10-20');
    await driver.findElement(By.name('venue')).sendKeys('Colombo');
    
    // Select package from dropdown
    const packageSelect = await driver.findElement(By.name('package'));
    await packageSelect.sendKeys('premium');
    
    await driver.findElement(By.name('message')).sendKeys('We want an elegant beach wedding shoot.');

    // Click submit button
    await driver.findElement(By.css('button[type="submit"]')).click();

    // Wait for success message (updated to match your new implementation)
    const successMessage = await driver.wait(
      until.elementLocated(By.css('.form-status.success')),
      10000
    );

    const text = await successMessage.getText();
    expect(text).to.include('Thank you for your inquiry');

    // Wait a moment for form reset
    await driver.sleep(1000);

    // Check that form fields are reset
    const name = await driver.findElement(By.name('name')).getAttribute('value');
    const email = await driver.findElement(By.name('email')).getAttribute('value');
    const message = await driver.findElement(By.name('message')).getAttribute('value');

    expect(name).to.equal('');
    expect(email).to.equal('');
    expect(message).to.equal('');
  });
});
