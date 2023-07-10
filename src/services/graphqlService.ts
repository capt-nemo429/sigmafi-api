import { AddressBalance, QueryAddressesArgs } from "@ergo-graphql/types";
import { Client, createClient, gql, fetchExchange } from "@urql/core";

class GraphQLService {
  private _client: Client;
  constructor() {
    this._client = createClient({
      url: "https://graphql.erg.zelcore.io/",
      requestPolicy: "network-only",
      exchanges: [fetchExchange],
    });
  }

  public async getBalance(addresses: string[]) {
    const query = gql<
      { addresses: { balance: AddressBalance }[] },
      QueryAddressesArgs
    >`
      query balances($addresses: [String!]!) {
        addresses(addresses: $addresses) {
          balance {
            nanoErgs
            assets {
              tokenId
              amount
              decimals
            }
          }
        }
      }
    `;

    const response = await this._client.query(query, { addresses }).toPromise();

    return response.data?.addresses.flatMap((x) => x.balance) || [];
  }
}

export const graphQLService = new GraphQLService();
