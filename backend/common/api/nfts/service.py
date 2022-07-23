import json
from typing import List

from aiographql.client import GraphQLClient, GraphQLResponse

from settings import BACKEND_DIR, ENVIRONMENT, Environment


class NFTService:
    def __init__(self, endpoint: str):
        self.client = GraphQLClient(endpoint=endpoint)
        self._mocked_nfts = self.fetch_mocked_nfts()

    @staticmethod
    def fetch_mocked_nfts() -> List:
        with open(BACKEND_DIR / "common/api/nfts/mocks/nfts.json") as f:
            return json.load(f)

    async def get_nfts_from_graph(self, account_address: str) -> List:
        if ENVIRONMENT == Environment.DEV:
            return self._mocked_nfts

        query = """query ($accountAddress:ID!) {
                  account(id: $accountAddress) {
                    tokens {
                      identifier
                      uri
                      registry {
                        id
                      }
                    }
                  }
                }"""
        try:
            response: GraphQLResponse = await self.client.query(
                query, variables={"accountAddress": account_address}
            )
            if account := response.data.get("account"):
                result = account.get("tokens", [])
            else:
                result = []
        except Exception:
            raise
        return result
