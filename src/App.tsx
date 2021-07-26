import { gql } from "@apollo/client";
import React, { useState } from "react";
import { Chains, Subgraph, Subgraphs, TheGraphProvider, useCreateSubgraph, useSubgraph } from "thegraph-react";

function CryptoPunks({ cryptoPunks }: {
  readonly cryptoPunks: Subgraph
}): JSX.Element {
  const { useQuery } = useSubgraph(cryptoPunks);
  const [ type, setType ] = useState<string>('male');

  const { error, loading, data } = useQuery(gql`
    {
      nfts(where: {type: ${type}}) {
        id
        assignedTo {
          id
        }
        saleEvents {
          id
          amount
        }
        type
        accessories
      }
    }
  `);
  
  return (
    <div style={{alignItems: "center", justifyContent: "center", padding: '20px'}}>
      <div style={{width: '100%', textAlign: 'center'}}>
        <select style={{fontSize: '20px', padding: '10px'}} onChange={(e) => setType(e.currentTarget.value)}>
          <option value="male">Male</option>
          <option value="female">Female</option>
        </select><br/><br/>
      </div>

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