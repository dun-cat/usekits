import { Provider, Text } from "..";
import { Wit, log } from 'node-wit';

class WitAI implements Provider {
  client: any;

  private constructor() {

    const actions = {
      confirm_order(contextMap) {
        return { context_map: { ...contextMap, order_confirmation: 'PIZZA42' } };
      },
    };

    this.client = new Wit({
      accessToken: "AW2NYROPT4FTWYWKV5Y3F5BULJMK26CC",
      actions,
      logger: new log.Logger(log.DEBUG), // optional
    });
  }
  async chat(text: string): Promise<any> {
    const res = this.client.message(text);
    console.log(res)
  }

}

export default WitAI;