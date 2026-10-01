import { expect, test, type Page } from '@playwright/test';

const pages = ['/', '/projects', '/skills', '/about', '/contact', '/projects/work-order-management'];

function collectErrors(page: Page) {
  const errors: string[] = [];
  page.on('pageerror', (error) => errors.push(error.message));
  page.on('console', (message) => {
    if (message.type() === 'error') errors.push(message.text());
  });
  return errors;
}

for (const path of pages) {
  test(`${path} renders without errors or horizontal overflow`, async ({ page }) => {
    const errors = collectErrors(page);
    const response = await page.goto(path);
    expect(response?.status()).toBe(200);
    await expect(page.locator('h1').first()).toBeVisible();
    const overflow = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
    expect(overflow).toBeLessThanOrEqual(0);
    expect(errors).toEqual([]);
  });
}

test('header links reach every page', async ({ page, isMobile }) => {
  for (const [name, url] of [
    ['Projects', '/projects'],
    ['Skills', '/skills'],
    ['About', '/about'],
    ['Contact', '/contact'],
  ] as const) {
    await page.goto('/');
    if (isMobile) await page.getByRole('button', { name: 'Toggle Menu' }).click();
    // Fumadocs renders the header inside <main>, so it has no banner role.
    await page.locator('#nd-nav').getByRole('link', { name, exact: true }).click();
    await expect(page).toHaveURL(url);
  }
});

test('project filters sync with the URL and show an empty state', async ({ page }) => {
  await page.goto('/projects');
  await page.getByRole('button', { name: 'NestJS', exact: true }).click();
  await expect(page).toHaveURL(/\?tag=nestjs$/);
  await expect(page.getByRole('button', { name: 'NestJS', exact: true })).toHaveAttribute('aria-pressed', 'true');

  await page.goto('/projects?tag=nestjs&tag=go');
  await expect(page.getByText('No project matches')).toBeVisible();
  await page.getByRole('button', { name: 'Clear filters and show all projects' }).click();
  await expect(page).toHaveURL('/projects');
  await expect(page.locator('article').first()).toBeVisible();
});

test('contact form validates each field', async ({ page }) => {
  await page.goto('/contact');
  await page.getByRole('button', { name: 'Send message' }).click();
  await expect(page.locator('#name-error')).toHaveText('Enter your name.');
  await expect(page.locator('#email-error')).toBeVisible();
  await expect(page.locator('#message-error')).toBeVisible();
  await expect(page.locator('[aria-invalid="true"]')).toHaveCount(3);
});

test('project page renders the Mermaid diagram', async ({ page }) => {
  await page.goto('/projects/work-order-management');
  await page.getByText('Drawing diagram…').scrollIntoViewIfNeeded();
  await expect(page.locator('article svg[id^="mermaid-"]')).toBeVisible();
});

test('search finds skills as well as projects', async ({ page }) => {
  const response = await page.request.get('/api/search?query=mongodb');
  const results: { url: string }[] = await response.json();
  expect(results.some((result) => result.url.startsWith('/skills#skill-mongodb'))).toBe(true);
  expect(results.some((result) => result.url.startsWith('/projects/'))).toBe(true);
});

test('Ctrl+K search opens a skill result on /skills', async ({ page, isMobile }) => {
  test.skip(isMobile, 'keyboard shortcut is desktop-only');
  await page.goto('/');
  await page.waitForLoadState('networkidle');
  await page.keyboard.press('Control+k');
  const dialog = page.getByRole('dialog');
  await expect(dialog).toBeVisible();
  await page.keyboard.type('mongo');
  await dialog.getByText('MongoDB', { exact: true }).first().click();
  await expect(page).toHaveURL('/skills#skill-mongodb');
});

test('search button opens and closes the dialog', async ({ page }) => {
  await page.goto('/');
  await page.waitForLoadState('networkidle');
  await expect(page.getByRole('dialog')).toHaveCount(0);
  await page
    .locator('#nd-nav')
    .getByRole('button', { name: /search/i })
    .first()
    .click();
  await expect(page.getByRole('dialog')).toBeVisible();
  await page.keyboard.press('Escape');
  await expect(page.getByRole('dialog')).toBeHidden();
  await page
    .locator('#nd-nav')
    .getByRole('button', { name: /search/i })
    .first()
    .click();
  await expect(page.getByRole('dialog')).toBeVisible();
});

test.describe('motion', () => {
  test.beforeEach(async ({ page }) => {
    // Count view transitions so the test can tell an animated navigation from an instant one.
    await page.addInitScript(() => {
      const original = document.startViewTransition?.bind(document);
      (window as unknown as { __vt: number }).__vt = 0;
      if (original) {
        document.startViewTransition = ((arg: Parameters<typeof original>[0]) => {
          (window as unknown as { __vt: number }).__vt += 1;
          return original(arg);
        }) as typeof document.startViewTransition;
      }
    });
  });
  const transitions = (page: Page) => page.evaluate(() => (window as unknown as { __vt: number }).__vt);

  test('navigating to a project runs a view transition', async ({ page }) => {
    await page.goto('/projects');
    await page.waitForLoadState('networkidle');
    await page.locator('article a').first().click();
    await expect(page).toHaveURL('/projects/work-order-management');
    expect(await transitions(page)).toBeGreaterThan(0);
  });

  test('changing a filter runs a view transition', async ({ page }) => {
    await page.goto('/projects');
    await page.waitForLoadState('networkidle');
    await page.getByRole('button', { name: 'NestJS', exact: true }).click();
    await expect(page).toHaveURL(/tag=nestjs/);
    expect(await transitions(page)).toBeGreaterThan(0);
  });

  test('hero name spotlight follows the pointer', async ({ page, isMobile }) => {
    test.skip(isMobile, 'pointer hover');
    await page.goto('/');
    const name = page.getByRole('heading', { level: 1 });
    await name.hover({ position: { x: 40, y: 20 } });
    await expect(name).toHaveAttribute('data-spot', 'on');
    await page.mouse.move(0, 0);
    await expect(name).toHaveAttribute('data-spot', 'off');
  });

  test('card cover tilts toward the pointer, and not under reduced motion', async ({ page, isMobile }) => {
    test.skip(isMobile, 'pointer hover');
    const tilt = () =>
      page
        .locator('article .transition-transform')
        .first()
        .evaluate((el) => (el as HTMLElement).style.transform);
    await page.goto('/projects');
    await page
      .locator('article')
      .first()
      .hover({ position: { x: 20, y: 20 } });
    await expect.poll(tilt).toContain('rotateX');

    await page.emulateMedia({ reducedMotion: 'reduce' });
    await page.goto('/projects');
    await page
      .locator('article')
      .first()
      .hover({ position: { x: 20, y: 20 } });
    await page.waitForTimeout(200);
    expect(await tilt()).toBe('');
  });
});

test('about page shows the timeline from dated content', async ({ page }) => {
  await page.goto('/about');
  const timeline = page.getByRole('region', { name: 'Timeline' });
  await expect(timeline).toBeVisible();
  await expect(timeline.getByRole('link', { name: 'Multi-tenant Work Order Management' })).toBeVisible();
});

test('unknown routes return the 404 page with a way back', async ({ page }) => {
  const response = await page.goto('/does-not-exist');
  expect(response?.status()).toBe(404);
  await page.getByRole('link', { name: 'Go to projects' }).click();
  await expect(page).toHaveURL('/projects');
});
