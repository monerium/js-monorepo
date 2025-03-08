Environments
Monerium maintains several execution environments which may differ in features and availability guarantees. Each API environment comes with a web client which can be used during integration to visualize the data provided by the API.

### Production

Environment which targets a production blockchain involving real emoney.

|              |                                          |
| ------------ | ---------------------------------------- |
| Base Url     | api.monerium.app                         |
| Web client   | monerium.app                             |
| Availability | Stable environment, publicly available   |
| Features     | May be lagging behind other environments |

### Sandbox

Environment which targets a test blockchain involving fake emoney.

|              |                                                                        |
| ------------ | ---------------------------------------------------------------------- |
| Base Url     | api.monerium.dev                                                       |
| Web client   | sandbox.monerium.dev                                                   |
| Availability | Stable environment, publicly available                                 |
| Features     | Parity with production environment while simulating periphery services |
