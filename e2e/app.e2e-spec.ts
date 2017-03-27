import { Ngteste1Page } from './app.po';

describe('ngteste1 App', function() {
  let page: Ngteste1Page;

  beforeEach(() => {
    page = new Ngteste1Page();
  });

  it('should display message saying app works', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('app works!');
  });
});
