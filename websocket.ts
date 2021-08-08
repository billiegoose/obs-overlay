export class ReliableWebSocket extends EventTarget {
  private tryReconnect = true;
  private unsuccessfulReconnects = 0;
  public reconnectTimeoutBase = 1200;
  public maxReconnectTimeout = 2500;
  private connected = false;
  constructor (private url: string) {
    super();
  }
  public connect() {
    this.tryReconnect = true;
    if (this.connected) return;
    this.dispatchEvent(new CustomEvent('connecting'));
    this.setup();
  }
  public disconnect() {
    this.tryReconnect = false;
    this.onClose();
  }
  private setup() {
    const ws = new WebSocket(this.url);
    ws.onerror = this.onError.bind(this);
    ws.onmessage = this.onMessage.bind(this);
    ws.onopen = this.onOpen.bind(this);
    ws.onclose = this.onClose.bind(this);
  }
  private onMessage ({ data }: MessageEvent<any>) {
    console.log(data)
    const nl = data.indexOf('\n');
    const cmd = nl === -1 ? data : data.slice(0, nl);
    const payload = nl === -1 ? void 0 : data.slice(nl + 1);
    this.dispatchEvent(new CustomEvent(cmd, { detail: payload }));
  }
  private onError (ev: Event) {
    console.warn(ev);
  }
  private onOpen () {
    this.unsuccessfulReconnects = 0;
    this.connected = true;
    this.dispatchEvent(new CustomEvent('connected'));
  }
  private onClose () {
    if (this.connected) {
      this.connected = false;
      this.dispatchEvent(new CustomEvent('disconnected'));
    } else {
      this.unsuccessfulReconnects++;
    }
    if (this.tryReconnect) {
      setTimeout(
        this.setup.bind(this),
        this.delayAmount(),
      )
    }
  }
  // Copied shamelessly from 'y-websocket' library.
  // Start with no reconnect timeout and increase timeout by
  // log10(wsUnsuccessfulReconnects).
  // The idea is to increase reconnect timeout slowly and have no reconnect
  // timeout at the beginning (log(1) = 0)
  private delayAmount() {
    return Math.min(Math.log10(this.unsuccessfulReconnects + 1) * this.reconnectTimeoutBase, this.maxReconnectTimeout)
  }
}
