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
      # nfts(where: {id: 8192}) {
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

      <div style={{flex: 1, flexDirection: 'row', display: 'flex', borderStyle: 'solid', borderWidth: '1px', padding: 20}}>

        <div style={{flex: 1, textAlign: 'left', }}>
          <h1>CryptoPunks Browser</h1>
        </div>

        <div style={{textAlign: 'left', flex: 2, alignSelf: 'center'}}>
          <h3>Select type: <select style={{fontSize: '20px', padding: '10px'}} onChange={(e) => setType(e.currentTarget.value)}>
            <option value="male">Male</option>
            <option value="female">Female</option>
            <option value="alien">Alien</option>
            <option value="ape">Ape</option>
            <option value="zombie">Zombie</option>
          </select></h3>
        </div>

      </div>

      {(error || loading) ? (
        <blockquote><br/><br/>Loading...</blockquote>
        ) : (
          (data as any).nfts.map((n: any, i: number) => {
            return (
              <div key={`nft-index-${i}`} style={{
                marginRight: 'auto',
                marginLeft: 'auto',
                padding: 10,
                margin: 20,
                borderWidth: '1px',
                borderStyle: 'solid',
                flexDirection: 'row',
                display: 'flex'
              }}>
                <div style={{flex: 1, padding: 10, alignSelf: 'center'}}>
                  CryptoPunk id: <code>{n.id.toString()}</code>
                </div>

                <div style={{flex: 3, padding: 10}}>
                  Accessories:<br/>{n.accessories.join(', ')}
                </div>

              </div>
            )
          })
        )
      }




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