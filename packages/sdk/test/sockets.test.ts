/**
 * @jest-environment jsdom
 */

import { MoneriumClient, OrderState } from '../src/index';

let client: MoneriumClient;
describe('Sockets', () => {
  let mockWebSocket: jest.Mocked<WebSocket>;
  beforeEach(() => {
    client = new MoneriumClient();

    client.bearerProfile = {
      profile: '123',
      access_token: 'accessToken',
      token_type: '',
      expires_in: 555,
      refresh_token: '',
      userId: '',
    };
    mockWebSocket = {
      addEventListener: jest.fn(),
      close: jest.fn(),
      send: jest.fn(),
      readyState: WebSocket.OPEN,
      // Add other WebSocket methods and properties as needed
    } as unknown as jest.Mocked<WebSocket>;
    // const eventHandler = jest.fn();
    jest.spyOn(window, 'WebSocket').mockImplementation(() => mockWebSocket);
  });
  it('should subscribe', () => {
    client.subscribeOrderNotifications();

    expect(WebSocket).toHaveBeenCalledWith(
      'wss://api.monerium.dev/orders?access_token=accessToken'
    );
  });
  it('should subscribe to a specific event', () => {
    client.subscribeOrderNotifications({
      filter: {
        state: OrderState.pending,
        profile: 'test-profile',
      },
    });

    expect(WebSocket).toHaveBeenCalledWith(
      'wss://api.monerium.dev/orders?access_token=accessToken&profile=test-profile&state=pending'
    );
  });
  it('should subscribe to a specific event', () => {
    client.subscribeOrderNotifications({
      filter: {
        state: OrderState.pending,
        profile: 'test-profile',
      },
    });

    expect(WebSocket).toHaveBeenCalledWith(
      'wss://api.monerium.dev/orders?access_token=accessToken&profile=test-profile&state=pending'
    );
    client.unsubscribeOrderNotifications();
    expect(mockWebSocket.close).toHaveBeenCalled();
  });
});
