import React, { useState, useEffect } from 'react';
import metamask from '@metamask/providers';
import { providers, Contract, BigNumber } from 'ethers';
import abi from '../contracts/WavePortal.json';

const getEthereumProvider = (): metamask.BaseProvider | null => {
  return (window as any).ethereum as metamask.BaseProvider | null;
}

const getWaveContract = (ethereum: metamask.BaseProvider): Contract => {
  const provider = new providers.Web3Provider(ethereum);
  const signer = provider.getSigner();
  const wavePortalContract = new Contract("0x0c88aaf352BCbE2744B232e48d3333388E8A26D4", abi.abi, signer);
      
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

const useWaves = (authorizedAccounts: string[]) => {
  const [totalWaves, setTotalWaves] = useState<undefined | number>(undefined);
  const updateTotalWaves = async () => {
    const ethereum = getEthereumProvider();
    if (!ethereum) {
      return;
    }
    if (authorizedAccounts.length > 0) {
      const waveContract = getWaveContract(ethereum);
      const retrievedTotalWaves: BigNumber[] = await waveContract.functions.getTotalWaves();
      if (retrievedTotalWaves && retrievedTotalWaves.length > 0) {
        setTotalWaves(retrievedTotalWaves[0].toNumber());
      }
    }
  };
  useEffect(() => {
    updateTotalWaves();
  }, [authorizedAccounts])

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
      } catch (e) {

      } finally {
        setWaveStatus(WaveStatus.Ready);
      }
    }
  }

  return { totalWaves, wave, waveError, waveStatus, tipAmount, setTipAmount };
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
      Tip Amount (ETH): <i><small>This is entirely optional!</small></i><br/>
      <input type="number" value={tipAmount} onChange={setTipAmount} className="p-2 mt-1 text-black rounded-lg w-full" placeholder="Tip (ETH)" />
      <button className="btn w-full mt-2" disabled={waveStatus != WaveStatus.Ready} onClick={wave}>Send Wave</button>

    </div>
  );
}

const EthWave = () => {
  const _useEthereumWallet = useEthereumWallet();
  const { hasWallet, authorizedAccounts } = _useEthereumWallet;
  const _useWaves = useWaves(authorizedAccounts);
  const { totalWaves } = _useWaves;
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
      <span className="pl-5 text-2xl">{ totalWaves }</span>
      <AddWave useEthereumWallet={_useEthereumWallet} useWaves={_useWaves} />
    </div>
  );
}


export default EthWave;
