import { Account } from "algosdk/src/client/v2/indexer/models/types";
// {
//   "local": {
//   "donations": {},
//   "contributions": {},
//   "given": {},
//   "received": {}
// },
//   "address": "JFO35SMHHGJGZ6ASTFB2N7XD7V74C6GFG7MNJ6NUZH5OLJ4FPJYBDVRMSQ",
//   "amount": 3999982199250500,
//   "amount-without-pending-rewards": 3999982199250500,
//   "apps-local-state": [
//   {
//     "closed-out-at-round": 172,
//     "deleted": false,
//     "id": 1016,
//     "key-value": [
//       {
//         "key": "ZG9uYXRpb25z",
//         "value": {
//           "bytes": "",
//           "type": 2,
//           "uint": 3
//         }
//       },
//       {
//         "key": "bG9jYXRpb24=",
//         "value": {
//           "bytes": "TGFmYXlldHRlLCBMQQ==",
//           "type": 1,
//           "uint": 0
//         }
//       },
//       {
//         "key": "cmVjZWl2ZWQ=",
//         "value": {
//           "bytes": "",
//           "type": 2,
//           "uint": 60000000
//         }
//       },
//       {
//         "key": "dXNlcm5hbWU=",
//         "value": {
//           "bytes": "TWljaGFlbCBGZWhlcg==",
//           "type": 1,
//           "uint": 0
//         }
//       },
//       {
//         "key": "ZGVzY3JpcHRpb24=",
//         "value": {
//           "bytes": "QXV0aXN0aWMgTWFkIFNjaWVudGlzdA==",
//           "type": 1,
//           "uint": 0
//         }
//       },
//       {
//         "key": "Y29udHJpYnV0aW9ucw==",
//         "value": {
//           "bytes": "",
//           "type": 2,
//           "uint": 12
//         }
//       },
//       {
//         "key": "Z2l2ZW4=",
//         "value": {
//           "bytes": "",
//           "type": 2,
//           "uint": 10960000000
//         }
//       }
//     ],
//     "opted-in-at-round": 98,
//     "schema": {
//       "num-byte-slice": 11,
//       "num-uint": 5
//     }
//   }
// ],
//   "apps-total-extra-pages": 2,
//   "apps-total-schema": {
//   "num-byte-slice": 21,
//     "num-uint": 25
// },
//   "created-at-round": 0,
//   "deleted": false,
//   "participation": {
//   "selection-participation-key": "XgW4dEp4scvhtJjU42NYwj1h9PZhXQO9uPjTy0XtAsg=",
//     "state-proof-key": "TXYejqAfnXmjHNVY0o5QedgrwgaWF5LxfSpgRqP+2xxe55YS6qsErnWupmN69t9cPOdlcBzA7+JhvFFI6iPcCQ==",
//     "vote-first-valid": 0,
//     "vote-key-dilution": 10000,
//     "vote-last-valid": 30000,
//     "vote-participation-key": "hnpUV7C/w0TsoIKVcz6Jg2UjCQ+I9/REtgZydgXnadk="
// },
//   "pending-rewards": 0,
//   "reward-base": 0,
//   "rewards": 0,
//   "round": 193,
//   "sig-type": "sig",
//   "status": "Online",
//   "total-apps-opted-in": 1,
//   "total-assets-opted-in": 0,
//   "total-box-bytes": 0,
//   "total-boxes": 0,
//   "total-created-apps": 2,
//   "total-created-assets": 0
// }
export type User = { local: any } & Account;
