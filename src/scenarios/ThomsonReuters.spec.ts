import { expect, test } from '@playwright/test';

const HOME_URL = 'https://www.thomsonreuters.com.br/pt.html';

test.describe('Thomson Reuters Brasil E2E', () => {
	test.beforeEach(async ({ page }) => {
		await page.goto(HOME_URL, { waitUntil: 'domcontentloaded' });

		const rejectAllButton = page.getByRole('button', { name: 'Reject All' });
		if (await rejectAllButton.isVisible().catch(() => false)) {
			await rejectAllButton.click();
		}
	});

	test('deve alternar para a aba Jurídico', async ({ page }) => {
		const legalTab = page.getByRole('tab', { name: 'Jurídico' });

		await legalTab.click();

		await expect(legalTab).toHaveAttribute('aria-selected', 'true');
		await expect(
			page.getByRole('tabpanel', { name: 'Jurídico' })
		).toContainText('Visual Law: o que é e benefícios');
	});

	test('deve expandir a FAQ sobre áreas atendidas', async ({ page }) => {
		const areasQuestion = page.getByRole('button', {
			name: 'Quais áreas a Thomson Reuters atende no Brasil?'
		});

		await areasQuestion.click();

		await expect(areasQuestion).toHaveAttribute('aria-expanded', 'true');
		await expect(
			page.getByText('A Thomson Reuters Brasil atua em quatro áreas-chave')
		).toBeVisible();
	});

	test('deve pesquisar Legal One e exibir resultados', async ({ page }) => {
		await page.getByRole('button', { name: 'Search' }).click();

		const searchBox = page.getByRole('combobox', { name: 'Search' });
		await searchBox.fill('Legal One');
		await searchBox.press('Enter');

		await expect(page).toHaveURL(/\/pt\/pesquisa\.html#q=Legal%20One/);
		await expect(
			page.getByRole('heading', { name: /Showing 1 to 10 of .* results/ })
		).toBeVisible();
		await expect(
			page.getByRole('link', { name: 'Legal One', exact: true }).first()
		).toBeVisible();
	});

});
