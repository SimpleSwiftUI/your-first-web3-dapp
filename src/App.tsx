import { gql } from "@apollo/client";
import React from "react";
import { Chains, Subgraph, Subgraphs, TheGraphProvider, useCreateSubgraph, useSubgraph } from "thegraph-react";

const styles ={
  center: { alignItems: "center", justifyContent: "center" },
};

// function Aave({ aave }: {
//   readonly aave: Subgraph,
// }): JSX.Element {
//   const { useQuery } = useSubgraph(aave);
//   const { error, loading, data } = useQuery(gql`
//   {
//     lendingPoolConfigurationHistoryItems(first: 5) {
//       id
//       provider {
//         id
//       }
//       lendingPool
//       lendingPoolCore
//     }
//     lendingPoolConfigurations(first: 5) {
//       id
//       lendingPool
//       lendingPoolCore
//       lendingPoolParametersProvider
//     }
//   }
//   `);
//   return (
//     <div style={styles.center}>
//       {(error || loading) ? 'Loading...' : JSON.stringify(data)}
//     </div>
//   );
// }

function CryptoPunks({ cryptoPunks }: {
  readonly cryptoPunks: Subgraph
}): JSX.Element {
  const { useQuery } = useSubgraph(cryptoPunks);
  const { error, loading, data } = useQuery(gql`
  {
    accounts(first: 5) {
      id
      nft {
        id
      }
      nftsOwned {
        id
      }
      wrappedPunksOwned {
        id
      }
    }
    nfts(first: 5) {
      id
      account {
        id
      }
      transferedTo {
        id
      }
      assignedTo {
        id
      }
    }
  }
  `);

  return (
    <div style={styles.center}>
      {(error || loading) ? 'Loading...' : JSON.stringify(data)}
    </div>
  )
}

export default function App(): JSX.Element {
  const cryptoPunks = useCreateSubgraph({
    [Chains.MAINNET]: 'https://api.thegraph.com/subgraphs/id/Qme7cpR3TvrvFCG5eRL4SKBECrZfrt7ivZZB6MWRUsBgnh',
  });

  const subgraphs = React.useMemo((): Subgraphs => {
    return [cryptoPunks];
  }, [cryptoPunks]);

  return (
    <TheGraphProvider chain={Chains.MAINNET} subgraphs={subgraphs}>
      <CryptoPunks cryptoPunks={cryptoPunks} />
    </TheGraphProvider>
  );
}