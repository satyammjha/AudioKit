const { worker, sum, getTabLevel, containsTab } = require('./worker');

// Example test
test('adds 1 + 2 to equal 3', () => {
  expect(worker(1, 2)).toBe(3);

});

// Example test
test('adds 1 + 2 to equal 3', () => {
  expect(sum(1, 2)).toBe(3);
});

// getTabLevel tests
describe('getTabLevel', () => {
  it('[TABID = NULL] returns 100 if levels is null', async () => {
    chrome.storage.local.get = jest.fn().mockImplementation((key) => {
      return Promise.resolve({ levels: null });
    }); 

    const tabLevel = await getTabLevel('someTabId');
    expect(tabLevel).toBe(100);
  });
  
  it('[LEVEL = 2]returns the tab level times 100 if the tab level is found', async () => {
    const tabId = 'someTabId';
    const level = 2;
    chrome.storage.local.get = jest.fn().mockImplementation((key) => {
      return Promise.resolve({ levels: { [tabId]: level } });
    }); 

    const tabLevel = await getTabLevel(tabId);
    expect(tabLevel).toBe(level * 100);
  });

  it('[LEVEL = 0] Returns the tab level if the tab level is found', async () => {
    const tabId = 'myTabId';
    const level = 0;
    chrome.storage.local.get = jest.fn().mockImplementation((key) => {
      return Promise.resolve({ levels: { [tabId]: level } });
    });

    const tabLevel = await getTabLevel(tabId);
    expect(tabLevel).toBe(level * 100);
  });


  it('[LEVEL = -1] Should default to 100 if level < 0', async () => {
    const tabId = 'myTabId';
    const level = -1;
    chrome.storage.local.get = jest.fn().mockImplementation((key) => {
      return Promise.resolve({ levels: { [tabId]: level } });
    });

    const tabLevel = await getTabLevel(tabId);
    expect(tabLevel).toBe(100);
  });

});

// containsTab tests
describe('containsTab', () => {
  
  it('[LEVELS = NULL] Returns if the tabId exists', async() => {
    const tabId = 'myTabId';
    const level = 0;
    chrome.storage.local.get = jest.fn().mockImplementation((key) => {
      return Promise.resolve({ levels: null });
    }); 

    const tabExists = await containsTab(tabId);
    expect(tabExists).toBe(false);
  });

  it('[TABID = NULL] Returns if the tabId exists', async() => {
    const tabId = 'myTabId';
    const level = 0;
    const notMyTabId = 'notMyTabId';
    chrome.storage.local.get = jest.fn().mockImplementation((key) => {
      return Promise.resolve({ levels: {[notMyTabId] : level } });
    }); 

    const tabExists = await containsTab(tabId);
    expect(tabExists).toBe(false);
  });

  it('[TABID = myTabId] Returns if the tabId exists', async() => {
    const tabId = 'myTabId';
    const level = 0;
    chrome.storage.local.get = jest.fn().mockImplementation((key) => {
      return Promise.resolve({ levels: {[tabId] : level } });
    }); 

    const tabExists = await containsTab(tabId);
    expect(tabExists).toBe(true);
  });


});