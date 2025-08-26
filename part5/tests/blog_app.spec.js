const { test, expect, describe } = require('@playwright/test');

const FRONT_URL = 'http://localhost:5173';
const API_URL = 'http://localhost:3001/api';

const login = async (page, username, password) => {
  await page.locator('input[name="Username"]').fill(username);
  await page.locator('input[name="Password"]').fill(password);
  await page.getByRole('button', { name: /login/i }).click();
};

const createBlog = async (page, { title, author, url }) => {
  await page.getByRole('button', { name: /create new/i }).click();
  await page.locator('input[name="title"]').fill(title);
  await page.locator('input[name="author"]').fill(author);
  await page.locator('input[name="url"]').fill(url);
  await page.getByRole('button', { name: /create/i }).click();
};

describe('Blog app', () => {
  test.beforeEach(async ({ page, request }) => {
    await request.post(`${API_URL}/testing/reset`);
    await request.post(`${API_URL}/users`, {
      data: { name: 'Matti Luukkainen', username: 'mluukkai', password: 'salainen' },
    });
    await page.goto(FRONT_URL);
  });

  test('Login form is shown', async ({ page }) => {
    await expect(page.locator('input[name="Username"]')).toBeVisible();
    await expect(page.locator('input[name="Password"]')).toBeVisible();
    await expect(page.getByRole('button', { name: 'login' })).toBeVisible();
  });

  describe('Login', () => {
    test('succeeds with correct credentials', async ({ page }) => {
      await login(page, 'mluukkai', 'salainen');
      await expect(page.getByText(/mluukkai.*logged in/i)).toBeVisible();
    });

    test('fails with wrong credentials', async ({ page }) => {
      await login(page, 'mluukkai', 'WRONG_PASSWORD');
      await expect(page.getByText(/wrong credentials/i)).toBeVisible();
      await expect(page.getByRole('button', { name: /login/i })).toBeVisible();
    });
  });

  describe('when logged in', () => {
    test.beforeEach(async ({ page }) => {
      await login(page, 'mluukkai', 'salainen');
      await expect(page.getByText(/mluukkai.*logged in/i)).toBeVisible();
    });

    test('a new blog can be created', async ({ page }) => {
      const title = 'Playwright Made This';
      await createBlog(page, { title, author: 'Author A', url: 'https://example.com/a' });
      await expect(page.getByText(title, { exact: false })).toBeVisible();
    });
  });

  describe('when a blog exists', () => {
    test.beforeEach(async ({ page }) => {
      await login(page, 'mluukkai', 'salainen');
      await createBlog(page, { title: 'Blog To Interact', author: 'Me', url: 'https://x.y' });
      const target = page.getByText('Blog To Interact').first();
      const row = target.locator('xpath=ancestor::*[self::div or self::li][1]');
      const viewBtn = row.getByRole('button', { name: /view/i });
      if (await viewBtn.isVisible()) await viewBtn.click();
    });

    test('a blog can be liked', async ({ page }) => {
      const row = page.getByText('Blog To Interact').first().locator('xpath=ancestor::*[self::div or self::li][1]');
      const likeBtn = row.getByRole('button', { name: /like/i });
      const likesText = row.getByText(/likes\s+\d+/i);
      const before = Number(((await likesText.textContent()) || '').match(/\d+/)?.[0] || 0);
      await likeBtn.click();
      await expect(row.getByText(new RegExp(`likes\\s+${before + 1}`, 'i'))).toBeVisible();
    });

    test('a blog can be deleted (confirm accepted)', async ({ page }) => {
      const row = page.getByText('Blog To Interact').first().locator('xpath=ancestor::*[self::div or self::li][1]');
      page.once('dialog', async (dialog) => {
        await dialog.accept();
      });
      await row.getByRole('button', { name: /delete/i }).click();
      await expect(page.getByText('Blog To Interact')).toHaveCount(0);
    });
  });

  describe('authorization on delete', () => {
    test.beforeEach(async ({ request }) => {
      await request.post(`${API_URL}/testing/reset`);
      await request.post(`${API_URL}/users`, {
        data: { name: 'Creator', username: 'creator', password: 'secret' },
      });
      await request.post(`${API_URL}/users`, {
        data: { name: 'Other', username: 'other', password: 'secret' },
      });
    });

    test('delete button is visible only to the blog creator', async ({ page }) => {
      await page.goto(FRONT_URL);
      await login(page, 'creator', 'secret');
      await createBlog(page, { title: 'Creators Post', author: 'C', url: 'https://c.z' });
      let row = page.getByText('Creators Post').first().locator('xpath=ancestor::*[self::div or self::li][1]');
      const view1 = row.getByRole('button', { name: /view/i });
      if (await view1.isVisible()) await view1.click();
      await expect(row.getByRole('button', { name: /delete/i })).toBeVisible();

      const logoutBtn = page.getByRole('button', { name: /logout/i });
      if (await logoutBtn.isVisible()) await logoutBtn.click();
      await login(page, 'other', 'secret');

      row = page.getByText('Creators Post').first().locator('xpath=ancestor::*[self::div or self::li][1]');
      const view2 = row.getByRole('button', { name: /view/i });
      if (await view2.isVisible()) await view2.click();
      await expect(row.getByRole('button', { name: /delete/i })).toHaveCount(0);
    });
  });

  describe('ordering by likes', () => {
    test.beforeEach(async ({ request, page }) => {
      await request.post(`${API_URL}/testing/reset`);
      await request.post(`${API_URL}/users`, {
        data: { name: 'Seeder', username: 'seeder', password: 'secret' },
      });

      await page.goto(FRONT_URL);
      await login(page, 'seeder', 'secret');

      await createBlog(page, { title: 'Blog A', author: 'A', url: 'https://a.z' });
      await createBlog(page, { title: 'Blog B', author: 'B', url: 'https://b.z' });
      await createBlog(page, { title: 'Blog C', author: 'C', url: 'https://c.z' });

      const viewButtons = page.getByRole('button', { name: /view/i });
      const n = await viewButtons.count();
      for (let i = 0; i < n; i++) await viewButtons.nth(i).click();

      const likeTimes = async (title, times) => {
        const row = page.getByText(title).first().locator('xpath=ancestor::*[self::div or self::li][1]');
        const likeBtn = row.getByRole('button', { name: /like/i });
        for (let i = 0; i < times; i++) {
          await likeBtn.click();
          await expect(row.getByText(new RegExp(`likes\\s+${i + 1}`, 'i'))).toBeVisible();
        }
      };

      await likeTimes('Blog B', 10);
      await likeTimes('Blog C', 7);
      await likeTimes('Blog A', 5);

      await page.reload();
      const view2 = page.getByRole('button', { name: /view/i });
      const n2 = await view2.count();
      for (let i = 0; i < n2; i++) await view2.nth(i).click();
    });

    test('blogs appear in descending order by likes', async ({ page }) => {
      const items = page
        .locator('[data-testid="blog-item"], li, .blog-item')
        .filter({ hasText: 'Blog ' });

      const count = await items.count();
      const likesInOrder = [];

      for (let i = 0; i < count; i++) {
        const text = (await items.nth(i).textContent()) || '';
        const likes = Number(text.match(/likes\s+(\d+)/i)?.[1] || -1);
        likesInOrder.push(likes);
      }

      const sorted = [...likesInOrder].sort((a, b) => b - a);
      expect(likesInOrder).toEqual(sorted);
    });
  });
});
