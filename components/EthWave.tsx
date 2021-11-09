import React, { useState, useEffect } from 'react';
import metamask from '@metamask/providers';
import { providers, Contract, BigNumber } from 'ethers';
import abi from '../contracts/WavePortal.json';
import { WavePortal } from '../contracts/WavePortal';

const getEthereumProvider = (): metamask.BaseProvider | null => {
  return (window as any).ethereum as metamask.BaseProvider | null;
}

const getWaveContract = (ethereum: metamask.BaseProvider): WavePortal => {
  const provider = new providers.Web3Provider(ethereum);
  const signer = provider.getSigner();
  const wavePortalContract: WavePortal = new Contract("0x47eda2c8387642174c1B8955252b19e08AeadC05", abi.abi, signer) as WavePortal;
      
  return wavePortalContract;
}

const useEthereumWallet = () => {

  const [hasWallet, setHasWallet] = useState(true);
  const [authorizedAccounts, setAccounts] = useState<string[]>([]); 

  useEffect(() => {
    const ethereum = getEthereumProvider();
    if (!ethereum) {
      setHasWallet(false);
      return
    } else {
      setHasWallet(true);
    }

    (async () => {
      console.log("fetching accounts..");
      const accounts = await ethereum.request<string[]>({ method: "eth_accounts" });
      if (accounts && accounts.length > 0) {
        setAccounts((accounts as string[]));
      } else {
        console.log("no authorized accounts!");
      }
    })();
  }, []);

  const requestAccounts = async () => {
    const ethereum = getEthereumProvider();
    if (!ethereum) {
      return;
    }
    const accounts = await ethereum.request<string[]>({ method: "eth_requestAccounts" });
    if (accounts && accounts.length > 0) {
      setAccounts((accounts as string[]));
    }
  }


  return {
    hasWallet,
    authorizedAccounts,
    requestAccounts,
  }
};

enum WaveStatus {
  Ready = 1,
  Mining = 2,
  Mined = 3,
}

const useWaves = (hasEthWallet: boolean, authorizedAccounts: string[]) => {
  const [totalWaves, setTotalWaves] = useState<undefined | number | "loading">(undefined);
  const [allWaves, setAllWaves] = useState<undefined | "loading" | { owner: string, awarded: boolean, timestamp: BigNumber }[]>(undefined);
  const canGetContract = (): boolean => {
    const ethereum = getEthereumProvider();
    return !!ethereum && authorizedAccounts.length > 0;
  }
  const updateTotalWaves = async () => {
    const ethereum = getEthereumProvider();
    if (canGetContract() && ethereum) {
      const waveContract = getWaveContract(ethereum);
      const retrievedTotalWaves = await waveContract.getTotalWaves();
      setTotalWaves(retrievedTotalWaves.toNumber());
    }
  };
  const updateAllWaves = async () => {
    const ethereum = getEthereumProvider();
    if (canGetContract() && ethereum) {
      const waveContract = getWaveContract(ethereum);
      const waves = await waveContract.getAllWaves();
      setAllWaves(waves);
    }
  }
  useEffect(() => {
    if (totalWaves !== "loading") {
      updateTotalWaves();
    }
    if (allWaves !== "loading") {
      updateAllWaves();
    }
  }, [authorizedAccounts, hasEthWallet])


  const [tipAmount, _setTipAmount] = useState(0);
  const [waveStatus, setWaveStatus] = useState(WaveStatus.Ready);
  const [waveError, setWaveError] = useState<null | string>(null);

  const setTipAmount = (e: any) => {
    const value: number = Number(e.target.value);
    if (value < 0) {
      _setTipAmount(0);
    } else if (value > 10) {
      _setTipAmount(10);
    } else {
      _setTipAmount(value);
    }
  }

  const wave = async () => {
    const ethereum = getEthereumProvider();
    if (!ethereum) {
      return;
    }
    if (authorizedAccounts.length > 0) {
      const waveContract = getWaveContract(ethereum);

      try {
        const waveTransaction = await waveContract.functions.wave();
        console.log(`Mining...${waveTransaction.hash}`);
        setWaveStatus(WaveStatus.Mining);
        await waveTransaction.wait();
        setWaveStatus(WaveStatus.Mined);
        console.log(`Mined! ${waveTransaction.hash}`);
        await updateTotalWaves();
        await updateAllWaves();
      } catch (e) {
        setWaveError(`Oops, transaction failed. You may want to try again later. There is a 15 minute cooldown.`)
        setTimeout(() => {
          setWaveError(null);
        }, 3000)
      } finally {
        setWaveStatus(WaveStatus.Ready);
      }
    }
  }

  return { totalWaves, allWaves, wave, waveError, waveStatus, tipAmount, setTipAmount };
}

const AddWave = ({ useEthereumWallet, useWaves } : { useEthereumWallet: ReturnType<useEthereumWallet>,  useWaves: ReturnType<useWaves> }) => {
  const { authorizedAccounts, requestAccounts, } = useEthereumWallet;
  const { wave, waveError, waveStatus, tipAmount, setTipAmount } = useWaves
  if (authorizedAccounts.length == 0) {
    return (
      <div className="mt-5 flex flex-col justify-center items-center">
        No authorized Ethereum addresses detected. Would you like to add a wave?
        <button className="btn mt-5" onClick={requestAccounts}>
          Authenticate
        </button>
      </div>
    );
  }
  return (
    <div className="mt-5">
      <button className="btn w-full mt-2" disabled={waveStatus != WaveStatus.Ready} onClick={wave}>
        Send Wave
      </button>
      {waveError ? waveError : ""}
    </div>
  );
}

const EthWave = () => {
  const _useEthereumWallet = useEthereumWallet();
  const { hasWallet, authorizedAccounts } = _useEthereumWallet;
  const _useWaves = useWaves(hasWallet, authorizedAccounts);
  const { totalWaves, allWaves } = _useWaves;
  if (!hasWallet) {
    return (
      <div className="m-24">
        Oh, hm. You don't have an Ethereum wallet. You can't see this part of the site, sorry!
      </div>
    );
  }
  return (
    <div className="m-24">
      <strong className="text-xl">Total Waves</strong>: 
      {authorizedAccounts.length > 0 ? 
        <span className="pl-5 text-2xl">{totalWaves}</span> :
        <span className="pl-5 text-xs">Must authenticate</span>
      }
      <br/>
      <br/>
      <small>
        Hey, welcome, fellow dweb dweller. Make sure you're on the Rinkeby Test Net to use this app.<br /><br />
        There's a 25% chance you'll get a 0.0001 Ethereum reward~<br /><br />
      </small>
      Wave List
      <hr className="py-2"/>
      { allWaves == "loading" && "Loading..."}
      {
        allWaves && allWaves !== "loading" && allWaves.length > 0 ?
        allWaves.map((wave, idx) => (
          <div className="wave" key={idx}>
            <div className="address">
              <a href={`https://rinkeby.etherscan.io/address/${wave.owner}`} target="_blank">
                0x..{ wave.owner.substring(wave.owner.length - 4) }
              </a>
            </div>
            { wave.awarded && <div className="rewarded">Awarded 0.0001 - Thanks for waving!</div> }
            <div className="timestamp">{ new Date(wave.timestamp.toNumber() * 1000).toISOString("short") }</div>
          </div>
        )) :
        <div>
          No waves, yet. You could be the first!
        </div>
      }
      
      <AddWave useEthereumWallet={_useEthereumWallet} useWaves={_useWaves} />
    </div>
  );
}


export default EthWave;
