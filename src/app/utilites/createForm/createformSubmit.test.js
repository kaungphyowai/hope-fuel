import createFormSubmit from './createformSubmit';

global.fetch = jest.fn();

describe('createFormSubmit', () => {
  let mockEvent,
    mockSetLoading,
    mockSetAmountValidate,
    mockSetMonthValidate,
    mockSetManyChatValidate,
    mockSetFileExist;
  const mockFiles = [{ href: 'http://example.com/file.jpg' }];
  const mockUserInfo = { name: 'John Doe', email: 'john@example.com' };
  const mockCurrency = 'USD';
  const mockSupportRegion = { SupportRegionID: 1 };
  const mockAgentId = 123;

  beforeEach(() => {
    // Mocking event.preventDefault
    mockEvent = {
      preventDefault: jest.fn(),
      currentTarget: {
        elements: {
          amount: { value: '100' },
          month: { value: '2' },
          manyChat: { value: '1' },
          wallets: { value: JSON.stringify({ id: 2 }) },
          notes: { value: 'This is a note' },
          contactLink: { value: 'https://www.facebook.com' },
        },
      },
    };

    // Mock state setting functions
    mockSetLoading = jest.fn();
    mockSetAmountValidate = jest.fn();
    mockSetMonthValidate = jest.fn();
    mockSetManyChatValidate = jest.fn();
    mockSetFileExist = jest.fn();

    global.fetch.mockResolvedValue({
      json: jest.fn().mockResolvedValue({ success: true }),
    });

  
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should prevent default form submission and clear validation states', async () => {
    await createFormSubmit(
      mockEvent,
      mockCurrency,
      mockSupportRegion,
      mockFiles,
      mockUserInfo,
      mockSetLoading,
      'John',
      mockSetAmountValidate,
      mockSetMonthValidate,
      mockSetManyChatValidate,
      true,
      mockSetFileExist,
      mockAgentId,
    );

    expect(mockEvent.preventDefault).toHaveBeenCalled();
    expect(mockSetAmountValidate).toHaveBeenCalledWith(false);
    expect(mockSetMonthValidate).toHaveBeenCalledWith(false);
    expect(mockSetManyChatValidate).toHaveBeenCalledWith(false);
  });

  it('should validate amount, month, and manyChat fields', async () => {
    // Set invalid amount
    mockEvent.currentTarget.elements.amount.value = 'abc';

    await createFormSubmit(
      mockEvent,
      mockCurrency,
      mockSupportRegion,
      mockFiles,
      mockUserInfo,
      mockSetLoading,
      'John',
      mockSetAmountValidate,
      mockSetMonthValidate,
      mockSetManyChatValidate,
      true,
      mockSetFileExist,
      mockAgentId,
    );

    expect(mockSetAmountValidate).toHaveBeenCalledWith(true); // Validation failed
    expect(mockSetLoading).toHaveBeenCalledWith(false); // Loading stopped
    expect(global.fetch).not.toHaveBeenCalled(); // Fetch request not made
  });

  it('should check if files exist and set fileExist to false if empty', async () => {
    await createFormSubmit(
      mockEvent,
      mockCurrency,
      mockSupportRegion,
      [],
      mockUserInfo,
      mockSetLoading,
      'John',
      mockSetAmountValidate,
      mockSetMonthValidate,
      mockSetManyChatValidate,
      true,
      mockSetFileExist,
      mockAgentId,
    );

    expect(mockSetFileExist).toHaveBeenCalledWith(false);
    expect(mockSetLoading).toHaveBeenCalledWith(false); // Loading stopped
    expect(global.fetch).not.toHaveBeenCalled(); // Fetch request not made
  });

  it('should make an API call with the correct request options', async () => {
    await createFormSubmit(
      mockEvent,
      mockCurrency,
      mockSupportRegion,
      mockFiles,
      mockUserInfo,
      mockSetLoading,
      'John',
      mockSetAmountValidate,
      mockSetMonthValidate,
      mockSetManyChatValidate,
      true,
      mockSetFileExist,
      mockAgentId,
    );

    const expectedPayload = JSON.stringify({
      customerName: 'John Doe',
      customerEmail: 'john@example.com',
      agentId: mockAgentId,
      supportRegionId: mockSupportRegion.SupportRegionID,
      manyChatId: '1',
      contactLink: 'https://www.facebook.com',
      amount: '100',
      month: '2',
      note: 'This is a note',
      walletId: { id: 2 },
      screenShot: [{ url: 'http://example.com/file.jpg' }],
    });

    expect(global.fetch).toHaveBeenCalledWith('/api/submitPayment/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: expectedPayload,
      redirect: 'follow',
    });
  });

  it('should reload the page after successful submission', async () => {
    await createFormSubmit(
      mockEvent,
      mockCurrency,
      mockSupportRegion,
      mockFiles,
      mockUserInfo,
      mockSetLoading,
      'John',
      mockSetAmountValidate,
      mockSetMonthValidate,
      mockSetManyChatValidate,
      true,
      mockSetFileExist,
      mockAgentId,
    );

    expect(location.reload).toHaveBeenCalled();
  });
});
