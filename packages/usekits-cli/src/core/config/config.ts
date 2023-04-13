import { PluginConfig } from '@src/core/config/decorator';

@PluginConfig()
class MyConfig {
  hello = 1;
  greeting = 2;
  abc = {
    aa: 1,
    bb: {
      ccc: "ccc",
      ddd: [1, 2]
    }
  }
}

export default MyConfig