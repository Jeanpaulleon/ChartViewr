// types/alpaca-trade-api.d.ts
declare module '@alpacahq/alpaca-trade-api' {
  interface AlpacaConfig {
    keyId: string;
    secretKey: string;
    paper: boolean;
    usePolygon?: boolean;
  }

  export default class Alpaca {
    constructor(config: AlpacaConfig);
    getAccount(): Promise<any>; // Define more specific types if known
    // Add other methods as needed
  }
}
